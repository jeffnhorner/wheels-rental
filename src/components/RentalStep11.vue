<template>
    <div
        v-bind:class="$style.container"
    >
        <div v-bind:class="$style.topContainer">
            <p v-bind:class="$style.prompt">Review your cart</p>
            <p v-bind:class="$style.deliveredTo">Delivered to:</p>
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
                <p>{{ $store.state.userData.bikeRentalType === 'private' ? 'Private' : 'Delivery' }} Rental</p>
            </div>
            <VBtn
                v-bind:class="$style.btn"
                height="5rem"
                filled
                outlined
                rounded
                v-on:click="nextStep"
            >
                Pay {{ determineButtonText($store.state.userData.bikeRentalPlan ? $store.state.userData.bikeRentalPlan : bikeRentalPlan) }}
            </VBtn>
            <p v-bind:class="$style.subscription">Subscription automatically renews, cancel anytime.</p>
        </div>
    </div>
</template>

<script>
    export default {

    }
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

    .topContainer {
        margin-top: -4.5rem;
    }

    .prompt {
        font-weight: 600;
        font-size: 2.5rem;
        text-align: center;
    }

    p.deliveredTo {
        font-size: 1.1rem;
        color: #8c8c8c;
        margin-top: -.5rem;
        margin-bottom: 0;
        text-align: center;
    }

    p.address {
        font-size: 1.5rem;
        font-weight: 500;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .bikePlans {
        border: 1px solid #aeaeae;
        border-radius: 50px;
        display: flex;
        justify-content: space-between;
        padding: .5rem;
        margin: 0 auto 2rem;
        width: 30rem;
    }

    .planBtn {
        width: 33%;
    }

    .planBtn span {
        color: #aeaeae;
        letter-spacing: 0;
        text-transform: initial;
    }

    button.planBtn:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default) {
        background: transparent;
        font-size: 1.25rem;
    }

    button.activeThreeMonth:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default),
    button.activeOneMonth:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default),
    button.activeWeekly:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default) {
        background: linear-gradient(to right, #705392, #c5235c);
    }

    button.activeThreeMonth:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default) span,
    button.activeOneMonth:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default) span,
    button.activeWeekly:global(.v-btn.v-btn--depressed.v-btn--rounded.theme--light.v-size--default) span {
        color: #fff;
        font-weight: 700;
        letter-spacing: 0;
    }

    .rentalInfoContainer {
        align-items: center;
        display: flex;
        flex-direction: column;
        margin-top: -2rem;
    }

    .rentalInfoContainer img {
        width: 15rem;
    }

    .rentalInfoContainer p {
        font-size: 2rem;
        font-weight: 700;
    }

    .activeThreeMonth,
    .activeOneMonth,
    .activeWeekly {
        color: red;
    }

    .topWrapper {
        display: flex;
        margin: 2rem auto 0;
        width: 20rem;
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
        height: 5rem;
        margin: 0 auto;
        font-weight: 700;
        letter-spacing: -1px;
        max-width: 24rem;
        text-transform: initial;
        width: 100%;
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

    .subscription {
        color: #8c8c8c;
        margin-top: 1.5rem;
        text-align: center;
    }
</style>