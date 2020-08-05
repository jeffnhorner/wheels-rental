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
                v-on:click="selectedRentalType('private')"
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
                v-on:click="selectedRentalType('delivery')"
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
    </div>
</template>

<script>
    export default {
        data: () => ({
            bikeRentalType: 'private',
            isActivePrivatePlan: true,
            isActiveDeliveryPlan: false,
        }),

        created () {
            if (this.$store.state.userResetRentalCheckoutFlow) {
                console.log(this.$store.state.userData.bikeRentalType, 'created');
                this.bikeRentalType = this.$store.state.userData.bikeRentalType;

                this.isActivePrivatePlan = Boolean(this.$store.state.userData.bikeRentalType === 'private');
                this.isActiveDeliveryPlan = Boolean(this.$store.state.userData.bikeRentalType === 'delivery');
            }
        },

        methods: {
            /**
             * Determines what bike rental type the user selected
             */
            selectedRentalType (bikeRentalType) {
                if (bikeRentalType === 'private') {
                    this.isActiveDeliveryPlan = false;
                    this.isActivePrivatePlan = true;
                } else if (bikeRentalType === 'delivery') {
                    this.isActivePrivatePlan = false;
                    this.isActiveDeliveryPlan = true;
                }

                this.bikeRentalType = bikeRentalType;
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
        font-size: 2.5rem;
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
        border: 3px solid #e7e6e7;
        border-radius: 50%;
        /* create custom radiobutton appearance */
        display: inline-block;
        height: 37px;
        margin-bottom: 0;
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