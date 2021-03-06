<template>
    <div v-bind:class="$style.container">
        <p v-bind:class="$style.prompt">Enter the 6-Digit code we just sent to your mobile number</p>
        <div v-bind:class="$style.topWrapper">
            <VTextField
                ref="textField"
                v-for="(textField, index) in verificationCode"
                v-bind:key="index"
                v-model="verificationCode[index]"
                v-bind:autofocus="index === 0"
                v-bind:class="$style.input"
                maxLength="1"
                color="#c5235c"
                background-color="#fff"
                height="4rem"
                filled
                hide-details
                v-on:input="checkValidations(index)"
            />
        </div>
        <VBtn
            v-bind:class="$style.resendBtn"
            height="3.5rem"
            background-color="#fff"
            filled
            outlined
            rounded
            v-on:click="getVerficationCode(true)"
        >
            Resend Code
        </VBtn>
        <VBtn
            v-bind:class="$style.nextBtn"
            v-bind:height="isTabletOrMobile ? '4rem' : '5rem'"
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
            Please enter your 6-Digit verification code *
        </p>
    </div>
</template>

<script>
    export default {
        data: () => ({
            failedValidation: false,
            validations: {
                verificationCode: false,
            },
            verificationCode: ['', '', '', '', '', ''],
        }),

        computed: {
            isTabletOrMobile () {
                return this.$mq === 'md' || this.$mq === 'sm' || this.$mq === 'xs';
            }
        },

        created () {
            // New regex to test if the entered phone number is numbers only
            this.checkForNumbersOnly = new RegExp('^[0-9]+$');
        },

        methods: {
            /**
             * Ensure fields are validated
             */
            checkValidations (position) {
                // Autofocus the next text field for user experience
                position !== 5 ? this.$refs.textField[position + 1].focus() : null;

                const verificationCode = this.verificationCode.join('');

                // Has the user passed validation?
                this.validations.verificationCode = Boolean(
                    this.checkForNumbersOnly.test(verificationCode)
                    && verificationCode.length === 6
                );

                // Check if validation has failed
                this.failedValidation = Boolean(!this.validations.verificationCode);
            },

            /**
             * Retrieve phone verification code
             */
            getVerficationCode (isResendingCode = false) {
                if (isResendingCode) {
                    // reset the verification code v-model
                    this.verificationCode = ['', '', '', '', '', '']

                    // Focus the first text field
                    this.$refs.textField[0].focus();
                }

                try {
                    // this is where we'll make the request to wheels endpoint
                    // we'll also handle logic to support if they user needs to resend the code
                } catch (error) {
                    console.log(error);
                }
            },

            /**
             * Proceed to the next checkout rental step
             */
            nextStep () {
                // Check if validation has failed
                this.failedValidation = Boolean(!this.validations.verificationCode);

                // this is where we'll verify the code that was sent. Note sure
                // if we'll make another request to API or not?
                if (!this.failedValidation) {
                    // store the user data in the store
                    this.$store.commit('setUserData', {
                        verificationCode: this.verificationCode.join(''),
                    });

                    // Track step 3
                    this.$mixpanel.track('step 3');

                    // Move to the next step
                    this.$store.commit('updateRentalCheckoutStep', this.$store.state.rentalCheckoutStep + 1);

                    // Push the next step into the window history
                    window.history.pushState({ step: 4 }, null, '#step=4');
                }
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
        width: 43rem;
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
        max-width: 30rem;
        width: 100%;
    }

    .input:global(.v-text-field.v-text-field--enclosed) {
        margin: 0 .5rem;
    }

    :global(.theme--light.v-text-field>.v-input__control>.v-input__slot:before) {
        border: none;
        border-bottom: .25rem solid #c5235c;
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

    .resendBtn {
        background-color: #e8627f;
        border-color: transparent;
        border-radius: 50px;
        letter-spacing: 0;
        margin: 2rem auto 2rem;
        width: 13rem;
    }

    .resendBtn span {
        font-size: 1.25rem;
    }

    .nextBtn {
        background-color: #e1b426;
        border-color: transparent;
        border-radius: 50px;
        margin: 0 auto;
        width: 17rem;
    }

    .nextBtn span {
        font-size: 1.75rem;
    }

    .resendBtn span,
    .nextBtn span {
        color: #fff;
    }

    .error {
        color: #ff5252;
        font-size: .75rem;
        margin-top: 1.5rem;
        text-align: center;
    }

    @media only screen and (max-width: 1200px) {
        .container {
            width: 30rem;
        }

        .prompt {
            font-size: 1.5rem;
        }

        .nextBtn {
            max-width: 13rem;
            width: 100%;
        }

        .nextBtn span {
            font-size: 1.4rem;
        }

        .input div:global(.v-input__slot) {
            /* This is necessary to remove inline styles from vuetify */
            background-color: transparent !important;
        }
    }

    @media only screen and (max-width: 768px) {
        .input :global(.v-text-field__slot) input,
        .input :global(.v-text-field__slot) input::placeholder {
            font-size: 1rem;
        }

        .resendBtn {
            margin-bottom: 1rem;
        }
    }
</style>