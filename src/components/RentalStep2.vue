<template>
    <div v-bind:class="$style.container">
        <p v-bind:class="$style.prompt">Please enter your phone number. We’ll use this to send you updates about your rental.</p>
        <div v-bind:class="$style.topWrapper">
            <VTextField
                v-model="phone"
                v-bind:class="$style.input"
                placeholder="Phone Number *"
                color="#973376"
                background-color="#fff"
                height="4rem"
                filled
                outlined
                rounded
                v-on:input="checkValidations"
                v-bind:rules="[
                    value => !validations.phone || value.length !== 10
                        ? 'Please enter a 10 digit phone number'
                        : true
                ]"
            />
        </div>
        <VBtn
            v-bind:class="$style.btn"
            height="5rem"
            background-color="#fff"
            filled
            outlined
            rounded
            v-on:click="verifyPhone"
        >
            Next
        </VBtn>
        <p
            v-if="failedToProceed"
            v-bind:class="$style.error"
        >
            Please fill out the required fields *
        </p>
    </div>
</template>

<script>
    export default {
        data: () => ({
            phone: '',
            failedToProceed: false,
            promptNumbersOnlyMessage: false,
            validations: {
                phone: false,
            },
        }),

        created () {
            // New regex to test if the entered phone number is numbers only
            this.checkForNumbersOnly = new RegExp('^[0-9]+$');

            // If the user reset the checkout flow, we can assume we've store some state to prefill
            // some of the fields
            if (this.$store.state.userResetRentalCheckoutFlow) {
                this.phone = this.$store.state.userData.phone;
                this.validations.phone = this.checkForNumbersOnly.test(this.phone);
            }

            console.log(this.$store.state.userData);
        },

        methods: {
            checkValidations () {
                this.validations.phone = Boolean(this.checkForNumbersOnly.test(this.phone) && this.phone.length === 10);
            },

        verifyPhone () {
                try {
                    // this is where we'll make the request to wheels endpoint
                } catch (error) {
                    console.log(error);
                }

                this.failedToProceed = Boolean(!this.validations.phone);

                if (!this.failedToProceed) {
                    // store the user data in the store
                    this.$store.commit('setUserData', {
                        phone: this.phone,
                    });

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
        width: 47rem;
        z-index: 20;
    }

    .prompt {
        font-weight: 600;
        font-size: 2rem;
        text-align: center;
    }

    .topWrapper {
        display: flex;
        margin: 2rem auto 0;
        width: 20rem;
    }

    .input,
    .btn {
        border-radius: 50px;
    }

    .input :global(.v-text-field__slot) input,
    .input :global(.v-text-field__slot) input::placeholder {
        font-size: 1.25rem;
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

    .error {
        color: #ff5252;
        font-size: .75rem;
        margin-top: 1.5rem;
        text-align: center;
    }
</style>