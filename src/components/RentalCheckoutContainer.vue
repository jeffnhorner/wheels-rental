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
    export default {
        components: {
            RentalStep1: () => import('~/components/RentalStep1'),
            RentalStep2: () => import('~/components/RentalStep2'),
        },

        computed: {
            rentalCheckoutStep () {
                return this.$store.state.rentalCheckoutStep;
            },
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
        bottom: 7rem;
    }

    .backgroundImageRight {
        position: absolute;
        right: 0;
        bottom: 5.5rem;
    }

    .bikeImgLeft,
    .bikeImgRight {
        position: relative;
        z-index: 10;
    }

    .bikeImgLeft {
        top: 3rem;
    }

    .bikeImgRight {
        top: 3.5rem;
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