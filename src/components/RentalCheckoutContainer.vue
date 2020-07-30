<template>
    <div v-bind:class="$style.container">
        <g-image
            v-bind:class="$style.backgroundImageLeft"
            src="~/assets/wheelsBackgroundLeft.png"
        />
        <g-image
            v-bind:class="$style.backgroundImageRight"
            src="~/assets/wheelsBackgroundRight.png"
        />
    </div>
</template>

<script>
    export default {

    }
</script>

<style lang="css" module>
    .container {
        display: flex;
        align-items: flex-end;
        height: 100%;
        max-height: 70vh;
    }

    .backgroundImageLeft {
        position: absolute;
        left: 0;
        height: auto;
    }

    .backgroundImageRight {
        position: absolute;
        right: 0;
        height: auto;
    }
</style>