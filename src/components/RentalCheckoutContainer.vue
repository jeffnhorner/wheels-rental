<template>
  <div v-bind:class="$style.container">
    <div v-bind:class="$style.wrapper">
      <div v-bind:class="$style.imagesLeft">
        <g-image
          v-if="isTabletOrMobile"
          v-bind:class="$style.bikeImgLeft"
          src="../assets/wheelsBikeLeft.png"
        />
        <g-image
          v-bind:class="$style.backgroundImageLeft"
          src="../assets/wheelsBackgroundLeft.png"
        />
      </div>
      <component
        v-bind:class="$style.dynamicComponentWrapper"
        v-bind:is="'RentalStep' + rentalCheckoutStep"
      />
      <div v-if="isTabletOrMobile" v-bind:class="$style.imagesRight">
        <g-image
          v-bind:class="$style.bikeImgRight"
          src="../assets/wheelsBikeRight.png"
        />
        <g-image
          v-bind:class="$style.backgroundImageRight"
          src="../assets/wheelsBackgroundRight.png"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  computed: {
    rentalCheckoutStep() {
      return this.$store.state.rentalCheckoutStep;
    },

    isTabletOrMobile() {
      return this.$mq !== "md" && this.$mq !== "sm" && this.$mq !== "xs";
    },
  },

  beforeCreate() {
    // Dynamically import all Rental Steps so we don't have to keep up with how many
    // component steps we have. This will scale if we need to modify/add/remove steps at
    // any time.
    const requireContext = require.context(
      "~/components",
      true,
      /RentalStep.*\.vue$/
    );

    const dynamicComponents = requireContext
      .keys()
      .map((file) => [
        file.replace(/(^.\/)|(\.vue$)/g, ""),
        requireContext(file),
      ])
      .reduce((components, [name, component]) => {
        components[name] = component.default || component;
        return components;
      }, {});

    Object.entries(dynamicComponents).forEach((component) =>
      // Dynamially import & instantiate the Rental Step components
      Vue.component(`${component[0]}`, () =>
        import(`~/components/${component[0]}`)
      )
    );
  },

  created() {
    // Add popstate event listen to allow users to use back/forward browser buttons
    if (process.isClient) {
      window.addEventListener("popstate", (event) => this.onPopstate(event));
    }
  },

  methods: {
    /**
     * Logic for whent he browser buttons are clicked
     */
    onPopstate(event) {
      // If a step is present in the window history state
      if (event.state?.step) {
        // Update the rental checkout step based upon the window history state
        this.$store.commit("updateRentalCheckoutStep", event.state.step);
      }
    },
  },
};
</script>

<style lang="css" module>
.container {
    margin-bottom: 4rem;
}

.wrapper {
    display: flex;
    min-height: 35rem;
    margin-top: 16rem;
    position: relative;
    width: 100%;
}

.backgroundImageLeft {
    left: 0;
    position: absolute;
    bottom: 8.25rem;
}

.backgroundImageRight {
    position: absolute;
    right: 0;
    bottom: 6.75rem;
}

.bikeImgLeft,
.bikeImgRight {
    position: relative;
    z-index: 10;
}

.bikeImgLeft {
    top: 3.25rem;
}

.bikeImgRight {
    top: 5rem;
}

.imagesLeft {
    position: absolute;
    left: 0;
}

.imagesRight {
    position: absolute;
    right: 0;
}

@media only screen and (max-width: 1200px) {
    .bikeImgLeft,
    .bikeImgRight {
        max-width: 26rem;
    }

    .backgroundImageLeft {
        left: -15rem;
        bottom: 3rem;
    }

    .backgroundImageRight {
        right: -15rem;
        bottom: 2.75rem;
    }
}

@media only screen and (max-width: 967px) {
    .bikeImgLeft,
    .bikeImgRight {
        max-width: 20rem;
    }
}

@media only screen and (max-width: 768px) {
    .container {
        margin-bottom: 0;
    }

    .wrapper {
        margin-top: 10rem;
    }

    .dynamicComponentWrapper {
        padding: 0 1rem;
    }

    .imagesLeft,
    .imagesRight {
        position: relative;
    }

    .backgroundImageLeft {
        left: 0;
    }
}
</style>
