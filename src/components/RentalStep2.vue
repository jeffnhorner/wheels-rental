<template>
    <div v-bind:class="$style.container">
        <p v-bind:class="$style.prompt">Please enter your phone number. We’ll use this to send you updates about your rental.</p>
        <div v-bind:class="$style.topWrapper">
            <VTextField
                v-model="phone"
                v-bind:class="$style.input"
                placeholder="Phone Number *"
                color="#c5235c"
                background-color="#fff"
                height="4rem"
                filled
                outlined
                rounded
                hide-details
                v-on:input="checkValidations"
                v-bind:rules="[
                    value => !validations.phone || (value || '').length !== 10
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
            v-on:click="nextStep"
        >
            Next
        </VBtn>
        <p
            v-if="failedValidation"
            v-bind:class="$style.error"
        >
            Please enter a valid phone number (i.e. 1112223333)
        </p>
    </div>
</template>

<script>
    export default {
        data: () => ({
            failedValidation: false,
            phone: '',
            validations: {
                phone: false,
            },
        }),

        created () {
            // New regex to test if the entered phone number is numbers only
            this.checkForNumbersOnly = new RegExp('^[0-9]+$');

            // If the user reset the checkout flow, we can assume we've store some state to prefill
            // some of the fields
            if (this.$store.state.userData?.phone) {
                this.phone = this.$store.state.userData.phone;

                // Does it pass validation?
                this.validations.phone = Boolean(this.checkForNumbersOnly.test(this.phone) && this.phone.length === 10);
            }
        },

        methods: {
            /**
             * Ensure fields are validated
             */
            checkValidations () {
                // Has the user passed validation?
                this.validations.phone = Boolean(this.checkForNumbersOnly.test(this.phone) && this.phone.length === 10);

                // Check if validation has failed
                this.failedValidation = Boolean(!this.validations.phone);
            },

            /**
             * Proceed to the next checkout rental step
             */
            nextStep () {
                // Check if validation has failed
                this.failedValidation = Boolean(!this.validations.phone);

                try {
                    // this is where we'll make the request to wheels endpoint and where we'll
                    // receive an order token/id for the order completion
                } catch (error) {
                    console.log(error);
                }

                if (!this.failedValidation) {
                    // store the user data in the store
                    this.$store.commit('setUserData', {
                        phone: this.phone,
                    });

                    // Update the mixpanel user profile
                    this.$mixpanel.people.set({
                        phone: this.phone,
                    });

                    // Associate the new user profile with the mixpanel distinct id.
                    // This must be called everytime mixpanel.people.set is used.
                    // NOTE: this may be updated with unique ID from wheels?
                    this.$mixpanel.identify(this.$mixpanel_unique_id);

                    // Track step 2
                    this.$mixpanel.track('step 2', {
                        phone: this.phone,
                    });

                    // Move to the next step
                    this.$store.commit('updateRentalCheckoutStep', this.$store.state.rentalCheckoutStep + 1);

                    // Push the next step into the window history
                    window.history.pushState({ step: 3 }, null, '#step=3');
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
        width: 20rem;
    }

    .input:global(.v-text-field.v-text-field--enclosed) {
        margin-bottom: 2.25rem;
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