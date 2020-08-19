<template>
  <div v-if="isReady" v-bind:class="$style.container">
    <div v-bind:class="$style.topContainer">
      <p v-bind:class="$style.prompt">Review your cart</p>
      <p v-bind:class="$style.deliveredTo">Delivered to:</p>
      <p v-bind:class="$style.address">{{ $store.state.userData.address }}</p>
      <div v-bind:class="$style.plans">
        <VBtn
          v-bind:class="[
            $style.planBtn,
            {
              [$style.activeWeekly]: isActiveWeeklyPlan,
            },
          ]"
          depressed
          rounded
          height="3rem"
          v-on:click="updateSelectedBikePlan('weekly')"
        >
          7-Days
        </VBtn>
        <VBtn
          v-bind:class="[
            $style.planBtn,
            {
              [$style.activeOneMonth]: isActiveOneMonthPlan,
            },
          ]"
          depressed
          rounded
          height="3rem"
          v-on:click="updateSelectedBikePlan('oneMonth')"
        >
          30-Days
        </VBtn>
        <VBtn
          v-bind:class="[
            $style.planBtn,
            {
              [$style.activeThreeMonth]: isActiveThreeMonthPlan,
            },
          ]"
          depressed
          rounded
          height="3rem"
          v-on:click="updateSelectedBikePlan('threeMonth')"
        >
          90-Days
        </VBtn>
      </div>
    </div>
    <div v-bind:class="$style.rentalInfoContainer">
      <g-image
        v-if="$store.state.userData.bikeRentalType === 'private'"
        v-bind:class="$style.image"
        src="~/assets/privateRental.png"
      />
      <g-image
        v-else
        v-bind:class="$style.image"
        src="~/assets/deliveryRental.png"
      />
      <p>
        {{
          $store.state.userData.bikeRentalType === "private"
            ? "Private"
            : "Delivery"
        }}
        Rental
      </p>
    </div>
    <VBtn
      v-bind:class="$style.btn"
      height="5rem"
      filled
      outlined
      rounded
      :loading="this.loading"
      v-on:click="nextStep"
    >
      Pay
      {{
        determineButtonText(
          bikeRentalPlan || $store.state.userData.bikeRentalPlan
        )
      }}
    </VBtn>
  </div>
</template>

<script>
import { GET_AVAILABLE_PLANS } from "@/graphql";
import gql from "graphql-tag";
export default {
  data() {
    return {
      bikeRentalPlan: null,
      isActiveThreeMonthPlan: null,
      isActiveOneMonthPlan: null,
      isActiveWeeklyPlan: null,
      isReady: false,
      loading: false,
      // NOTE: temporary plans array until Wheels api is set up
      plans: [],
    };
  },

  apollo: {
    plans: {
      query: GET_AVAILABLE_PLANS,
      variables() {
        return {
          zip_code: this.$store.state.userData.zipCode,
          rental_type: this.$store.state.userData.bikeRentalType,
        };
      },
    },
  },

  created() {
    // If the user reset the checkout flow, we can assume we've store some state to prefill
    // some of the fields
    this.isActiveThreeMonthPlan = Boolean(
      this.$store.state.userData.bikeRentalPlan?.type === "threeMonth"
    );
    this.isActiveOneMonthPlan = Boolean(
      this.$store.state.userData.bikeRentalPlan?.type === "oneMonth"
    );
    this.isActiveWeeklyPlan = Boolean(
      this.$store.state.userData.bikeRentalPlan?.type === "weekly"
    );

    this.isReady = true;
  },

  methods: {
    /**
     * Determines what plan the user selected
     */
    updateSelectedBikePlan(bikeRentalPlan) {
      if (bikeRentalPlan === "threeMonth") {
        this.isActiveOneMonthPlan = false;
        this.isActiveWeeklyPlan = false;

        // Denote selected Plan
        this.isActiveThreeMonthPlan = true;
      } else if (bikeRentalPlan === "oneMonth") {
        this.isActiveThreeMonthPlan = false;
        this.isActiveWeeklyPlan = false;

        // Denote selected Plan
        this.isActiveOneMonthPlan = true;
      } else if (bikeRentalPlan === "weekly") {
        this.isActiveThreeMonthPlan = false;
        this.isActiveOneMonthPlan = false;

        // Denote selected Plan
        this.isActiveWeeklyPlan = true;
      }

      this.bikeRentalPlan = this.plans.find(
        ({ type }) => type === bikeRentalPlan
      );
    },

    /**
     * Determine what button text to display
     */
    determineButtonText({ type, amount_cents }) {
      return `$${amount_cents / 100} / ${
        type === "threeMonth" ? "90" : type === "oneMonth" ? "30" : "7"
      }
                    Days`;
    },

    /**
     * Proceed to the next checkout rental step
     */
    nextStep() {
      if (this.loading) {
        return;
      }
      // store the user data in the store
      this.loading = true;
      this.$store.commit("setUserData", {
        bikeRentalPlan:
          this.bikeRentalPlan || this.$store.state.userData.bikeRentalPlan,
      });

      const stateData = this.$store.state.userData;
      const orderData = {
        plan_id: stateData.bikeRentalPlan.id,
        email: stateData.email,
        first_name: stateData.firstName,
        last_name: stateData.lastName,
        token: stateData.stripeToken,
        wheels_user_info: stateData.wheelsUserInfo,
        user_id: stateData.wheelsUserInfo.id,
        address: stateData.address,
        address_components: stateData.addressComponents,
        bike_rental_type: stateData.bikeRentalType || "private",
      };

      this.$apollo
        .mutate({
          mutation: gql`
            mutation InsertOrderOne(
              $email: String!
              $first_name: String!
              $last_name: String!
              $plan_id: uuid!
              $token: String!
              $user_id: uuid!
              $wheels_user_info: jsonb!
              $address: String!
              $address_components: jsonb!
              $bike_rental_type: String!
            ) {
              insert_order(
                objects: [
                  {
                    email: $email
                    first_name: $first_name
                    last_name: $last_name
                    plan_id: $plan_id
                    token: $token
                    user_id: $user_id
                    wheels_user_info: $wheels_user_info
                    address: $address
                    address_components: $address_components
                    bike_rental_type: $bike_rental_type
                  }
                ]
              ) {
                affected_rows
                returning {
                  id
                }
              }
            }
          `,
          variables: orderData,
        })
        .then((res) => {
          console.log(res);
          // Move to the next step
          this.$store.commit(
            "updateRentalCheckoutStep",
            this.$store.state.rentalCheckoutStep + 1
          );
          this.$store.commit("setUserData", {
            orderId: res.data.insert_order.returning[0].id,
          });
          // Track step 9 - the final bike rental plan chosen
          this.$mixpanel.track("step 9", {
            finalBikeRentalPlan:
              this.bikeRentalPlan || this.$store.state.userData.bikeRentalPlan,
          });

          dataLayer.push({
            event: "Completed onboarding step",
            stepName: "Confirm",
            stepNumber: "9",
            bikeRentalPlan: this.$store.state.userData.bikeRentalPlan,
          });

          dataLayer.push({
            event: "Completed Order",
            amount:
              Number(this.$store.state.userData.bikeRentalPlan.amount_cents) /
              100,
            plan_name: this.$store.state.userData.bikeRentalPlan.name,
            bikeRentalPlan: this.$store.state.userData.bikeRentalPlan,
          });

          // Track the charge
          this.$mixpanel.people.track_charge(
            this.bikeRentalPlan?.price ||
              this.$store.state.userData.bikeRentalPlan.price
          );

          // Associate the new user profile with the mixpanel distinct id.
          // This must be called everytime mixpanel.people.* is used.
          // NOTE: this may be updated with unique ID from wheels?
          this.$mixpanel.identify(this.$mixpanel_unique_id);
          if (process.isClient) {
            window.history.pushState({ step: 10 }, null, "#step=10");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Oops, something went wrong! Please try again.");
        })
        .finally(() => {
          this.loading = false;
        });
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

.topContainer {
    margin-top: -4.5rem;
}

.prompt {
    font-weight: 600;
    font-size: 2.5rem;
    text-align: center;
}

p.deliveredTo {
    font-size: 1.1rem;
    color: #8c8c8c;
    margin-top: -.5rem;
    margin-bottom: 0;
    text-align: center;
}

p.address {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    text-align: center;
}

.plans {
    border: 1px solid #aeaeae;
    border-radius: 50px;
    display: flex;
    justify-content: space-between;
    padding: .5rem;
    margin: 0 auto 2rem;
    width: 30rem;
}

.planBtn {
    width: 33%;
}

.planBtn span {
    color: #aeaeae;
    letter-spacing: 0;
    text-transform: initial;
}

button.planBtn:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default) {
    background: transparent;
    font-size: 1.25rem;
}

button.activeThreeMonth:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default),
button.activeOneMonth:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default),
button.activeWeekly:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default) {
    background: linear-gradient(to right, #705392, #c5235c);
}

button.activeThreeMonth:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default) span,
button.activeOneMonth:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default) span,
button.activeWeekly:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default) span {
    color: #fff;
    font-weight: 700;
    letter-spacing: 0;
}

.rentalInfoContainer {
    align-items: center;
    display: flex;
    flex-direction: column;
    margin-top: -2rem;
}

.rentalInfoContainer img {
    width: 15rem;
}

.rentalInfoContainer p {
    font-size: 2rem;
    font-weight: 700;
}

.activeThreeMonth,
.activeOneMonth,
.activeWeekly {
    color: red;
}

.btn {
    border-radius: 50px;
}

.btn {
    background-color: #e1b426;
    border-color: transparent;
    border-radius: 50px;
    height: 5rem;
    margin: 0 auto;
    font-weight: 700;
    letter-spacing: -1px;
    max-width: 24rem;
    text-transform: initial;
    width: 100%;
}

.btn span {
    color: #fff;
    font-size: 1.75rem;
}

@media only screen and (max-width: 1200px) {
    .container {
        width: 30rem;
    }

    .prompt {
        font-size: 1.5rem;
    }

    .btn {
        max-width: 17rem;
        width: 100%;
    }

    .btn span {
        font-size: 1.4rem;
    }
}

@media only screen and (max-width: 768px) {
    .container  {
        margin-top: 1rem;
        width: 100%;
    }

    .plans {
        border: none;
        flex-direction: column;
        width: 100%;
    }

    .planBtn {
        width: 100%;
    }

    .input :global(.v-text-field__slot) input,
    .input :global(.v-text-field__slot) input::placeholder {
        font-size: 1rem;
    }

    .btn {
        margin-bottom: 2rem;
    }
}
</style>
