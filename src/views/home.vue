<template>
    <div class="home-wrap">
        <div class="banner">
            <div class="content">
                <p>{{$t('homeText1')}}</p>
                <p>{{$t('homeText2')}}</p>
                <div class="active-in-btn" @click="linkToDetail">{{$t('homeText3')}}</div>
            </div>
        </div>
        <div class="white-paper">
            <img src="../assets/img/logo-c.png" alt="">
            <div class="text">{{$t('paperText')}}</div>
            <a class="view-btn" :href="`/whitepaper/OACoinWhitepaper_${getLocaleLang}.pdf`">{{$t('viewPaper')}}</a>
        </div>
        <div class="official-video">
            <h3 class="title">{{$t('videoHead')}}</h3>
            <div class="swiper-container">
                <van-swipe ref="swipe" class="my-swipe" :touchable="true" indicator-color="white">
                    <van-swipe-item v-for="(item, index) in swiperList" :key="index">
                        <OfficialVideo :videoUrl="item.url" :title="item.title" />
                    </van-swipe-item>
                </van-swipe>
                <div class="van-swipe-prev van-icon van-icon-arrow-left" :class="{show: isPc}" @click="swipeMove('prev')"></div>
                <div class="van-swipe-next van-icon van-icon-arrow-left" :class="{show: isPc}" @click="swipeMove('next')"></div>
            </div>
        </div>
        <OaTotal class="oa-data" :oaInfo="info" />
        <TechnicalIndicatorKLineChart/>
    </div>
</template>
<script>
import OaTotal from '../components/oaTotal';
import {mapGetters} from 'vuex';
import OfficialVideo from '../components/officialVideo';
import * as math from 'mathjs';
import TechnicalIndicatorKLineChart from '@/components/TechnicalIndicatorKLineChart'

export default {
    data() {
        return {
            /* 首页oa统计数据设置这里的属性 */
            info: {
                // oa最新价
                oaNewestPrice: '0',
                // oa市场价值
                oaMarketPrice: '0',
                // oa 总供应量
                oaTotalSupply: '0',
                // oa总焚毁量
                oaTotalBurned: '0'
            },
            swiperList: [
                // {
                //     url: 'https://s-static.innovid.com/media/encoded/05_21/424671/2_source_118315_520869.mp4',
                //     title: this.$t('ceoSpeech')
                // }
                // ,
                {
                    url: '/video/5460462552461080382.MP4',
                    title: this.$t('ceoSpeech')
                }
            ]
        };
    },
    computed: {
        ...mapGetters({
            getLocaleLang: 'getLocaleLang'
        }),
        isPc() {
            var sUserAgent = navigator.userAgent.toLowerCase();
            if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(sUserAgent)) {
                /* 移动端 */ 
                return false;
            } else {
                /* pc端 */ 
                return true;
            }

        }
    },
    components: {
        OaTotal, OfficialVideo,TechnicalIndicatorKLineChart,
    },
    methods: {
        linkToDetail() {
            this.$router.push('/transmit');
        },
        swipeMove(type) {
            if (type === 'prev') {
                this.$refs.swipe.prev();
            } else {
                this.$refs.swipe.next();
            }
        },
        viewPaper() {

        },
        formatNum(num, wei = 4) {
            return math.format(math.floor(Number(num), wei),{notation: 'fixed'});
        },
    },
    mounted() {
        let that = this;
        if(this.$web3.oaInfo && this.$web3.oaInfo.VALUE){
            this.info.oaNewestPrice = this.$web3.oaInfo.VALUE;
            this.info.oaMarketPrice = this.formatNum(math.multiply(this.$web3.oaInfo.TOTAL,this.info.oaNewestPrice));
            this.$web3.oaInfo.contract.methods.balanceOf('0x0000000000000000000000000000000000000000').call()
            .then(function(r){
                console.log('contract.methods.balanceOf', r)
                let blackBalance = that.formatNum(that.$web3.utils.fromWei(r, 'ether'), 4);
                that.info.oaTotalBurned = blackBalance;
                console.log("oaTotalBurned",blackBalance)
                that.info.oaTotalSupply = that.formatNum(math.subtract(that.$web3.oaInfo.TOTAL,that.info.oaTotalBurned));
                console.log("oaTotalSupply",that.info.oaTotalSupply)
            });
        }
        
        
        
        let inviteCode = this.$route.query.inviteCode;
        console.log("Home.mounted()inviteCode",inviteCode)
        if(inviteCode){
            localStorage.setItem("inviteCode",inviteCode)
        }
        
    }
};
</script>
<style lang="stylus" scoped>
.home-wrap {
    padding-top: 140px;
    padding-bottom: 108px;
    .banner {
        padding-left: 30px;
        background-image: url(../assets/img/huoju@2x.png);
        background-repeat: no-repeat;
        background-position: right center;
        background-size: contain;
        margin: 20px 0 36px;
        .content {
            padding-top: 40px;
            font-size: 48px;
            font-weight: 600;
            color: #000;
            .active-in-btn {
                cursor: pointer;
                padding: 14px 38px;
                margin-top: 30px;
                background-color: #B1353D;
                border-radius: 4px;
                color: #fff;
                font-size: 24px;
                font-weight: 600;
                display: inline-block;
            }
        }
    }
    .white-paper {
        width: 92%;
        margin: 0 auto 80px;
        border-radius: 50px;
        background-color: #fff;
        box-shadow: 10px 10px 80px rgba(174, 174, 192, 0.25);
        overflow: hidden;
        img {
            display: block;
            margin: 44px auto 42px;
            width: 264px;
            height: 264px;
        }
        .text {
            font-size: 28px;
            color: #0D134A;
            line-height: 1.7;
            margin-bottom: 42px;
            padding: 0 70px;
        }
        .view-btn {
            display: block;
            position: relative;
            background-color: #B1353D;
            width: 100%;
            padding: 20px 0;
            text-align: center;
            font-size: 28px;
            font-weight: 600;
            color: #fff;
            &::after {
                content: '';
                position: absolute;
                width: 40px;
                height: 34px;
                background: url(../assets/img/arrow-right.png) no-repeat;
                background-size: contain;
                right: 34px;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }
    .official-video {
        .title {
            margin: 0;
            position: relative;
            padding-left: 30px;
            margin-bottom: 22px;
            font-size: 48px;
            font-weight: 600;
            color: #000;
            margin-left: 30px;
            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 18px;
                background-color: #C83449;
                background-image: url(../assets/img/head-title-bg.png);
                background-repeat: no-repeat;
                background-size: cover;
            }
        }
        .swiper-container {
            position: relative;
            width: 100%;
            height: 550px;
            .my-swipe {
                width: 100%;
                height: 100%;
                background-color: #000;
                .van-swipe__indicators {
                    right: 30px;
                }
            }
            .van-swipe-prev, .van-swipe-next {
                display: none;
                position: absolute;
                width: 40px;
                height: 40px;
                top: 50%;
                color: #fff;
                transform: translateY(-50%);
                &.show {
                    display: block;
                }
            }
            .van-swipe-prev {
                left: 30px;
            }
            .van-swipe-next {
                right: 30px;
                transform: translateY(-50%) rotate(180deg);
                
            }
        }
    }
    .oa-data {
        width: 92%;
        margin: 50px auto 41px;
        border-radius: 50px;
        box-shadow: 10px 10px 80px rgba(174, 174, 192, 0.25);
        background-color: #B1353D;
        background-image: url(../assets/img/frame-1555@2.png);
        background-repeat: no-repeat;
        background-size: cover;
        overflow: hidden;
    }
}

</style>
<style lang="stylus">
.official-video .swiper-container .my-swipe .van-swipe__indicators {
    bottom: 46px;
    transform: scale(1);
    left: auto;
    right: 30px;
}
</style>