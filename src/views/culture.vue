<template>
    <div class="culture-wrap">
        <div class="banner">
            
            <div class="text-content">
                <p>{{$t('cultureText1')}}</p>
                <p>{{$t('cultureText2')}}</p>
                <p>{{$t('cultureText3')}}</p>
            </div>
            <a class="detailes-btn" @click="linkToDetail">{{$t('cultureText4')}}</a>
            <img src='../assets/img/culture-bg1.png'/>
        </div>
        <div class="fire-wrap">
            <div class="text-wrap">
                <p>{{$t('cultureText5')}}</p>
            </div>
            <div class="sub-title">{{$t('cultureText6')}}</div>
            <div class="bg-wrap">
                
                <div class="fire-info">
                    <van-row class="info-details" type="flex" justify="space-between">
                        <van-col span="8">
                            <p class="text">{{$t('cultureText7')}}</p>
                            <p class="num">{{persons}} <span> {{$t('cultureText10')}}</span></p>
                        </van-col>
                        <van-col span="8">
                            <p class="text">{{$t('cultureText8')}}</p>
                            <p class="num">${{fireBalance}}</p>
                        </van-col>
                        <van-col span="8">
                            <p class="text current" @click="receiveBalanceFn">{{$t('cultureText9')}}></p>
                            <p class="num">${{receiveBalance}}</p>
                        </van-col>
                    </van-row>
                    <div class="copy-content">
                        <div class="urls">{{url}}</div>
                        <div class="copy-btn" data-clipboard-action="copy" :data-clipboard-text="url" @click="copyLink">{{$t('cultureText11')}}</div>
                    </div>
                </div>
                <img src="../assets/img/culture-bg2.png" />
            </div>
        </div>
    </div>
</template>
<script>
import * as math from 'mathjs';
export default {
    data() {
        return {
            persons: 0,
            fireBalance: 0,
            receiveBalance: 0,
            url: window.location.origin,
            inviteCode: this.$route.query.inviteCode,  //邀请码
        };
    },
    methods: {
        linkToDetail() {
            this.$router.push('/transmit');
        },
        formatNum(num, wei = 4) {
            return math.format(math.floor(Number(num), wei),{notation: 'fixed'});
        },
        copyLink() {
            let clipboard = new this.clipboard(".copy-btn");
            clipboard.on('success', () => {
                this.$toast.success(this.$t('cultureText12'));
            });
            clipboard.on('error', () => {
                this.$toast.fail(this.$t('cultureText13'));
            });
        },
        getData(){
            var that = this;
            this.$web3.oaInfo && this.$web3.oaInfo.contract.methods.lightInfo(this.$web3.eth.defaultAccount).call().then((result)=>{
                
                console.log("lightSize",result.lightSize);
                
                console.log("lightTotal",result.lightTotal);
                let lightTotal = that.$web3.utils.fromWei(result.lightTotal, 'ether');
                that.fireBalance = that.formatNum(lightTotal);

                console.log("lightReceive",result.lightReceive);
                let lightReceive = that.$web3.utils.fromWei(result.lightReceive, 'ether');
                
                console.log("lightReceive",that.$web3.utils.fromWei('215304665154980320746295526', 'ether'));
                that.receiveBalance = that.formatNum(lightReceive);

            });
        },
        receiveBalanceFn(){
            var that = this;
            if(that.receiveBalance <= 0){
                this.$toast.fail("Insufficient reward balance");
                return;
            }
            this.$web3.oaInfo.contract.methods.bonusGet().send({from:this.$web3.eth.defaultAccount}).then(function(hash){
                console.log("receiveBalanceFn()",hash)
                that.$toast.success("Successful transaction");
                that.getData();
            });
        }
    },
    mounted() {
        var that =this;
        this.url += '?inviteCode='+this.$web3.eth.defaultAccount;
        that.getData();
    }
};
</script>
<style lang="stylus" scoped>
.culture-wrap {
    padding-top: 140px;
    padding-bottom: 108px;
    .banner {
        position: relative;
        margin-top: 75px;
        width: 100%;
        background-size: cover;
        img{
            
            width :100%;
        }
        .text-content {
            position: absolute;
            margin: 49px 0 0 40px;
            p {
                color: #000;
                font-size: 30px;
                line-height: 1.5;
                &:first-child {
                    font-size: 72px;
                    color: #C08E54;
                    font-weight: 600;
                }
            }
        }
        .detailes-btn {
            position: absolute;
            right: 40px;
            bottom: 20px;
            padding: 10px 60px 10px 0;
            font-size: 72px;
            color: #fff;
            font-weight: 600;
            cursor: pointer;
            &::after {
                content: '';
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 40px;
                height: 40px;
                background: url(../assets/img/arrow-right-icon.png) no-repeat;
                background-size: contain;
                background-position: center;
            }
        }
    }
    .fire-wrap {
        margin-top: 70px;
        position: relative;
        width: 100%;
        .text-wrap {
            position: relative;
            padding-left: 60px;
            margin-bottom: 30px;
            &::before {
                content: '';
                position: absolute;
                left: 30px;
                top: 0;
                width: 18px;
                height: 100%;
                background: url(../assets/img/head-title-bg.png) no-repeat;
                background-size: cover;
            }
            p {
                font-size: 48px;
                font-weight: 600;
                color: #000;
            }
        }
        .sub-title {
            padding: 0 30px;
            font-size: 24px;
            color: #BA8B55;
            line-height: 1.5;
        }
        .bg-wrap {
            position: relative;
            width: 92%;
            // height: 790px;
            margin: 30px auto 65px;
            border-radius: 50px;
            // background-color: #000;
            // background-image: url(../assets/img/culture-bg2.png);
            background-size: cover;
            background-repeat: no-repeat;
            img{
                width: 100%;
            }
            .fire-info {
                position: absolute;
                top : 15%;
                width :100%;
                margin: 0px auto;
                .info-details {
                    margin-bottom: 84px;
                    text-align: center;
                    .text {
                        font-size: 24px;
                        color: #CFD3D5;
                        margin-bottom: 18px;
                        &.current {
                            color: #DDB990;
                        }
                    }
                    .num {
                        font-size: 36px;
                        color: #fff;
                        font-weight: 600;
                        span {
                            font-size: 26px;
                            font-weight: 400;
                        }
                    }
                }
                .copy-content {
                    position: relative;
                    width: 70.2%;
                    height: 60px;
                    border-radius: 30px;
                    background-color: #B59A87;
                    margin: 0 auto;
                    line-height: 60px;
                    overflow: hidden;
                    padding: 0 100px 0 28px;
                    .urls {
                        width: 100%;
                        font-size: 20px;
                        font-weight: 500;
                        color: #fff;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                    .copy-btn {
                        position: absolute;
                        right: 0;
                        top: 0;
                        width: 100px;
                        height: 100%;
                        text-align: center;
                        background-color: #fff;
                        color: #000;
                        font-size: 24px;
                        font-weight: 600;
                    }
                }
            }
        }
    }
}
</style>