<template>
  <VApp>
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
    export default {
        components: {
            Header: () => import('~/components/Header'),
            Footer: () => import('~/components/Footer'),
        },
    }
</script>

<style>

</style>
