<template>
  <div v-bind:class="$style.container" v-if="!loading && !plans.length">
    <p v-bind:class="$style.prompt">
      We haven't launched in your area yet
    </p>
    <p v-bind:class="$style.infoTop">
      We'll message you when rentals become available in your city
    </p>
  </div>
  <div v-bind:class="$style.container" v-else>
    <p v-bind:class="$style.prompt">Great, choose your rental plan.</p>
    <div v-bind:class="$style.topWrapper">
      <template v-for="plan in plans">
        <span v-bind:key="plan.type" v-bind:class="$style.plan">
          <p
            v-bind:class="[
              $style.highlight,
              {
                [$style.highlightActive]: determineActiveFlag(plan.type),
              },
            ]"
          >
            {{
              plan.is_best_value
                ? "Best Value"
                : plan.is_most_popular
                ? "Most Popular"
                : ""
            }}
          </p>
          <div
            v-bind:key="plan.type"
            v-bind:class="[
              $style.imageContainer,
              {
                [$style.imageContainerActive]: determineActiveFlag(plan.type),
              },
            ]"
            v-on:click="selectedPlan(plan.type)"
          >
            <p v-bind:class="$style.planTitle">
              {{ plan.name }}
            </p>
            <p v-bind:class="$style.price">
              ${{ (plan.amount_cents / 100).toFixed(2) }}
            </p>
            <p v-bind:class="$style.dayRate">
              ${{ (plan.day_rate_cents / 100).toFixed(2) }} / day
            </p>
            <input
              v-bind:class="$style.radio"
              type="radio"
              v-bind:checked="determineActiveFlag(plan.type)"
            />
          </div>
        </span>
      </template>
    </div>
    <p v-bind:class="$style.infoTop">
      Unlimed Rides. Charger & lock included.
    </p>
    <p v-bind:class="$style.infoBottom">
      Wheels will charge a $25 security deposit. It will be refunded after your
      bike is returned in the same condition, ordinary wear and tear excluded.
    </p>
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
</template>

<script>
import { GET_AVAILABLE_PLANS } from "@/graphql";
export default {
  data: () => ({
    bikeRentalPlan: {},
    isActiveThreeMonthPlan: false,
    isActiveOneMonthPlan: true,
    isActiveWeeklyPlan: false,
    // NOTE: temporary plans array until Wheels api is set up
    plans: [],
    loading: 0,
  }),

  apollo: {
    plans: {
      query: GET_AVAILABLE_PLANS,
      loadingKey: "loading",
      variables(...rest) {
        return {
          zip_code: this.$store.state.userData.zipCode,
        };
      },
    },
  },

  computed: {
    isTabletOrMobile() {
      return this.$mq === "md" || this.$mq === "sm" || this.$mq === "xs";
    },
  },

  created() {
    // If the user has already selected a bike rental plan
    if (this.$store.state.userData?.bikeRentalPlan) {
      this.isActiveThreeMonthPlan = Boolean(
        this.$store.state.userData.bikeRentalPlan?.type === "threeMonth"
      );
      this.isActiveOneMonthPlan = Boolean(
        this.$store.state.userData.bikeRentalPlan?.type === "oneMonth"
      );
      this.isActiveWeeklyPlan = Boolean(
        this.$store.state.userData.bikeRentalPlan?.type === "weekly"
      );
    }
  },

  methods: {
    /**
     * Sets the plan type active flag
     */
    determineActiveFlag(bikeRentalPlanType) {
      return bikeRentalPlanType === "threeMonth"
        ? this.isActiveThreeMonthPlan
        : bikeRentalPlanType === "oneMonth"
        ? this.isActiveOneMonthPlan
        : this.isActiveWeeklyPlan;
    },

    /**
     * Determines what plan the user selected
     */
    selectedPlan(bikeRentalPlan) {
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
     * Proceed to the next checkout rental step
     */
    nextStep() {
      // store the user data in the store
      this.$store.commit("setUserData", {
        bikeRentalPlan: this.bikeRentalPlan,
      });

      // Track step 7 - the initial bike rental plan chosen
      this.$mixpanel.track("step 7", {
        initialBikeRentalPlan: this.bikeRentalPlan,
      });

      // Move to the next step
      this.$store.commit(
        "updateRentalCheckoutStep",
        this.$store.state.rentalCheckoutStep + 1
      );

      // Push the next step into the window history
      if (process.isClient) {
        window.history.pushState({ step: 8 }, null, "#step=8");
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
    z-index: 20;
}

p.highlight {
    color: #c2c2c2;
    font-size: 1.15rem;
    margin-bottom: -.5rem;
    text-transform: uppercase;
}

p.highlightActive {
    color: #c5235c;
    font-size: 1.4rem;
}

p.prompt {
    font-weight: 600;
    font-size: 2.5rem;
    margin-bottom: -.5rem;
    text-align: center;
}

.topWrapper {
    display: flex;
    margin: 2rem auto 0;
}

.plan {
    display: flex;
    height: 20rem;
    justify-content: flex-end;
    flex-direction: column;
    text-align: center;
}

.imageContainer {
    background: #fff;
    border: 3px solid #c2c2c2;
    border-radius: 20px;
    margin-bottom: 2.25rem;
    text-align: center;
    width: calc(55rem / 3);
}

.imageContainer:hover {
    cursor: pointer;
}

.planTitle {
    background: #ebebeb;
    border-top-left-radius: 13px;
    border-top-right-radius: 13px;
    color: #fff;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -.025rem;
    max-width: calc(55rem / 3);
    opacity: .6;
    padding: 1rem;
}

p.price {
    font-size: 4rem;
    font-weight: 700;
    margin-bottom: 0;
    margin-top: -1rem;
    opacity: .4;
}

p.dayRate {
    color: #8c8c8c;
    font-size: 1.55rem;
    margin-top: -1rem;
    opacity: .4;
}

.imageContainerActive {
    border: 3px solid #c5235c;
    box-shadow: 1px 1px #d5d5d5;
    opacity: 1;
}

.imageContainerActive .planTitle {
    background: linear-gradient(to left, #705392, #c5235c);
    opacity: 1;
}

.imageContainerActive .price,
.imageContainerActive .dayRate {
    opacity: 1;
}

.imageContainer {
    margin: 1rem;
}

.image {
    height: 12.5rem;
    width: auto;
}

input[type="radio"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-clip: content-box;
    border: 3px solid #e7e6e7;
    border-radius: 50%;
    display: inline-block;
    height: 37px;
    margin-bottom: .5rem;
    padding: 5px;
    width: 37px;
}

input[type="radio"]:checked {
    background-color: #bf2a60;
}

input[type="radio"]:focus {
    outline: none;
}

.infoTop {
    font-size: 2rem;
    margin-top: 1rem;
    text-align: center;
}

.infoBottom {
    max-width: 46rem;
    margin: 0 auto;
    text-align: center;
    width: 100%;
}

.btn {
    background-color: #e1b426;
    border-color: transparent;
    border-radius: 50px;
    height: 5rem;
    margin: 1rem auto 0;
    width: 17rem;
}

.btn span {
    color: #fff;
    font-size: 1.75rem;
}

.not-available {

}

@media only screen and (max-width: 1200px) {
    .container {
        max-width: 30rem;
        width: 100%;
    }

    .topWrapper {
        flex-direction: column;
    }

    p.prompt {
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

    .infoTop {
        font-size: 1.5rem;
    }

    .btn {
        margin-bottom: 2rem;
    }
}

@media only screen and (max-width: 768px) {
    .input :global(.v-text-field__slot) input,
    .input :global(.v-text-field__slot) input::placeholder {
        font-size: 1rem;
    }
}
</style>
