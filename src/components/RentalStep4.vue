<template>
    <div v-bind:class="$style.container">
        <p v-bind:class="$style.prompt">Please enter your phone number. We’ll use this to send you updates about your rental.</p>
        <div v-bind:class="$style.topWrapper">
            <VTextField
                v-model="email"
                v-bind:class="$style.input"
                placeholder="Email Address *"
                color="#973376"
                background-color="#fff"
                height="4rem"
                type="email"
                filled
                outlined
                rounded
                hide-details
                v-on:input="checkValidations"
                v-bind:rules="[
                    value => !validations.email || !email.length ? 'Please enter a valid email' : true
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
            Please fill out the required fields *
        </p>
    </div>
</template>

<script>
    export default {
        data: () => ({
            email: '',
            failedValidation: false,
            validations: {
                email: false,
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
            checkValidations () {
                this.validations.email =
                    // Ensure there's a @ symbol
                    this.email.includes('@')
                    // Ensure a proper email host is entered
                    && this.email.split('@')[1].includes('.')
                    // Ensure the email host is longer than 1 character (i.e. co, com, org, io, etc)
                    && this.email.split('@')[1].split('.')[1].length > 1;

                // Check if validation has failed
                this.failedValidation = Boolean(!this.validations.email);
            },

            nextStep () {
                // Check if validation has failed
                this.failedValidation = Boolean(!this.validations.email);

                if (!this.failedValidation) {
                    // store the user data in the store
                    this.$store.commit('setUserData', {
                        email: this.email,
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