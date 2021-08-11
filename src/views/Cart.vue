<template>
    <div class="cart">
        <Footer/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Footer from '@/components/Footer.vue'

export default Vue.extend({
    name: 'Cart',
    components: {
        Footer
    }
})
</script>

<style lang="scss">

</style>