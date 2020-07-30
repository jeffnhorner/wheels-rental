<template>
    <div v-bind:class="$style.container">
        <div>
            <g-image
                v-bind:class="$style.logo"
                src="~/assets/wheelsLogo.png"
            />
            <p v-bind:class="$style.copywright">Copywright Wheels. All Rights Reserved</p>
        </div>
        <div v-bind:class="$style.rightWrapper">
            <p v-bind:class="$style.links">Private Rental | Delivery Rental | Contact Us | Faq</p>
            <div v-bind:class="$style.socials">
                <FontAwesome
                    v-bind:icon="['fab', 'facebook-square']"
                    v-bind:class="$style.icon"
                    size="lg"
                />
                <FontAwesome
                    v-bind:icon="['fab', 'twitter']"
                    v-bind:class="$style.icon"
                    size="lg"
                />
                <FontAwesome
                    v-bind:icon="['fab', 'instagram']"
                    v-bind:class="$style.icon"
                    size="lg"
                />
            </div>
        </div>
    </div>
</template>

<script>
    export default {

    }
</script>

<style lang="css" module>
    .container {
        color: #4d5aa5;
        display: flex;
        font-family: 'Poppins', sans-serif;
        margin: 0 auto;
        justify-content: space-between;
        padding: 2.5rem 2.5rem;
        width: 100%;
    }

    .logo {
        width: 17rem;
    }

    .copywright {
        font-weight: 300;
        font-size: 1rem;
        margin-top: .5rem;
    }

    .links {
        font-size: 1.15rem;
        font-weight: 400;
        text-transform: uppercase;
    }

    .socials {
        display: flex;
        justify-content: flex-end;
        margin-right: 1rem;
    }

    .icon {
        margin-right: .5rem;
    }

    @media only screen and (min-width: 1200px) {
        .container {
            padding: 2.5rem 0;
            max-width: 75%;
        }
    }
</style>