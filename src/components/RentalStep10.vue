<template>
  <div v-bind:class="$style.container">
    <div v-bind:class="$style.topContainer">
      <div v-if="!order_by_pk || order_by_pk.status === 'pending'">
        <p v-bind:class="$style.confirmationMessage">
          Processing order...
        </p>
      </div>
      <div v-else-if="order_by_pk.status === 'order_failed'">
        <p v-bind:class="$style.prompt">Oops, something went wrong!</p>
        <p v-bind:class="$style.confirmationMessage">
          Please try again or
          <a href="https://getwheelsapp.zendesk.com/hc/en-us/requests/new"
            >contact us</a
          >
        </p>
        <div v-bind:class="$style.btnWrapper">
          <VBtn
            v-bind:class="$style.btn"
            height="5rem"
            filled
            outlined
            rounded
            v-on:click="goBack"
          >
            Go Back
          </VBtn>
        </div>
      </div>
      <div v-else>
        <p v-bind:class="$style.prompt">Purchase Confirmation</p>
        <p v-bind:class="$style.confirmationMessage">
          You're all set! A operations team member will email you shortly to
          confirm your delivery date and time
        </p>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
export default {
  created() {
    this.$mixpanel.track("step 10 (final)");
  },
  data() {
    return {
      order_by_pk: null,
    };
  },
  computed: {
    successfulOrder() {
      return this.order_by_pk && this.order_by_pk.status === "subscribed";
    },
  },
  watch: {
    successfulOrder(success) {
      if (success) {
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
          Number(this.$store.state.userData.bikeRentalPlan.amount_cents) / 100
        );
      }
    },
  },
  apollo: {
    order_by_pk: {
      query: gql`
        query GetOrder($id: uuid!) {
          order_by_pk(id: $id) {
            status
          }
        }
      `,
      variables() {
        return {
          id: this.$store.state.userData.orderId,
        };
      },
      pollInterval: 500,
    },
  },
  methods: {
    goBack() {
      this.$store.commit(
        "updateRentalCheckoutStep",
        this.$store.state.rentalCheckoutStep - 2
      );
      if (process.isClient) {
        window.history.replaceState({ step: 9 }, null, "#step=9");
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

p.prompt {
    font-weight: 600;
    font-size: 2.25rem;
    margin-bottom: 0;
    text-align: center;
}

p.confirmationMessage {
    color: 111;
    display: block;
    font-size: 1.5rem;
    max-width: 40rem;
    margin: 0 auto;
    text-align: center;
    width: 100%;
}

.rentalInfoContainer {
    align-items: center;
    display: flex;
    flex-direction: column;
}

.btnWrapper {
  text-align: center;
  margin-top: 1rem;
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
        margin-top: -4rem;
        width: 30rem;
    }

    p.prompt {
        font-size: 1.5rem;
    }

    p.confirmationMessage {
        font-size: 1rem;
    }
}

@media only screen and (max-width: 768px) {
    .container {
        margin-top: 0;
    }
}
</style>
