<template>
    <div class="container-total">
        <div class="title">{{$t('oaTotalData')}}</div>
        <van-row class="list" type="flex" justify="space-between">
            <van-col class="list-l" span="10">{{$t('oaNewst')}}</van-col>
            <van-col class="list-r" span="14">${{numberFormat(oaInfo.oaNewestPrice,6)}}</van-col>
        </van-row>
        <van-row class="list" type="flex" justify="space-between">
            <van-col class="list-l" span="10">{{$t('oaMarket')}}</van-col>
            <van-col class="list-r" span="14">${{numberFormat(oaInfo.oaMarketPrice)}}</van-col>
        </van-row>
        <van-row class="list" type="flex" justify="space-between">
            <van-col class="list-l" span="10">{{$t('oaTotalSupply')}}</van-col>
            <van-col class="list-r" span="14">{{numberFormat(oaInfo.oaTotalSupply,0)}} OA</van-col>
        </van-row>
        <van-row class="list" type="flex" justify="space-between">
            <van-col class="list-l" span="10">{{$t('oaTotalIncineration')}}</van-col>
            <van-col class="list-r" span="14">{{numberFormat(oaInfo.oaTotalBurned,0)}} OA</van-col>
        </van-row>
    </div>
</template>
<script>
import {numberFormat} from '@/constant';
export default {
    props: {
        oaInfo: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {};
    },
    methods: {
        numberFormat
    },
    mounted() {
        // console.log(this.$t('oaTotalIncineration'), 111, this.$t('message.oaTotalIncineration'));
    }
};
</script>
<style lang="stylus" scoped>
.container-total {
    background-color: #ffffff;
    padding: 40px;
    font-size: 32px;
    box-sizing: border-box;
    .title {
        font-weight: 600;
        font-size: 48px;
        color: #fff;
        margin-bottom: 45px;
    }
    .list {
        background-color: #fff;
        border-radius: 30px;
        margin-bottom: 20px;
        height: 120px;
        line-height: 120px;
        padding: 0 30px;
        &:last-child {
            margin-bottom: 0;
        }
        &-l {
            font-size: 30px;
            color: #BA8B55;
            font-weight: 500;
        }
        &-r {
            text-align: right;
            font-size: 30px;
            font-weight: 500;
        }
    }
}
</style>