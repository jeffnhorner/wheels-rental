<template>
    <div v-bind:class="$style.container">
        <p v-bind:class="$style.prompt">Choose your payment method</p>
        <StripeElements
            v-bind:pk="publishableKey"
        />
        <VBtn
            v-bind:class="$style.btn"
            height="5rem"
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
    export default {
        components: {
            StripeElements: async () => {
                const { StripeElements } = await import('vue-stripe-checkout');

                return StripeElements;
            },
        },

        data: () => ({
            loading: false,
            amount: 1000,
            publishableKey: process.env.GRIDSOME_STRIPE_PUBLISHABLE_API_KEY,
            token: null,
            charge: null
        }),

        methods: {
            submit () {
                this.$refs.elementsRef.submit();
            },

            tokenCreated (token) {
                this.token = token;
                // for additional charge objects go to https://stripe.com/docs/api/charges/object
                this.charge = {
                    source: token.id,
                    amount: this.amount, // the amount you want to charge the customer in cents. $100 is 1000 (it is strongly recommended you use a product id and quantity and get calculate this on the backend to avoid people manipulating the cost)
                    description: this.description // optional description that will show up on stripe when looking at payments
                }
                this.sendTokenToServer(this.charge);
            },

            sendTokenToServer (charge) {
            // Send to charge to your backend server to be processed
            // Documentation here: https://stripe.com/docs/api/charges/create
            },

            /**
             * Proceeds the user to the next step
             */
            nextStep () {
                // store the user data in the store
                this.$store.commit('setUserData', {
                    bikeRentalType: this.bikeRentalType,
                });

                // Move to the next step
                this.$store.commit('updateRentalCheckoutStep', this.$store.state.rentalCheckoutStep + 1);
            }
        },
    }
</script>

<style lang="css" module>
    .container {
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        position: relative;
        width: 40rem;
        z-index: 20;
    }

    .prompt {
        font-weight: 600;
        font-size: 2.1rem;
        align-self: center;
        text-align: center;
    }

    .btn {
        background-color: #e1b426;
        border-color: transparent;
        border-radius: 50px;
        height: 5rem;
        margin: 0 auto;
        width: 17rem;
    }

    .btn span {
        color: #fff;
        font-size: 1.75rem;
    }
</style>