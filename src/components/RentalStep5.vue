<template>
    <div v-bind:class="$style.container">
        <p v-bind:class="$style.prompt">Which bike do you want to rent?</p>
        <div v-bind:class="$style.topWrapper">
            <div
                v-bind:class="[
                    $style.imageContainer,
                    {
                        [$style.imageContainerActive] : isActivePrivatePlan,
                    },
                ]"
                v-on:click="isSelectedRentalType('private')"
            >
                <g-image
                    v-bind:class="$style.image"
                    src="~/assets/privateRental.png"
                />
                <p>Private Rental</p>
                <input
                    v-bind:class="$style.radio"
                    type="radio"
                    v-bind:checked="isActivePrivatePlan"
                />
            </div>
            <div
                v-bind:class="[
                    $style.imageContainer,
                    {
                        [$style.imageContainerActive] : isActiveDeliveryPlan,
                    },
                ]"
                v-on:click="isSelectedRentalType('delivery')"
            >
                <g-image
                    v-bind:class="$style.image"
                    src="~/assets/deliveryRental.png"
                />
                <p>Delivery Rental</p>
                <input
                    v-bind:class="$style.radio"
                    type="radio"
                    v-bind:checked="isActiveDeliveryPlan"
                />
            </div>
        </div>
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
        <p
            v-if="failedValidation"
            v-bind:class="$style.error"
        >
            Please select a bike rental type.
        </p>
    </div>
</template>

<script>
    export default {
        data: () => ({
            bikeRentalType: '',
            failedValidation: false,
            isActivePrivatePlan: false,
            isActiveDeliveryPlan: false,
            validations: {
                bikeRentalType: false,
            },
        }),

        created () {
            // If the user reset the checkout flow, we can assume we've store some state to prefill
            // some of the fields
            console.log(this.$store.state.userResetRentalCheckoutFlow);
            if (this.$store.state.userResetRentalCheckoutFlow) {
                this.email = this.$store.state.userData.email;

                // Does it pass validation?
                this.validations.email = this.email.length;
            }
        },

        methods: {
            /**
             * Ensure the user has completed the step
             */
            checkValidations (bikeRentalType) {
                this.validations.bikeRentalType = bikeRentalType;

                // Check if validation has failed
                this.failedValidation = Boolean(!this.validations.bikeRentalType.length);
            },

            /**
             * Determines what bike rental type the user selected
             */
            isSelectedRentalType (bikeRentalType) {
                if (bikeRentalType === 'private') {
                    this.isActiveDeliveryPlan = false;
                    this.isActivePrivatePlan = true;
                } else if (bikeRentalType === 'delivery') {
                    this.isActivePrivatePlan = false;
                    this.isActiveDeliveryPlan = true;
                }

                this.bikeRentalType = bikeRentalType;
                this.checkValidations(bikeRentalType);
            },

            /**
             * Proceeds the user to the next step
             */
            nextStep () {
                // Check if validation has failed
                this.failedValidation = Boolean(!this.validations.bikeRentalType.length);

                if (!this.failedValidation) {
                    // store the user data in the store
                    this.$store.commit('setUserData', {
                        bikeRentalType: this.bikeRentalType,
                    });

                    // Move to the next step
                    this.$store.commit('updateRentalCheckoutStep', this.$store.state.rentalCheckoutStep + 1);
                }
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
        width: 50rem;
        z-index: 20;
    }

    .prompt {
        font-weight: 600;
        font-size: 2.1rem;
        text-align: center;
    }

    .topWrapper {
        display: flex;
        margin: 2rem auto 0;
    }

    .imageContainer {
        border: 3px solid #c2c2c2;
        border-radius: 50px;
        margin-bottom: 2.25rem;
        opacity: .4;
        padding: 2rem 1.25rem 1rem;
        text-align: center;
    }

    .imageContainer p {
        font-size: 1.5rem;
        font-weight: 700;
        letter-spacing: -.025rem;
    }

    .imageContainerActive {
        border: 3px solid #973376;
        box-shadow: 5px 5px 10px #d5d5d5;
        opacity: 1;
    }

    .imageContainerActive input[type="radio"] {
        border: 2px solid #973376;
    }

    .imageContainer:nth-of-type(1) {
        margin-right: 1rem;
    }

    .imageContainer:nth-of-type(2) {
        margin-left: 1rem;
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
        border: 2px solid #e7e6e7;
        border-radius: 50%;
        /* create custom radiobutton appearance */
        display: inline-block;
        height: 35px;
        padding: 6px;
        width: 35px;
    }

        /* appearance for checked radiobutton */
    input[type="radio"]:checked {
        background-color: #973376;
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

    .error {
        color: #ff5252;
        font-size: .75rem;
        margin-top: 1.5rem;
        text-align: center;
    }
</style>