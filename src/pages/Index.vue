<template>
  <Layout>
      <RentalCheckoutContainer />
  </Layout>
</template>

<script>
export default {
    metaInfo: {
        title: 'Wheels Checkout Rental'
    },

    components: {
        RentalCheckoutContainer: () => import('~/components/RentalCheckoutContainer'),
    },
}
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>
