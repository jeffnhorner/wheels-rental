<template>
    <div v-bind:class="$style.container">
        <p v-bind:class="$style.prompt">Let's complete your rental. We need a bit of information to get started.</p>
        <div v-bind:class="$style.topWrapper">
            <VTextField
                v-model="firstName"
                v-bind:class="[$style.input, $style.inputLeft]"
                placeholder="First Name *"
                color="#973376"
                background-color="#fff"
                height="4rem"
                filled
                outlined
                rounded
                hide-details
                v-on:input="checkValidations"
                v-bind:rules="[value => !value.length ? 'Required' : true]"
            />
            <VTextField
                v-model="lastName"
                v-bind:class="[$style.input, $style.inputRight]"
                placeholder="Last Name *"
                color="#973376"
                background-color="#fff"
                height="4rem"
                filled
                outlined
                rounded
                hide-details
                v-on:input="checkValidations"
                v-bind:rules="[value => !value.length ? 'Required' : true]"
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
            Get Started
        </VBtn>
        <p
            v-if="failedValidation"
            v-bind:class="$style.error"
        >
            Please fill out your first and last name.
        </p>
    </div>
</template>

<script>
    export default {
        data: () => ({
            failedValidation: false,
            firstName: '',
            lastName: '',
            validations: {
                firstName: false,
                lastName: false,
            },
        }),

        created () {
            // If the user reset the checkout flow, we can assume we've store some state to prefill
            // some of the fields
            if (this.$store.state.userResetRentalCheckoutFlow) {
                const { firstName, lastName } = this.$store.state.userData;

                this.firstName = firstName;
                this.lastName = lastName;

                // Does it pass validation?
                this.validations.firstName = this.firstName.length;
                this.validations.lastName = this.lastName.length;
            }

            this.hasParameters = Object.keys(this.$route.query).length;

            if (this.hasParameters && !this.$store.state.userResetRentalCheckoutFlow) {
                // Use object destructions to see if there are fname or lname passed from rental landing page
                // NOTE: these parameter key names may change
                const { fname, lname } = this.$route.query;

                // If either fname or lname are defined, update the reactive data key values and check
                // if it passes validation?
                if (fname || lname) {
                    this.firstName = fname;
                    this.lastName = lname;

                    this.validations.firstName = this.firstName.length;
                    this.validations.lastName = this.lastName.length;
                }
            }
        },

        methods: {
            checkValidations () {
                this.validations.firstName = Boolean(this.firstName.length);
                this.validations.lastName = Boolean(this.lastName.length);

                this.failedValidation = Boolean(!this.validations.firstName || !this.validations.lastName)
            },

            nextStep () {
                this.failedValidation = Boolean(!this.validations.firstName || !this.validations.lastName)

                if (!this.failedValidation) {
                    this.$store.commit('setUserData', {
                        firstName: this.firstName,
                        lastName: this.lastName,
                    });

                    // Move to the next step
                    this.$store.commit('updateRentalCheckoutStep', this.$store.state.rentalCheckoutStep + 1);

                    // If paramters exist, clear them out
                    if (this.hasParameters) {
                        this.$router.push({
                            query: {},
                        });
                    }
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
        width: 45rem;
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
        width: 30rem;
    }

    .input:global(.v-text-field.v-text-field--enclosed) {
        margin-bottom: 2.25rem;
    }

    .inputLeft:global(.v-text-field.v-text-field--enclosed) {
        margin-right: .5rem;
    }

    .inputRight:global(.v-text-field.v-text-field--enclosed) {
        margin-left: .5rem;
    }

    .input,
    .btn {
        border-radius: 50px;
    }

    .input :global(.v-text-field__slot) input,
    .input :global(.v-text-field__slot) input::placeholder {
        font-size: 1.25rem;
    }

    .btn {
        background-color: #e1b426;
        border-color: transparent;
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