<template>
    <div v-bind:class="$style.container">
        <div v-bind:class="$style.wrapper">
            <div v-bind:class="$style.imagesLeft">
                <g-image
                    v-bind:class="$style.bikeImgLeft"
                    src="~/assets/wheelsBikeLeft.png"
                />
                <g-image
                    v-bind:class="$style.backgroundImageLeft"
                    src="~/assets/wheelsBackgroundLeft.png"
                />
            </div>
            <component
                v-bind:is="'RentalStep' + rentalCheckoutStep"
             />
            <div v-bind:class="$style.imagesRight">
                <g-image
                    v-bind:class="$style.bikeImgRight"
                    src="~/assets/wheelsBikeRight.png"
                />
                <g-image
                    v-bind:class="$style.backgroundImageRight"
                    src="~/assets/wheelsBackgroundRight.png"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default {
        computed: {
            rentalCheckoutStep () {
                return this.$store.state.rentalCheckoutStep;
            },
        },

        beforeCreate () {
            // Dynamically import all Rental Steps so we don't have to keep up with how many
            // component steps we have. This will scale if we need to modify/add/remove steps at
            // any time.
            const requireContext = require.context('~/components', true, /RentalStep.*\.vue$/);

            const dynamicComponents = requireContext.keys()
                .map(file =>
                    [file.replace(/(^.\/)|(\.vue$)/g, ''), requireContext(file)]
                )
                .reduce((components, [name, component]) => {
                    components[name] = component.default || component
                    return components
                }, {});

            Object.entries(dynamicComponents).forEach(component =>
                // Dynamially import & instantiate the Rental Step components
                Vue.component(`${component[0]}`, () => import(`~/components/${component[0]}`)));
        }
    }
</script>

<style lang="css" module>
    .container {
        margin-bottom: 4rem;
    }

    .wrapper {
        display: flex;
        min-height: 35rem;
        margin-top: 16rem;
        position: relative;
        width: 100%;
    }

    .backgroundImageLeft {
        left: 0;
        position: absolute;
        bottom: 8.25rem;
    }

    .backgroundImageRight {
        position: absolute;
        right: 0;
        bottom: 6.75rem;
    }

    .bikeImgLeft,
    .bikeImgRight {
        position: relative;
        z-index: 10;
    }

    .bikeImgLeft {
        top: 3.25rem;
    }

    .bikeImgRight {
        top: 5rem;
    }

    .imagesLeft {
        position: absolute;
        left: 0;
    }

    .imagesRight {
        position: absolute;
        right: 0;
    }
</style>