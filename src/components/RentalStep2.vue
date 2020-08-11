<template>
  <VForm v-on:submit="nextStep" v-bind:class="$style.container">
    <p v-bind:class="$style.prompt">
      Please enter your phone number. We’ll use this to send you updates about
      your rental.
    </p>
    <div v-bind:class="$style.topWrapper">
      <VTextField
        v-model="phone"
        v-bind:class="$style.input"
        placeholder="Phone Number *"
        color="#c5235c"
        background-color="#fff"
        v-bind:height="isTabletOrMobile ? '3rem' : '4rem'"
        filled
        outlined
        rounded
        hide-details
        v-on:input="checkValidations"
        v-bind:rules="[
          (value) =>
            !validations.phone || (value || '').length !== 10
              ? 'Please enter a 10 digit phone number'
              : true,
        ]"
      />
    </div>
    <VBtn
      v-bind:class="$style.btn"
      v-bind:height="isTabletOrMobile ? '4rem' : '5rem'"
      background-color="#fff"
      type="submit"
      filled
      outlined
      rounded
      :loading="this.loading"
    >
      Next
    </VBtn>
    <p v-if="failedValidation" v-bind:class="$style.error">
      Please enter a valid phone number
    </p>
  </VForm>
</template>

<script>
import gql from "graphql-tag";
import PhoneNumber from "awesome-phonenumber";
export default {
  data: () => ({
    failedValidation: false,
    phone: "",
    loading: false,
    validations: {
      phone: false,
    },
  }),

  computed: {
    isTabletOrMobile() {
      return this.$mq === "md" || this.$mq === "sm" || this.$mq === "xs";
    },
  },

  created() {
    // New regex to test if the entered phone number is numbers only
    this.checkForNumbersOnly = new RegExp("^[0-9]+$");

    // If the user reset the checkout flow, we can assume we've store some state to prefill
    // some of the fields
    if (this.$store.state.userData?.phone) {
      this.phone = this.$store.state.userData.phone;

      // Does it pass validation?
      this.validations.phone = Boolean(
        this.checkForNumbersOnly.test(this.phone) && this.phone.length === 10
      );
    }
  },

  methods: {
    /**
     * Ensure fields are validated
     */
    checkValidations() {
      // Has the user passed validation?
      const phoneNumber = new PhoneNumber(this.phone, "US");
      this.validations.phone = phoneNumber.isValid();

      // Check if validation has failed
      this.failedValidation = Boolean(!this.validations.phone);
    },

    /**
     * Proceed to the next checkout rental step
     */
    nextStep(e) {
      e.preventDefault();
      this.loading = true;
      // Check if validation has failed
      this.failedValidation = Boolean(!this.validations.phone);

      if (this.failedValidations) return;

      const phoneNumber = new PhoneNumber(this.phone, "US");
      const formattedPhoneNumber = phoneNumber.getNumber();
      this.$apollo
        .mutate({
          mutation: gql`
            mutation TriggerPhoneNumberValidation($phone_number: String) {
              trigger_phone_number_validation(phone_number: $phone_number) {
                success
                errors {
                  code
                  message
                }
              }
            }
          `,
          variables: {
            phone_number: formattedPhoneNumber,
          },
        })
        .then((res) => {
          const data = res.data.trigger_phone_number_validation;
          if (!data.success) {
            this.failedValidation = true;
            this.loading = false;
            return;
          }

          this.$store.commit("setUserData", {
            phone: formattedPhoneNumber,
          });

          // Update the mixpanel user profile
          this.$mixpanel.people.set({
            phone: formattedPhoneNumber,
          });

          // Associate the new user profile with the mixpanel distinct id.
          // This must be called everytime mixpanel.people.* is used.
          // NOTE: this may be updated with unique ID from wheels?
          this.$mixpanel.identify(this.$mixpanel_unique_id);

          // Track step 2
          this.$mixpanel.track("step 2", {
            phone: formattedPhoneNumber,
          });

          // Move to the next step
          this.$store.commit(
            "updateRentalCheckoutStep",
            this.$store.state.rentalCheckoutStep + 1
          );

          // Push the next step into the window history
          window.history.pushState({ step: 3 }, null, "#step=3");
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
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
    width: 100%;
    max-width: 20rem;
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

@media only screen and (max-width: 1200px) {
    .container {
        width: 30rem;
    }

    .prompt {
        font-size: 1.5rem;
    }

    .btn {
        max-width: 13rem;
        width: 100%;
    }

    .btn span {
        font-size: 1.4rem;
    }
}

@media only screen and (max-width: 768px) {
    .input :global(.v-text-field__slot) input,
    .input :global(.v-text-field__slot) input::placeholder {
        font-size: 1rem;
    }
}
</style>
