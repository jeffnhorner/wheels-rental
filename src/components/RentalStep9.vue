<template>
    <div
        v-if="isReady"
        v-bind:class="$style.container"
    >
        <div v-bind:class="$style.topContainer">
            <p v-bind:class="$style.prompt">Review your cart</p>
            <p v-bind:class="$style.deliveredTo">Delivered to:</p>
            <p v-bind:class="$style.address">{{ $store.state.userData.address }}</p>
            <div v-bind:class="$style.bikePlans">
                <VBtn
                    v-bind:class="[
                        $style.planBtn,
                        {
                            [$style.activeWeekly] : isActiveWeeklyPlan,
                        },
                    ]"
                    depressed
                    rounded
                    height="3rem"
                    v-on:click="updateSelectedBikePlan('weekly')"
                >
                    7-Days
                </VBtn>
                <VBtn
                    v-bind:class="[
                        $style.planBtn,
                        {
                            [$style.activeOneMonth] : isActiveOneMonthPlan,

                        },
                    ]"
                    depressed
                    rounded
                    height="3rem"
                    v-on:click="updateSelectedBikePlan('oneMonth')"
                >
                    30-Days
                </VBtn>
                <VBtn
                    v-bind:class="[
                        $style.planBtn,
                        {
                            [$style.activeThreeMonth] : isActiveThreeMonthPlan,
                        },
                    ]"
                    depressed
                    rounded
                    height="3rem"
                    v-on:click="updateSelectedBikePlan('threeMonth')"
                >
                    90-Days
                </VBtn>
            </div>
        </div>
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
            <p>{{ $store.state.userData.bikeRentalType === 'private' ? 'Private' : 'Delivery' }} Rental</p>
        </div>
        <VBtn
            v-bind:class="$style.btn"
            height="5rem"
            filled
            outlined
            rounded
            v-on:click="nextStep"
        >
            Pay {{ determineButtonText(bikeRentalPlan || $store.state.userData.bikeRentalPlan) }}
        </VBtn>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                bikeRentalPlan: null,
                isActiveThreeMonthPlan: null,
                isActiveOneMonthPlan: null,
                isActiveWeeklyPlan: null,
                isReady: false,

                // NOTE: temporary plans array until Wheels api is set up
                bikePlans: [
                    {
                        type: 'threeMonth',
                        price: 199.99,
                        dayRate: 2.20,
                        isBestValue: 1,
                        isMostPopular: 0,
                    },
                    {
                        type: 'oneMonth',
                        price: 99.99,
                        dayRate: 3.33,
                        isBestValue: 0,
                        isMostPopular: 1,
                    },
                    {
                        type: 'weekly',
                        price: 34.99,
                        dayRate: 5.00,
                        isBestValue: 0,
                        isMostPopular: 0,
                    },
                ],
            }
        },

        created () {
            // If the user reset the checkout flow, we can assume we've store some state to prefill
            // some of the fields
            this.isActiveThreeMonthPlan = Boolean(this.$store.state.userData.bikeRentalPlan?.type === 'threeMonth');
            this.isActiveOneMonthPlan = Boolean(this.$store.state.userData.bikeRentalPlan?.type === 'oneMonth');
            this.isActiveWeeklyPlan = Boolean(this.$store.state.userData.bikeRentalPlan?.type === 'weekly');

            this.isReady = true;
        },

        methods: {
            /**
             * Determines what plan the user selected
             */
            updateSelectedBikePlan (bikeRentalPlan) {
                if (bikeRentalPlan === 'threeMonth') {
                    this.isActiveOneMonthPlan = false;
                    this.isActiveWeeklyPlan = false

                    // Denote selected Plan
                    this.isActiveThreeMonthPlan = true;
                } else if (bikeRentalPlan === 'oneMonth') {
                    this.isActiveThreeMonthPlan = false;
                    this.isActiveWeeklyPlan = false

                    // Denote selected Plan
                    this.isActiveOneMonthPlan = true;
                } else if (bikeRentalPlan === 'weekly') {
                    this.isActiveThreeMonthPlan = false;
                    this.isActiveOneMonthPlan = false;

                    // Denote selected Plan
                    this.isActiveWeeklyPlan = true
                }

                this.bikeRentalPlan = this.bikePlans.find(({ type }) => type === bikeRentalPlan);
            },

            /**
             * Determine what button text to display
             */
            determineButtonText ({ type, price }) {
                return `$${price} / ${type === 'threeMonth'
                    ? '90'
                    : (type === 'oneMonth'
                        ? '30'
                        : '7')}
                    -Days`;
            },

            /**
             * Proceed to the next checkout rental step
             */
            nextStep () {
                // store the user data in the store
                this.$store.commit('setUserData', {
                    bikeRentalPlan: this.bikeRentalPlan,
                });

                // Move to the next step
                this.$store.commit('updateRentalCheckoutStep', this.$store.state.rentalCheckoutStep + 1);

                // Push the next step into the window history
                window.history.pushState({ step: 10 }, null, '#step=10');
            },
        }
    }
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

    .topContainer {
        margin-top: -4.5rem;
    }

    .prompt {
        font-weight: 600;
        font-size: 2.5rem;
        text-align: center;
    }

    p.deliveredTo {
        font-size: 1.1rem;
        color: #8c8c8c;
        margin-top: -.5rem;
        margin-bottom: 0;
        text-align: center;
    }

    p.address {
        font-size: 1.5rem;
        font-weight: 500;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .bikePlans {
        border: 1px solid #aeaeae;
        border-radius: 50px;
        display: flex;
        justify-content: space-between;
        padding: .5rem;
        margin: 0 auto 2rem;
        width: 30rem;
    }

    .planBtn {
        width: 33%;
    }

    .planBtn span {
        color: #aeaeae;
        letter-spacing: 0;
        text-transform: initial;
    }

    button.planBtn:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default) {
        background: transparent;
        font-size: 1.25rem;
    }

    button.activeThreeMonth:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default),
    button.activeOneMonth:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default),
    button.activeWeekly:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default) {
        background: linear-gradient(to right, #705392, #c5235c);
    }

    button.activeThreeMonth:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default) span,
    button.activeOneMonth:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default) span,
    button.activeWeekly:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default) span {
        color: #fff;
        font-weight: 700;
        letter-spacing: 0;
    }

    .rentalInfoContainer {
        align-items: center;
        display: flex;
        flex-direction: column;
        margin-top: -2rem;
    }

    .rentalInfoContainer img {
        width: 15rem;
    }

    .rentalInfoContainer p {
        font-size: 2rem;
        font-weight: 700;
    }

    .activeThreeMonth,
    .activeOneMonth,
    .activeWeekly {
        color: red;
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
</style>