<template>
  <div v-bind:class="$style.container">
    <g-image v-bind:class="$style.wheelsLogo" src="../assets/wheelsLogo.png" />
    <div v-bind:class="$style.rightLogoWrapper">
      <a href="#">
        <g-image
          src="../assets/resetLogo.png"
          v-on:click="resetRentalCheckoutFlow"
        />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    resetRentalCheckoutFlow() {
      this.$store.commit("updateRentalCheckoutStep", 1);
      this.$store.commit("userResetRentalCheckoutFlow", true);
    },
  },
};
</script>

<style lang="css" module>
.container {
    background: #fff;
    border-bottom: 1px solid #e7e7e7;
    display: flex;
    justify-content: space-between;
    padding: 2.5rem;
    position: fixed;
    width: 100%;
    /* This ensures the header is above Stripe elements */
    z-index: 100;
}

.rightLogoWrapper {
    align-items: center;
    display: flex;
}

.rightLogoWrapper img {
    margin-left: 1.5rem;
}

@media only screen and (max-width: 768px) {
    .container {
        padding: 1.5rem;
    }
    .wheelsLogo {
        align-self: center;
        height: 1.5rem;
        width: auto;
    }

    .rightLogoWrapper img {
        height: 1.3rem;
        margin-left: 1rem;
        width: auto;
    }
}
</style>
