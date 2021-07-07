<template>
    <div class="footer-wrap">
        <div class="left">
            <div class="account-info">
                <div class="coin-address">{{desensitization(currentAccount, 6, 3)}}</div>
                <div class="footer-logo"></div>
            </div>
            <!-- <div :class="{ 'current-balance-up': priceColor=='green', 'current-balance-down': priceColor=='red','current-balance':priceColor=='black'}" >${{numberFormat(currentBalance,4)}}</div> -->
            <div :class="{ 'current-balance-up': priceColor=='green', 'current-balance-down': priceColor=='red','current-balance':priceColor=='black'}">
                $<countTo ref='countTo'  :startVal='priceInfo.startVal' :endVal='priceInfo.endVal' :duration='priceInfo.duration' :decimals=priceInfo.decimals :autoplay=priceInfo.autoplay ></countTo>
            </div>
            
        </div>
        <div class="btns">
            <div class="lang-wrap">
                <van-popover
                    placement="top"
                    v-model="showLangPopover"
                    trigger="click"
                    :actions="actions"
                    @select="onSelect"
                    >
                    <template #reference>
                        <div class="footer-qiu"></div>
                    </template>
                </van-popover>
            </div>
            <div class="url-list">
                <van-popover
                    placement="top-end"
                    v-model="showUrlPopover"
                    trigger="click"
                    :actions="urlactions"
                    @select="onUrlSelect"
                    >
                    <div v-for="(item, index) in urlactions" :key="index" class="van-popover__action van-popover__action--with-icon">
                        <a class="van-popover-link" :href="item.url">
                            <i class="van-icon van-popover__action-icon" :class="[`van-icon-${item.icon}`]"></i>
                            <div class="van-popover__action-text">{{item.text}}</div>
                        </a>
                    </div>
                    <template #reference>
                        <div class="footer-dot"></div>
                    </template>
                </van-popover>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import {numberFormat} from '@/constant';
import * as math from 'mathjs';
import countTo from 'vue-count-to';

export default {
    components: { countTo },
    data() {
        return {
            showLangPopover: false,
            showUrlPopover: false,
            currentAccount: '0x0000000000000000000000000000000000000000',
            currentBalance: 0,
            priceInfo:{
                useEasing:true,
                decimals:6,
                autoplay:true,
                // 需要滚动的时间
                duration: 1000,
                // 初始值
                startVal: 0,
                // 最终值
                endVal: 0
            },
            priceColor:'black'
        };
    },
    computed: {
        ...mapGetters({
            getLocaleLang: 'getLocaleLang',
            inviteCode: 'getInviteCode',
            getDefaultAccount:'getDefaultAccount'
        }),
        urlactions() {
            return [
                {text: this.$t('footerText1'), icon: 'view-qukuai-icon', id: 'zh', url: 'https://bscscan.com/token/0x5b6e3447408c65d5118bfb86c75a49313a77e125'},
                {text: this.$t('footerText6'), icon: 'aoyun-icon', id: 'en', url: `https://olympics.com/${this.getLocaleLang}/`},
                {text: this.$t('footerText2'), icon: 'white-paper-icon', id: 'en', url:`/whitepaper/OACoinWhitepaper_${this.getLocaleLang}.pdf`},
                // {text: this.$t('footerText5'), icon: 'github-icon', id: 'ja', url: `https://github.com/`},
                {text: this.$t('footerText3'), icon: 'twiter-icon', id: 'ja', url: 'https://twitter.com/OAcoin1'},
                {text: this.$t('footerText4'), icon: 'dianbao-icon', id: 'zh', url: 'https://t.me/OAcoin1'},
            ];
        },
        actions() {
            return [
                {text: this.$t('zh'), icon: 'zh-icon', id: 'zh', className: this.getLocaleLang === 'zh' ? 'active' : ''},
                {text: this.$t('en'), icon: 'en-icon', id: 'en', className: this.getLocaleLang=== 'en' ? 'active' : ''},
                {text: this.$t('ja'), icon: 'ja-icon', id: 'ja', className: this.getLocaleLang === 'ja' ? 'active' : ''}
            ];
        }
    },
    methods: {
        ...mapMutations({
            changeLang: 'changeLang'
        }),
        numberFormat,
        onUrlSelect(action) {
            console.log(action);
        },
        onSelect(action) {
            this.$i18n.locale = action.id;
            this.changeLang(action.id);
        },
        desensitization(str, beginLen, endLen){
            if (!str) {
                return str;
            }
            if (Number(beginLen) && Number(endLen)) {
                var firstStr = str.substr(0, beginLen);
                var lastStr = str.substr(-Number(endLen));
                var middleStr = '***';
                var tempStr = firstStr+middleStr+lastStr;
                return tempStr;
            }
            return str;
        },
        formatNum(num, wei = 4) {
            return math.format(math.floor(Number(num), wei),{notation: 'fixed'});
        },
        changePrice(price){
            let that =this;
            if(price > that.$web3.oaInfo.VALUE){
                that.priceColor = 'green';
            }
            if(price < that.$web3.oaInfo.VALUE){
                that.priceColor = 'red';
            }
            that.priceInfo.startVal = Number(that.$web3.oaInfo.VALUE)
            that.priceInfo.endVal = Number(price);
            that.$web3.oaInfo.VALUE = price;
            }
    },
    mounted() {
        let that =this;
        let VALUE = this.$web3.oaInfo ? this.$web3.oaInfo.VALUE : 0;
        let account = this.$web3.eth.defaultAccount;
        this.currentAccount = account;
        this.priceInfo.endVal = Number(VALUE);
        this.currentBalance = VALUE;

        this.$web3.oaInfo && this.$web3.oaInfo.contract.events.changePrice(function(error,event) {
            
            if(!error){
                let price = that.formatNum(that.$web3.utils.fromWei(event.returnValues.price, 'ether'),6);
                that.priceColor = 'black';
                setTimeout(() => {
                    that.changePrice(price);
                }, 1000);
            }
        }).on("connected", function(subscriptionId){
            console.log("oaInfo.contract.events.changePrice.connected",subscriptionId);
        })

    }
};
</script>
<style lang="stylus" scoped>
.footer-wrap {
    width: 100%;
    position: fixed;
    z-index: 100;
    left: 0;
    right: 0;
    bottom: 0;
    height: 108px;
    background: #fff;
    padding: 18px 30px 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .left, .btns {
        display: flex;
    }
    .account-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 300px;
        height: 80px;
        line-height: 80px;
        padding: 0 10px 0 15px;
        box-sizing: border-box;
        border-radius: 20px;
        border: 1px solid #E6E6E6;
        .coin-address {
            font-size: 32px;
            font-weight: 600;
            color: #000;
        }
        .footer-logo {
            width: 40px;
            height: 40px;
            background: url(../assets/img/footer-logo.png) no-repeat;
            background-size: contain;
        }
    }
    .current-balance {
        height: 80px;
        line-height: 80px;
        font-size: 28px;
        font-weight: 600;
        color: #000;
        margin-left: 15px;
        
    }
    .current-balance-up {
        height: 80px;
        line-height: 80px;
        font-size: 28px;
        font-weight: 600;
        // color: green;
        margin-left: 15px;
        animation: up 2s linear 0s;
    }
    @keyframes down {
        0% {color: #333;}
        50% {color: #f60;}
        100% {color: #f00;}
    }
    @keyframes up {
        0% {color: #333;}
        50% {color: #6a9768;}
        100% {color: #34cf30;}
    }
    .current-balance-down {
        height: 80px;
        line-height: 80px;
        font-size: 28px;
        font-weight: 600;
        // color: red;
        margin-left: 15px;
        animation: down 2s linear 0s;
    }
    .lang-wrap {
        border-radius: 10px;
        background-color: #E6E6E6;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 70px;
        height: 70px;
        box-sizing: border-box;
        padding: 13px;
        .footer-qiu {
            width: 44px;
            height: 44px;
            background: url(../assets/img/footer-qiu.png) no-repeat;
            background-size: contain;
        }
    }
    .url-list {
        background-color: #E6E6E6;
        margin-left: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 70px;
        height: 70px;
        border-radius: 10px;
        overflow: hidden;
        .footer-dot {
            display: block;
            width: 38px;
            height: 10px;
            background: url(../assets/img/group-dot.png) no-repeat;
            background-size: contain;
            background-position: center;
        }
        .list-link {
            display: block;
        }
    }
}
</style>
<style lang="stylus">
.van-dropdown-menu, .van-dropdown-menu .van-dropdown-menu__bar {
    width: 100%;
    height: 100%;
    background-color: #E6E6E6;
}
.van-dropdown-menu__title {
    padding: 0;
}
.van-dropdown-menu__title--active::after {
    display: none;
}
</style>