<template>
  <VForm v-on:submit="nextStep" v-bind:class="$style.container">
    <p v-bind:class="$style.prompt">
      What is your email address? We'll use it to email your receipt.
    </p>
    <div v-bind:class="$style.topWrapper">
      <VTextField
        v-model="email"
        v-bind:class="$style.input"
        placeholder="Email Address *"
        color="#c5235c"
        background-color="#fff"
        v-bind:height="isTabletOrMobile ? '3rem' : '4rem'"
        type="email"
        filled
        outlined
        rounded
        hide-details
        v-on:input="checkValidations"
        v-bind:rules="[
          (value) =>
            !validations.email || !email.length
              ? 'Please enter a valid email'
              : true,
        ]"
      />
    </div>
    <VBtn
      v-bind:class="$style.btn"
      v-bind:height="isTabletOrMobile ? '4rem' : '5rem'"
      background-color="#fff"
      filled
      outlined
      rounded
      type="submit"
    >
      Next
    </VBtn>
    <p v-if="failedValidation" v-bind:class="$style.error">
      Please enter a valid email address.
    </p>
  </VForm>
</template>

<script>
export default {
  data: () => ({
    email: "",
    failedValidation: false,
    validations: {
      email: false,
    },
  }),

  computed: {
    isTabletOrMobile() {
      return this.$mq === "md" || this.$mq === "sm" || this.$mq === "xs";
    },
  },

  created() {
    // If the user reset the checkout flow, we can assume we've store some state to prefill
    // some of the fields
    if (this.$store.state.userData?.email) {
      this.email = this.$store.state.userData.email;

      // Does it pass validation?
      this.validations.email = this.email.length;
    }
  },

  methods: {
    /**
     * Ensure fields are validated
     */
    checkValidations() {
      this.validations.email =
        // Ensure there's a @ symbol
        this.email.includes("@") &&
        // Ensure a proper email host is entered
        this.email.split("@")[1].includes(".") &&
        // Ensure the email host is longer than 1 character (i.e. co, com, org, io, etc)
        this.email.split("@")[1].split(".")[1].length > 1;

      // Check if validation has failed
      this.failedValidation = Boolean(!this.validations.email);
    },

    /**
     * Proceed to the next checkout rental step
     */
    nextStep(e) {
      e.preventDefault();
      e.stopPropagation();
      // Check if validation has failed
      this.failedValidation = Boolean(!this.validations.email);

      if (!this.failedValidation) {
        // store the user data in the store
        this.$store.commit("setUserData", {
          email: this.email,
        });

        // Update the mixpanel user profile
        this.$mixpanel.people.set({
          email: this.email,
        });

        // Associate the new user profile with the mixpanel distinct id.
        // This must be called everytime mixpanel.people.* is used.
        // NOTE: this may be updated with unique ID from wheels?
        this.$mixpanel.identify(this.$mixpanel_unique_id);

        // Track step 4
        this.$mixpanel.track("step 4", {
          email: this.email,
        });

        // Move to the next step
        this.$store.commit(
          "updateRentalCheckoutStep",
          this.$store.state.rentalCheckoutStep + 1
        );

        /// Push the next step into the window history
        if (process.isClient) {
          window.history.pushState({ step: 5 }, null, "#step=5");
        }
      }
    },
  },
};
</script>

<style lang="css" module>
.container {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    position: relative;
    width: 50rem;
    z-index: 20;
}

.prompt {
    font-weight: 600;
    font-size: 2.25rem;
    text-align: center;
}

.topWrapper {
    display: flex;
    margin: 2rem auto 0;
    max-width: 20rem;
    width: 100%;
}

.input:global(.v-text-field.v-text-field--enclosed) {
    margin-bottom: 2.25rem;
}

.input,
.btn {
    border-radius: 50px;
}

.input :global(.v-text-field__slot) input,
.input :global(.v-text-field__slot) input::placeholder {
    font-size: 1.25rem;
    text-align: center;
}

.btn {
    background-color: #e1b426;
    border-color: transparent;
    border-radius: 50px;
    margin: 0 auto;
    width: 17rem;
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
    .container {
        width: 30rem;
    }

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
    .input :global(.v-text-field__slot) input,
    .input :global(.v-text-field__slot) input::placeholder {
        font-size: 1rem;
    }
}
</style>
