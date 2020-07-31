<template>
    <div v-bind:class="$style.container">
        <g-image
            src="~/assets/wheelsLogo.png"
        />
        <div v-bind:class="$style.rightLogoWrapper">
            <g-image
                src="~/assets/resetLogo.png"
                v-on:click="resetCheckRentalFlow"
            />
            <g-image src="~/assets/question.png" />
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            resetCheckRentalFlow () {
                this.$store.commit('updateRentalCheckoutStep', 1);
                this.$store.commit('userResetRentalCheckoutFlow', true);
            }
        }
    }
</script>

<style lang="css" module>
    .container {
        background: #fff;
        border-bottom: 1px solid #e7e7e7;
        display: flex;
        justify-content: space-between;
        padding: 2.5rem;
        position: fixed;
        width: 100%;
        z-index: 15;
    }

    .rightLogoWrapper {
        align-items: center;
        display: flex;
    }

    .rightLogoWrapper img {
        margin-left: 1.5rem;
    }
</style>