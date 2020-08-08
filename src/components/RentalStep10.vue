<template>
    <div
        v-bind:class="$style.container"
    >
        <div v-bind:class="$style.topContainer">
            <p v-bind:class="$style.prompt">Purchase Confirmation</p>
            <p v-bind:class="$style.confirmationMessage">You're all set! A operations team member will email you shortly to confirm your delivery date and time</p>
            <div v-bind:class="$style.rentalInfoContainer">
                <g-image
                    v-if="$store.state.userData.bikeRentalType === 'private'"
                    v-bind:class="$style.image"
                    src="~/assets/privateRental.png"
                />
                <g-image
                    v-else
                    v-bind:class="$style.image"
                    src="~/assets/deliveryRental.png"
                />
            </div>
        </div>
    </div>
</template>

<style lang="css" module>
    .container {
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        position: relative;
        width: 50rem;
        z-index: 20;
    }

    p.prompt {
        font-weight: 600;
        font-size: 2.25rem;
        margin-bottom: 0;
        text-align: center;
    }

    p.confirmationMessage {
        color: 111;
        display: block;
        font-size: 1.5rem;
        max-width: 40rem;
        margin: 0 auto;
        text-align: center;
        width: 100%;
    }

    .rentalInfoContainer {
        align-items: center;
        display: flex;
        flex-direction: column;
    }
</style>