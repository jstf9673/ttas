<template>
    <div class="address-wrap"  :class="[getLocaleLang]">
        <div class="content">
            <div class="title">{{$t('transmitText9')}}</div>
            <div class="balance">
                <van-icon name="oa-icon" />
                {{balance}} OA
            </div>
            <div class="tips">{{$tc('transmitText10', tipsBalance, {num: tipsBalance})}}</div>
            <div class="input-wrap">
                <input type="text" v-model="address">
            </div>
            <div class="bind-btn" @click="bindAddress">{{$t('transmitText11')}}</div>
            <div class="bottom-text">
                <span @click="handleClose">{{$t('transmitText12')}}</span>
                
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    data() {
        return {
            balance: '100',
            tipsBalance: 10,
            address: ''
        };
    },
    computed: {
        ...mapGetters({
            getLocaleLang: 'getLocaleLang'
        })
    },
    methods: {
        bindAddress() {
            if (!this.address || this.address === '') {
                this.$toast.fail(this.$t('transmitText21'));
                return;
            }
            this.$emit('bindAddress', this.address);
        },
        handleClose(){
            this.$emit('handleAddressClose');
        }
    },
    mounted() {
        this.address = this.$web3.eth.defaultAccount;
        
    }
}
</script>
<style lang="stylus" scoped>
.address-wrap {
    position: absolute;
    width: 92.4%;
    height: 1300px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-image: url(../assets/img/bind-address-bg.png);
    background-size: 100% auto;
    background-repeat: no-repeat;
    box-sizing: border-box;
    &.en {
        background-image: url(../assets/img/bind-address-bg-en.png);
    }
    &.ja {
        background-image: url(../assets/img/bind-address-bg-ja.png);
    }
    .content {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 59.2%;
        // bottom: 74px;
        bottom: 3.52%;
        text-align: center;
        font-weight: 600;
        .title {
            font-size: 24px;
            color: #F8BF62;
            margin-bottom: 26px;
        }
        .balance {
            font-size: 48px;
            color: #E25E25;
        }
        .tips {
            font-size: 20px;
            color: #F8BF62;
            font-weight: 400;
            margin-bottom: 54px;
        }
        .input-wrap {
            width: 410px;
            height: 80px;
            line-height: 80px;
            border-radius: 40px;
            background-color: #BFC6D8;
            margin: 0 auto 20px;
            input {
                display: block;
                width: 95%;
                height: 80px;
                border-radius: 40px;
                box-sizing: border-box;
                padding: 0 30px;
                font-size: 30px;
                background-color: transparent;
                border: none;
                outline: none;
            }
        }
        .bind-btn {
            width: 410px;
            height: 80px;
            line-height: 80px;
            border-radius: 40px;
            background-color: #EC6234;
            text-align: center;
            color: #fff;
            font-size: 30px;
            margin: 0 auto 120px;
        }
        .bottom-text {
            text-align: center;
            font-size: 36px;
            font-weight: 600;
            color: #000
            border: 1px solid #ec6234;
            padding: 5px 30px;
            display: inline-block;
            border-radius: 30px;
            span {
                color: #000;
            }
        }
    }
}
@media screen and (min-width: 750px) {
    .address-wrap {
        height: 2600px;
        .content {
            // bottom: 17.24%;
            bottom: 21%;
        }
    }
}
</style>