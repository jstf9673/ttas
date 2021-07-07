<template>
    <div class="page-exchange">
        <exchange :isPc="isPc" />
    </div>
</template>
<script>
import exchange from '../components/exchange';
export default {
    data() {
        return {};
    },
    components: {
        exchange
    },
    computed: {
        isPc() {
            var sUserAgent = navigator.userAgent.toLowerCase();
            if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(sUserAgent)) {
                /* 移动端 */ 
                return false;
            }
            /* pc端 */ 
            let html = document.getElementsByTagName('html')
            html[0].style.fontSize = '37.5px'
            return true;
        }
    },
    methods: {},
    mounted() {}
};
</script>
<style lang="stylus" scoped>
.page-exchange {
    padding-top: 140px;
    padding-bottom: 108px;
}
</style>