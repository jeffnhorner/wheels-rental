<template>
  <VApp>
      <Navigation />
      <slot />
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
            Navigation: () => import('~/components/Navigation'),
        },
    }
</script>

<style>

</style>
