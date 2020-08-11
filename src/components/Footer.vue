<template>
  <div v-bind:class="$style.container">
    <div v-bind:class="$style.wrapper">
      <div>
        <g-image v-bind:class="$style.logo" src="./assets/wheelsLogo.png" />
        <p v-bind:class="$style.copyright">
          Copyright Wheels. All Rights Reserved
        </p>
      </div>
      <div v-bind:class="$style.rightWrapper">
        <p v-bind:class="$style.links">
          Private Rental | Delivery Rental | Contact Us | Faq
        </p>
        <div v-bind:class="$style.socials">
          <template v-for="icon in socialIcons">
            <FontAwesome
              v-bind:key="icon[1]"
              v-bind:icon="[icon[0], icon[1]]"
              v-bind:class="$style.icon"
              size="lg"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.socialIcons = [
      ["fab", "facebook-square"],
      ["fab", "twitter"],
      ["fab", "instagram"],
    ];
  },
};
</script>

<style lang="css" module>
.container {
    background: #fff;
    border-top: 1px solid #e7e7e7;
    color: #4d5aa5;
    font-size: 1rem;
    margin: 0 auto;
    padding: 2.5rem 2.5rem;
    width: 100%;
    z-index: 10;
}

.wrapper {
    display: flex;
    justify-content: space-between;
}

.rightWrapper {
    margin-left: 2rem;
    text-align: right;
}

.logo {
    width: 17rem;
}

.copyright {
    font-weight: 300;
    margin-top: .5rem;
}

.links {
    font-weight: 400;
    text-transform: uppercase;
}

.socials {
    display: flex;
    justify-content: flex-end;
    padding-top: 1rem;
    margin-right: 1rem;
}

.icon {
    margin-right: .5rem;
}

@media only screen and (min-width: 1200px) {
    .container {
        padding: 2.5rem 0;
    }

    .wrapper {
        max-width: 75%;
        margin: 0 auto;
    }
}

@media only screen and (max-width: 768px) {
    .logo {
        width: 13rem;
    }
}

@media only screen and (max-width: 567px) {
    .wrapper {
        flex-direction: column;
    }

    .rightWrapper {
        margin-left: 0;
        text-align: left;
    }

    .logo {
        width: 10rem;
    }

    .socials {
        justify-content: flex-start;
    }
}

@media only screen and (max-width: 567px) {
    .container,
    .rightWrapper {
        text-align: center;
    }

    .socials {
        justify-content: center;
    }
}
</style>
