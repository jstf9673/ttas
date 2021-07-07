<template>
    <div class="match-wrap">
        <div class="aoyun-info">
            <p class="text1">{{$t('matchText1')}}</p>
            <p class="text2"><span>{{$t('matchText2')}}</span>{{$t('matchText3')}}</p>
            <div class="bg-wrap">
                <van-count-down :time="time">
                    <template #default="timeData">
                        <div class="count-down-wrap">
                            <div class="day item">
                                <span class="block">{{ formatNum(timeData.days) }}</span>
                                <span class="colon">{{$t('dayText')}}</span>
                            </div>
                            <div class="hour item">
                                <span class="block">{{ formatNum(timeData.hours) }}</span>
                                <span class="colon">{{$t('hourText')}}</span>
                            </div>
                            <div class="minute item">
                                <span class="block">{{ formatNum(timeData.minutes) }}</span>
                                <span class="colon">{{$t('minuteText')}}</span>
                            </div>
                            <div class="secend item">
                                <span class="block">{{ formatNum(timeData.seconds) }}</span>
                                <span class="colon">{{$t('secondText')}}</span>
                            </div>
                        </div>
                    </template>
                </van-count-down>
                <a :href="exploreUrl" class="explore-btn">{{$t('matchText4')}}</a>
                <img src="../assets/img/aoyun-bg.png"/>
            </div>
        </div>
        <div class="forecast-info">
            <div class="title-content">
                <p class="title">{{$t('matchText5')}}</p>
                <p class="sub-title">{{$t('matchText6')}}</p>
            </div>
            <div class="bg-wrap">
                <div class="text-wrap">
                    <p>{{$t('matchText7')}}</p>
                    <p>{{$t('matchText8')}}</p>
                </div>
                <div class="explore-btn">{{$t('matchText9')}}</div>
                <img src="../assets/img/aoyun-bg2.png"/>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    data() {
        return {
        };
    },
    computed: {
        ...mapGetters({
            getLocaleLang: 'getLocaleLang'
        }),
        time() {
            return new Date('2021/07/23 19:00:00').getTime() - new Date().getTime();
        },
        exploreUrl() {
            return `https://olympics.com/tokyo-2020/${this.getLocaleLang}/`;
        }
    },
    methods: {
        formatNum(num) {
            if (isNaN(num) || num < 0) {
                return num;
            }
            return Number(num) > 9 ? num : '0' + num;
        }
    },
    mounted() {}
};
</script>
<style lang="stylus" scoped>
.match-wrap {
    padding-top: 140px;
    padding-bottom: 108px;
    .aoyun-info {
        margin-top: 60px;
        .text1 {
            padding-left: 36px;
            color: #BA8B55;
            font-size: 28px;
            margin-bottom: 13px;
        }
        .text2 {
            font-size: 48px;
            padding-left: 36px;
            color: #333947;
            font-weight: 300;
            span {
                font-weight: 700;
            }
        }
        .bg-wrap {
            position: relative;

            margin-top: 62px;
            // background: url(../assets/img/aoyun-bg.png) no-repeat;
            img{
                width :100%;
            }
            background-size: cover;
            .explore-btn {
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
            .count-down-wrap {
                position: absolute;
                left: 40px;
                top: -30px;
                display: flex;
                align-items: center;
                .item {
                    width: 80px;
                    background-color: #B1353D;
                    margin-right: 10px;
                    span {
                        text-align: center;
                        color: #fff;
                        display: block;
                        font-size: 32px;
                        &:last-child {
                            font-size: 20px;
                        }
                    }
                    
                }
            }
        }
    }
    .forecast-info {
        margin-top: 60px;
        .title-content {
            position: relative;
            padding-left: 60px;
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
            .title {
                font-size: 48px;
                font-weight: 600;
                color: #000;
            }
            .sub-title {
                font-size: 20px;
                color: #BA8B55;
            }
        }
        .bg-wrap {
            position: relative;
            
            margin-top: 35px;
            background-size: cover;
            img{
                width :100%;
            }
            .explore-btn {
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
            .text-wrap {
                position: absolute;
                right: 30px;
                top: 40px;
                p {
                    color: #fff;
                    font-size: 72px;
                    font-weight: 600;
                    &:last-child {
                        font-size: 36px;
                    }
                }
            }
        }
    }
}
</style>