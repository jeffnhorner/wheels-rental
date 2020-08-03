<template>
    <div v-bind:class="$style.container">
        <p v-bind:class="$style.prompt">Hey {{ firstName }}! What address should we deliver your bike to?</p>
        <div v-bind:class="$style.wrapper">
            <div
                v-if="location.latitude && location.longitude"
                v-bind:class="$style.mapContainer"
            >
                <GmapMap
                    ref="map"
                    v-bind:options="mapOptions"
                    v-bind:zoom="16"
                    v-bind:center="{
                        lat: location.latitude,
                        lng: location.longitude,
                    }"
                    v-bind:style="{
                        width: '100%',
                        height: '225px',
                    }"
                />
            </div>
            <div v-bind:class="$style.topWrapper">
                <g-image
                    v-bind:class="$style.icon"
                    src="~/assets/mapIcon.png"
                />
                <GmapAutocomplete
                    v-bind:class="[$style.input, $style.inputLeft, $style.autocomplete]"
                    placeholder="Street Address, City, State"
                    v-on:place_changed="updateLocation"
                />
                <VTextField
                    v-model="optionalAddress"
                    v-bind:class="[$style.input, $style.inputRight]"
                    placeholder="Apt/Unit #"
                    color="#973376"
                    background-color="#fff"
                    height="4rem"
                    filled
                    outlined
                    rounded
                    hide-details
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
            v-on:click="nextStep(Boolean(hasRetrievedMap))"
        >
            Get Started
        </VBtn>
        <p
            v-if="failedValidation"
            v-bind:class="$style.error"
        >
            Please enter your Street Address, City, State.
        </p>
    </div>
</template>

<script>
    export default {
        data: () => ({
            address: '',
            failedValidation: false,
            location: {
                latitude: null,
                longitude: null,
            },
            mapOptions: {
                mapTypeControl: false,
                disabaleDefaultUi: true,
                fullScreenControl: false,
                streeViewControl: false,
            },
            optionalAddress: '',
            validations: {
                address: false,
                optionalAddress: false,
            },
        }),

        computed: {
            firstName () {
                return this.$store.state.userData.firstName;
            },
        },

        created () {
            // If the user reset the checkout flow, we can assume we've store some state to prefill
            // some of the fields
            if (this.$store.state.userResetRentalCheckoutFlow) {
                const { address, optionalAddress } = this.$store.state.userData;

                this.address = address;
                this.optionalAddress = optionalAddress;

                // Does it pass validation?
                this.validations.address = this.address.length;
                this.validations.optionalAddress = this.optionalAddress.length;
            }

            this.hasParameters = Object.keys(this.$route.query).length;

            if (this.hasParameters && !this.$store.state.userResetRentalCheckoutFlow) {
                // Use object destructions to see if there are fname or lname passed from rental landing page
                // NOTE: these parameter key names may change
                const { fname, lname } = this.$route.query;

                // If either fname or lname are defined, update the reactive data key values and check
                // if it passes validation?
                if (fname || lname) {
                    this.address = fname;
                    this.optionalAddress = lname;

                    this.validations.address = this.address.length;
                    this.validations.optionalAddress = this.optionalAddress.length;
                }
            }
        },

        methods: {
            checkValidations () {
                this.validations.address = Boolean(this.address.length);
                this.validations.optionalAddress = Boolean(this.optionalAddress.length);

                this.failedValidation = Boolean(!this.validations.address || !this.validations.optionalAddress)
            },

            nextStep (isRetrievingMap) {
                this.failedValidation = Boolean(!this.validations.address || !this.validations.optionalAddress)

                if (!this.failedValidation) {
                    this.$store.commit('setUserData', {
                        address: this.address,
                        optionalAddress: this.optionalAddress,
                    });

                    // Move to the next step
                    this.$store.commit('updateRentalCheckoutStep', this.$store.state.rentalCheckoutStep + 1);
                }
            },

            updateLocation (result) {
                this.location.latitude = result.geometry.location.lat();
                this.location.longitude = result.geometry.location.lng();
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

    .mapContainer :global(.vue-map) {
        border-radius: 20px;
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        width: 42rem;
    }

    .prompt {
        font-weight: 600;
        font-size: 2.1rem;
        align-self: center;
        text-align: center;
        width: 40rem;
    }

    .topWrapper {
        display: flex;
        margin: 2rem auto 0;
        position: relative;
        width: 100%;
    }

    .icon {
        position: absolute;
        left: 1.5rem;
        top: 1.25rem;
        z-index: 10;
    }

    .input:global(.v-text-field.v-text-field--enclosed) {
        margin-bottom: 2.25rem;
    }

    .autocomplete {
        height: 4rem;
        background: #fff;
        border-radius: 50px;
        border: 2px solid grey;
        padding-left: 3.5rem;
        width: 75%;
    }

    .autocomplete:focus {
        outline: none;
    }

    .inputLeft {
        width: 65%;
    }

    .inputLeft {
        margin-right: .5rem;
    }

    .inputRight {
        width: 35%;
    }

    .inputRight:global(.v-text-field.v-text-field--enclosed) {
        margin-left: .5rem;
    }

    .input,
    .btn {
        border-radius: 50px;
    }

    .input :global(.v-text-field__slot) input,
    .autocomplete,
    .input :global(.v-text-field__slot) input::placeholder,
    .autocomplete::placeholder {
        font-size: 1.25rem;
    }

    .inputLeft :global(.v-text-field__slot) input {
        padding-left: 2rem;
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