<template>
    <div v-bind:class="$style.container">
        <g-image
            src="~/assets/wheelsLogo.png"
        />
        <div v-bind:class="$style.rightLogoWrapper">
            <g-image src="~/assets/resetLogo.png" />
            <g-image src="~/assets/question.png" />
        </div>
    </div>
</template>

<script>
    export default {

    }
</script>

<style lang="css" module>
    .container {
        border-bottom: 1px solid #e7e7e7;
        display: flex;
        justify-content: space-between;
        padding: 2.5rem;
        width: 100%;
    }

    .rightLogoWrapper {
        align-items: center;
        display: flex;
    }

    .rightLogoWrapper img {
        margin-left: 1.5rem;
    }
</style>