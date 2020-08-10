<template>
    <div v-bind:class="[
        $style.container,
        {
            [$style.containerWithActiveMap] : validations.address,
        },
    ]">
        <p v-bind:class="$style.prompt">Hey {{ firstName }}! What address should we deliver your bike to?</p>
        <div v-bind:class="$style.wrapper">
            <div
                v-if="location.latitude && location.longitude"
                v-bind:class="$style.mapContainer"
            >
                <GmapMap
                    v-bind:options="mapOptions"
                    v-bind:zoom="17"
                    v-bind:center="{
                        lat: location.latitude,
                        lng: location.longitude,
                    }"
                    v-bind:style="{
                        width: '100%',
                        height: '280px',
                    }"
                >
                    <GmapMarker
                        v-bind:position="{
                            lat: location.latitude,
                            lng: location.longitude,
                        }"
                    />
                </GmapMap>
            </div>
            <div v-bind:class="$style.topWrapper">
                <g-image
                    v-bind:class="$style.icon"
                    src="~/assets/mapIcon.png"
                />
                <GmapAutocomplete
                    v-bind:class="[
                        $style.inputLeft,
                        $style.autocomplete,
                        {
                            [$style.hoverStateBorder] : addVuetifyLikeBorderStyle
                        },
                    ]"
                    placeholder="Street Address, City, State"
                    v-on:place_changed="setLocation"
                    v-on:mouseenter="addVuetifyLikeBorderStyle = true"
                    v-on:mouseleave="addVuetifyLikeBorderStyle = false"
                />
                <VTextField
                    v-model="optionalAddressUnit"
                    v-bind:class="$style.inputRight"
                    placeholder="Apt/Unit #"
                    color="#c5235c"
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
            v-on:click="nextStep"
        >
            Next
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
            addVuetifyLikeBorderStyle: false,
            failedValidation: false,
            location: {
                latitude: null,
                longitude: null,
            },
            mapOptions: {
                clickableIcons: false,
                disableDefaultUI: true,
                draggable: false,
                fullscreenControl: false,
                mapTypeControl: false,
                rotateControl: false,
                streetViewControl: false,
                zoomControl: false,
            },
            optionalAddressUnit: '',
            validations: {
                address: false,
            },
        }),

        computed: {
            firstName () {
                return this.$store.state.userData.firstName;
            },
        },

        methods: {
            /**
             * Set the location data
             */
            setLocation (result) {
                this.validations.address = result.formatted_address || '';
                this.failedValidation = Boolean(!this.validations.address)

                this.location.latitude = result.geometry.location.lat();
                this.location.longitude = result.geometry.location.lng();

                // TODO: this is where we'll request plans to see if the address is eligible
            },

            /**
             * Proceed to the next checkout rental step
             */
            nextStep () {
                this.failedValidation = Boolean(!this.validations.address.length)

                if (!this.failedValidation) {
                    this.$store.commit('setUserData', {
                        address: this.validations.address,
                        ...(this.optionalAddressUnit?.length ? { optionalAddressUnit: this.optionalAddressUnit } : {}),
                    });

                    // Update the mixpanel user profile
                    this.$mixpanel.people.set({
                        address: this.validations.address,
                        ...(this.optionalAddressUnit?.length ? { optionalAddressUnit: this.optionalAddressUnit } : {}),
                    });

                    // Associate the new user profile with the mixpanel distinct id.
                    // This must be called everytime mixpanel.people.set is used.
                    // NOTE: this may be updated with unique ID from wheels?
                    this.$mixpanel.identify(this.$mixpanel_unique_id);

                    // Track step 6
                    this.$mixpanel.track('step 6', {
                        address: this.validations.address,
                        ...(this.optionalAddressUnit?.length ? { optionalAddressUnit: this.optionalAddressUnit } : {}),
                    });

                    // Move to the next step
                    this.$store.commit('updateRentalCheckoutStep', this.$store.state.rentalCheckoutStep + 1);

                    // Push the next step into the window history
                    window.history.pushState({ step: 7 }, null, '#step=7');
                }
            },
        }
    }
</script>

<style lang="css" module>
    .container {
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        position: relative;
        width: 42.5%;
        max-width: 50rem;
        z-index: 20;
    }

    .container > p {
        line-height: 2.5rem;
    }

    .containerWithActiveMap {
        margin-top: -4rem;
    }

    .mapContainer :global(.vue-map) {
        border-radius: 20px;
        border: 2px solid lightgrey;
    }

    .wrapper {
        display: flex;
        flex-direction: column;
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

    .inputRight:global(.v-text-field.v-text-field--enclosed) {
        margin-bottom: 2.25rem;
    }

    .autocomplete {
        height: 4rem;
        background: #fff;
        border-radius: 50px;
        border: 1px solid rgba(0, 0, 0, .4);
        transition: .2s ease-in-out;
        padding-left: 3.5rem;
        width: 75%;
    }

    .autocomplete:focus {
        border: 2px solid #c5235c;
        caret-color: #c5235c;
        outline: none;
        padding-left: 3.45rem;
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

    .inputRight,
    .btn {
        border-radius: 50px;
    }

    .inputRight :global(.v-text-field__slot) input,
    .autocomplete,
    .inputRight :global(.v-text-field__slot) input::placeholder,
    .autocomplete::placeholder {
        font-size: 1.25rem;
    }

    .inputRight :global(.v-text-field__slot) input::placeholder,
    .autocomplete::placeholder {
        color: #aeaeae;
    }

    .inputLeft :global(.v-text-field__slot) input {
        padding-left: 2rem;
    }

    .hoverStateBorder {
        border-color: black;
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