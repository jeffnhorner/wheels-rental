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
            failedToProceed: false,
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
                this.validations.firstName = Boolean(firstName);
                this.lastName = lastName;
                this.validations.lastName = Boolean(lastName);
            }

            // Use object destructions to see if there are fname or lname passed from rental landing page
            const { fname, lname } = this.$route.query;

            // If either fname or lname are defined, update the reactive data key values
            if (fname || lname) {
                this.firstName = fname;
                this.lastName = lname;
            }
        },

        methods: {
            checkValidations () {
                this.validations.firstName = Boolean(this.firstName.length);
                this.validations.lastName = Boolean(this.lastName.length);
            },

            nextStep () {
                this.failedToProceed = Boolean(!this.validations.firstName || !this.validations.lastName);

                if (!this.failedToProceed) {
                    this.$store.commit('setUserData', {
                        firstName: this.firstName,
                        lastName: this.lastName,
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
        width: 42rem;
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
        width: 30rem;
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