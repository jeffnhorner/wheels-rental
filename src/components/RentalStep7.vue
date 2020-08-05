<template>
    <div v-bind:class="$style.container">
        <p v-bind:class="$style.prompt">Great, choose your rental plan.</p>
        <div v-bind:class="$style.topWrapper">
            <template v-for="plan in plans">
                <span v-bind:class="$style.plan">
                    <p
                        v-bind:class="[
                            $style.highlight,
                            {
                                [$style.highlightActive] : determineActiveFlag(plan.type)
                            },
                        ]"
                    >
                        {{ plan.isBestValue ? 'Best Value' : (plan.isMostPopular ? 'Most Popular' : '')}}
                    </p>
                    <div
                        v-bind:key="plan.type"
                        v-bind:class="[
                            $style.imageContainer,
                            {
                                [$style.imageContainerActive] : determineActiveFlag(plan.type),
                            },
                        ]"
                        v-on:click="selectedPlan(plan.type)"
                    >
                        <p v-bind:class="$style.planTitle">
                            {{ plan.type === 'threeMonth'
                                ? '3 Month'
                                : (plan.type === 'oneMonth' ? '1 Month' : 'Weekly')
                            }} Plan
                        </p>
                        <p v-bind:class="$style.price">${{ plan.price.toFixed(2) }}</p>
                        <p v-bind:class="$style.dayRate">${{ plan.dayRate.toFixed(2) }} / day</p>
                        <input
                            v-bind:class="$style.radio"
                            type="radio"
                            v-bind:checked="determineActiveFlag(plan.type)"
                        />
                    </div>
                </span>
            </template>
        </div>
        <p v-bind:class="$style.infoTop">Unlimed Rides. Charger & lock included.</p>
        <p v-bind:class="$style.infoBottom">Wheels will charge a $25 security deposit. It will be refunded after your bike is returned in the same condition, ordinary wear and tear excluded.</p>
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
        data: () => ({
            bikeRentalPlan: null,
            isActiveThreeMonthPlan: false,
            isActiveOneMonthPlan: true,
            isActiveWeeklyPlan: false,
            // NOTE: temporary plans array until Wheels api is set up
            plans: [
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
        }),

        created () {
            console.log(this.$store.state.userData);
            //TODO: we'll need to fetchThePlans on component load
            // If the user reset the checkout flow, we can assume we've store some state to prefill
            // some of the fields
            if (this.$store.state.userResetRentalCheckoutFlow) {
                this.isActiveThreeMonthPlan = Boolean(this.$store.state.userData.bikeRentalPlan?.type === 'threeMonth');
                this.isActiveOneMonthPlan = Boolean(this.$store.state.userData.bikeRentalPlan?.type === 'oneMonth');
                this.isActiveWeeklyPlan = Boolean(this.$store.state.userData.bikeRentalPlan?.type === 'weekly');

                console.log(this.bikeRentalPlan);
            }
        },

        methods: {
            /**
             * Sets the plan type active flag
             */
            determineActiveFlag (bikeRentalPlanType) {
                return bikeRentalPlanType === 'threeMonth'
                    ? this.isActiveThreeMonthPlan
                    : (bikeRentalPlanType === 'oneMonth'
                        ? this.isActiveOneMonthPlan
                        : this.isActiveWeeklyPlan
                    );
            },

            /**
             * Determines what plan the user selected
             */
            selectedPlan (bikeRentalPlan) {
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

                this.bikeRentalPlan = this.plans.find(({ type }) => type === bikeRentalPlan);
            },

            /**
             * Proceeds the user to the next step
             */
            nextStep () {
                // store the user data in the store
                this.$store.commit('setUserData', {
                    bikeRentalPlan: this.bikeRentalPlan,
                });

                // Move to the next step
                this.$store.commit('updateRentalCheckoutStep', this.$store.state.rentalCheckoutStep + 1);
            }
        }
    }
</script>

<style lang="css" module>
    .container {
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        position: relative;
        z-index: 20;
    }

    p.highlight {
        color: #c2c2c2;
        font-size: 1.15rem;
        margin-bottom: -.5rem;
        text-transform: uppercase;
    }

    p.highlightActive {
        color: #973376;
        font-size: 1.4rem;
    }

    p.prompt {
        font-weight: 600;
        font-size: 2.5rem;
        margin-bottom: -.5rem;
        text-align: center;
    }

    .topWrapper {
        display: flex;
        margin: 2rem auto 0;
    }

    .plan {
        display: flex;
        height: 20rem;
        justify-content: flex-end;
        flex-direction: column;
        text-align: center;
    }

    .imageContainer {
        background: #fff;
        border: 3px solid #c2c2c2;
        border-radius: 20px;
        margin-bottom: 2.25rem;
        text-align: center;
        width: calc(55rem / 3);
    }

    .imageContainer:hover {
        cursor: pointer;
    }

    .planTitle {
        background: #ebebeb;
        border-top-left-radius: 13px;
        border-top-right-radius: 13px;
        color: #fff;
        font-size: 1.5rem;
        font-weight: 700;
        letter-spacing: -.025rem;
        max-width: calc(55rem / 3);
        opacity: .6;
        padding: 1rem;
    }

    p.price {
        font-size: 4rem;
        font-weight: 700;
        margin-bottom: 0;
        margin-top: -1rem;
        opacity: .4;
    }

    p.dayRate {
        color: #8c8c8c;
        font-size: 1.55rem;
        margin-top: -1rem;
        opacity: .4;
    }

    .imageContainerActive {
        border: 3px solid #973376;
        box-shadow: 1px 1px #d5d5d5;
        opacity: 1;
    }

    .imageContainerActive .planTitle {
        background: linear-gradient(to left, #705392, #973376);
        opacity: 1;
    }

    .imageContainerActive .price,
    .imageContainerActive .dayRate {
        opacity: 1;
    }

    .imageContainer {
        margin: 1rem;
    }

    .image {
        height: 12.5rem;
        width: auto;
    }

    input[type="radio"] {
        /* remove standard background appearance */
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        /* background-color only for content */
        background-clip: content-box;
        border: 3px solid #e7e6e7;
        border-radius: 50%;
        /* create custom radiobutton appearance */
        display: inline-block;
        height: 37px;
        margin-bottom: .5rem;
        padding: 5px;
        width: 37px;
    }

    /* appearance for checked radiobutton */
    input[type="radio"]:checked {
        background-color: #bf2a60;
    }

    input[type="radio"]:focus {
        outline: none;
    }

    .infoTop {
        font-size: 2rem;
        margin-top: 1rem;
        text-align: center;
    }

    .infoBottom {
        max-width: 46rem;
        margin: 0 auto;
        text-align: center;
        width: 100%;
    }

    .btn {
        background-color: #e1b426;
        border-color: transparent;
        border-radius: 50px;
        height: 5rem;
        margin: 1rem auto 0;
        width: 17rem;
    }

    .btn span {
        color: #fff;
        font-size: 1.75rem;
    }

    .error {
        color: #ff5252;
        font-size: .75rem;
        margin-top: 1.5rem;
        text-align: center;
    }
</style>