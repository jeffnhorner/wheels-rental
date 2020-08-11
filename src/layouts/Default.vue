<template>
  <VApp v-bind:class="$style.app">
    <Header />
    <slot />
    <Footer />
  </VApp>
</template>

<static-query>
    query {
        metadata {
            siteName
        }
    }
</static-query>

<script>
import "whatwg-fetch";
export default {
  components: {
    Header: () => import("~/components/Header"),
    Footer: () => import("~/components/Footer"),
  },
};
</script>

<style lang="css" module>
.app div {
    font-familY: 'Poppins', sans-serif;
}
</style>
