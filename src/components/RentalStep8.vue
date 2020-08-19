<template>
  <div v-if="isReady" v-bind:class="$style.container">
    <p v-bind:class="$style.prompt">Pay With Card</p>
    <!-- <VBtn
      v-bind:class="$style.applePayBtn"
      color="#e8627f"
      height="3.5rem"
      rounded
    >
      <g-image v-bind:class="$style.applePayLogo" src="~/assets/applePay.png" />
      Pay
    </VBtn>
    <div v-bind:class="$style.paymentPrompt">
      <hr />
      <span>Pay with card</span>
      <hr />
    </div> -->
    <g-image v-bind:class="$style.creditCards" src="~/assets/creditcards.png" />
    <div
      v-bind:class="[
        $style.stripeElementsContainer,
        {
          [$style.visible]: stripeElementsHaveLoaded,
        },
      ]"
    >
      <div ref="card" v-bind:class="$style.customStripeInput" />
      <VTextField
        v-model="name"
        v-bind:class="$style.vuetifyInput"
        color="#c5235c"
        v-bind:height="isTabletOrMobile ? '3rem' : '4rem'"
        placeholder="Name on Card"
        rounded
        outlined
        v-bind:rules="[(value) => (!value ? 'Required' : true)]"
        hide-details
      />
      <!-- <VTextField
        v-model="countryOrRegion"
        v-bind:class="$style.vuetifyInput"
        color="#c5235c"
        v-bind:height="isTabletOrMobile ? '3rem' : '4rem'"
        placeholder="Country / Region"
        rounded
        outlined
        v-bind:rules="[(value) => (!value ? 'Required' : true)]"
        hide-details
      /> -->
      <VTextField
        v-model="zipCode"
        v-bind:class="$style.vuetifyInput"
        color="#c5235c"
        v-bind:height="isTabletOrMobile ? '3rem' : '4rem'"
        placeholder="Zip Code"
        rounded
        outlined
        v-bind:rules="[(value) => (!value ? 'Required' : true)]"
        hide-details
      />
      <VBtn
        v-bind:class="$style.btn"
        v-bind:height="isTabletOrMobile ? '4rem' : '5rem'"
        background-color="#fff"
        filled
        outlined
        rounded
        v-on:click="nextStep"
      >
        Next
      </VBtn>
    </div>
    <p
      v-if="(!token && stripeValidationError) || failedValidation"
      v-bind:class="$style.error"
    >
      {{ stripeValidationError || "Please fill out all the fields above." }}
    </p>
  </div>
</template>

<script>
export default {
  data: () => ({
    countryOrRegion: "US",
    elements: [],
    isReady: false,
    failedValidation: false,
    name: "",
    publishableKey: process.env.GRIDSOME_STRIPE_PUBLISHABLE_API_KEY,
    stripeElementsHaveLoaded: false,
    stripeValidationError: "",
    token: null,
    zipCode: "",
  }),

  computed: {
    isTabletOrMobile() {
      return this.$mq === "md" || this.$mq === "sm" || this.$mq === "xs";
    },
  },

  async created() {
    // Lazy load stripe library
    const { loadStripe } = await import("@stripe/stripe-js");

    // Assign the Stripe instance
    this.Stripe = await loadStripe(this.publishableKey);

    // After the Stripe library has been instantiated, denote that the component
    // is ready to render.
    this.isReady = true;

    // New regex to test if the entered phone number is numbers only
    this.checkForNumbersOnly = new RegExp("^[0-9]+$");
  },

  mounted() {
    this.$watch("isReady", () => {
      this.instantiateStripeElements();

      // This allows the created Stripe element and vuetify form fields to load
      // at the same time (after the stripe element has mounted)
      setTimeout(() => (this.stripeElementsHaveLoaded = true), 800);
    });
  },

  methods: {
    /**
     * Instantiates Stripe element(s)
     */
    instantiateStripeElements() {
      this.stripeCardElement = this.Stripe.elements().create("card", {
        hidePostalCode: true,
        hideIcon: true,
        style: this.stripeElementsStyles(),
        pladeholder: "Card Number",
      });

      // Mount the Stripe elements
      this.stripeCardElement.mount(this.$refs.card);

      // Attempt to create the token
      this.stripeCardElement.on("change", (event) =>
        this.createStripePaymentToken(event)
      );
    },

    /**
     * Custm Stripe Element styles
     */
    stripeElementsStyles() {
      return {
        base: {
          fontSize: this.isTabletOrMobile ? "1.1rem" : "1.35rem",
          fontFamily: "Poppins",
          fontWeight: "100",
          letterSpacing: "1px",
          lineHeight: this.isTabletOrMobile ? "3.75rem" : "4.5rem",
          "::placeholder": {
            color: "#aeaeae",
            fontSize: this.isTabletOrMobile ? "1.1rem" : "1.35rem",
          },
        },
      };
    },

    /**
     * Generate a single token by converting the entered payment information via Stripe's API
     */
    createStripePaymentToken(event) {
      this.Stripe.createToken(this.stripeCardElement, {
        name: this.name,
        address_zip: this.zipCode,
        address_country: this.countryOrRegion,
      }).then(({ error, token }) => {
        if (error) {
          this.stripeValidationError = error.message;
        } else {
          this.token = token.id;
          this.stripeValidationError = "";
        }
      });
    },

    /**
     * This is where we'll send the payment intent
     */
    async processTransaction(transactionToken) {
      // This is where we'll process the transation
    },

    /**
     * Proceed to the next checkout rental step
     */
    async nextStep() {
      this.failedValidation = Boolean(
        !this.name.length ||
          !this.countryOrRegion ||
          !(
            this.checkForNumbersOnly.test(this.zipCode) &&
            this.zipCode.length === 5
          )
      );

      if (this.token) {
        if (!this.failedValidation) {
          // Process the payment
          await this.processTransaction(this.token);

          // store the user data in the store
          this.$store.commit("setUserData", {
            paymentSuccessful: true,
            stripeToken: this.token,
          });

          // Track step 8
          this.$mixpanel.track("step 8");
          dataLayer.push({
            event: "Completed onboarding step",
            stepName: "Payment information",
            stepNumber: "8",
          });

          // Move to the next step
          this.$store.commit(
            "updateRentalCheckoutStep",
            this.$store.state.rentalCheckoutStep + 1
          );

          // Push the next step into the window history
          if (process.isClient) {
            window.history.pushState({ step: 9 }, null, "#step=9");
          }
        }
      } else {
        this.$store.commit("setUserData", {
          paymentSuccessful: false,
        });
      }
    },
  },
};
</script>

<style lang="css" module>
.container {
    display: flex;
    flex-direction: column;
    margin: -6rem auto 0;
    position: relative;
    text-align: center;
    width: 34rem;
    z-index: 20;
}

.stripeElementsContainer {
    opacity: 0;
    text-align: center;
    transition: .2s ease-in;
}

.visible {
    opacity: 1;
}

.prompt {
    font-weight: 600;
    font-size: 2.1rem;
    align-self: center;
    text-align: center;
}

.customStripeInput {
    height: 4rem;
    background: #fff;
    border-radius: 50px;
    border: 1px solid rgba(0, 0, 0, .4);
    margin: 1rem 0;
    padding-left: 1.5rem;
    transition: .2s ease-in-out;
}

.vuetifyInput:global(.v-text-field.v-text-field--enclosed) {
    margin: 1.25rem 0;
}

.vuetifyInput :global(.v-text-field__slot) input,
.inputRvuetifyInputight :global(.v-text-field__slot) input::placeholder {
    font-size: 1.25rem;
}

.vuetifyInput :global(.v-text-field__slot) input::placeholder {
    color: #aeaeae;
}

.vuetifyInput {
    background: #fff;
    border-radius: 50px;
}

.applePayBtn {
    border-radius: 50px;
    margin: 0 auto;
    width: 10rem;
}

.applePayLogo {
    margin: 0 .5rem .25rem 0;
}

.btn {
    background-color: #e1b426;
    border-color: transparent;
    border-radius: 50px;
    height: 5rem;
    width: 17rem;
}

.applePayBtn span {
    color: #fff;
    font-size: 1.25rem;
}

.paymentPrompt {
    align-items: center;
    display: flex;
    justify-content: center;
    width: 100%;
}

.paymentPrompt span {
    font-weight: 600;
    font-size: 1.15rem;
    margin: .75rem .5rem;
    width: 100%;
}

.paymentPrompt hr {
    height: 0;
    border: none;
    border-top: 1px solid #c0c0c0;
    width: 100%;
}

.creditCards {
    margin: 0 auto .5rem;
}

.btn span {
    color: #fff;
    font-size: 1.75rem;
}

.error {
    color: #ff5252;
    font-size: .75rem;
    margin-top: 1.5rem;
    text-align: center;
}

@media only screen and (max-width: 1200px) {
    .prompt {
        font-size: 1.5rem;
    }

    .btn {
        max-width: 13rem;
        width: 100%;
    }

    .btn span {
        font-size: 1.4rem;
    }
}

@media only screen and (max-width: 768px) {
    .container {
        margin-top: -2rem;
    }

    .customStripeInput {
        height: 3.5rem;
    }

    .vuetifyInput :global(.v-text-field__slot) input,
    .inputRvuetifyInputight :global(.v-text-field__slot) input::placeholder {
        font-size: 1rem;
    }

    .btn {
        margin-bottom: 2rem;
    }
}
</style>
