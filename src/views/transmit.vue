<template>
    <div class="transmit-wrap" :class="[getLocaleLang]">
        <div class="lang-wrap">
            <van-popover
                placement="bottom"
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
        <div class="group">
            <div class="outer">
                <div class="title">{{$t('transmitText1')}}</div>
            </div>
            <dir class="show-user-address" v-if="hasBindAddress">{{desensitization(getUserAddress, 4, 5)}}</dir>
            <div v-else class="bind-address-btn" @click="openAddressDialog">{{$t('transmitText2')}}</div>
            <div class="line"></div>
            <div class="tips-text">{{$t('transmitText3')}}</div>
            <div class="progress-wrap">
                <div class="main-line">
                    <div class="current" :style="{width: getProgress}"></div>
                </div>
                <div class="progress-steps">
                    <div class="item" v-for="(item, index) in progressSteps" :key="index">
                        <div class="box" :class="item.status === 1?'box-active':'box-disable'" @click="tixian(item)"></div>
                        <!-- <div class="nums">{{item.amount * item.number}}{{$t('cultureText10')}}</div> -->
                        <div class="nums">{{item.amount * item.number}} OA</div>
                    </div>
                </div>
            </div>
            <div class="invite-btn" data-clipboard-action="copy" :data-clipboard-text="getInviteUrl" @click="handleInvite">{{$t('transmitText4')}}</div>
            <div class="my-invites">
                <div class="title">{{$t('transmitText5')}}</div>
                <div class="content">
                    <div class="con">
                        <div class="num">{{invites}}</div>
                        <div class="bottom">
                            <van-icon name="person-icon" />{{$t('transmitText6')}}
                        </div>
                    </div>
                    <div class="con">
                        <div class="num">{{inviteCoins}}</div>
                        <div class="bottom">
                            <van-icon name="gift-icon" />{{$t('transmitText7')}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="invite-list">
                <div class="title">{{$t('transmitText8')}}</div>
                <ul v-if="inviteList && inviteList.length">
                    <li v-for="(item, index) in inviteList" :key="index">
                        <van-row type="flex" justify="space-between">
                            <p class="address">{{desensitization(item.address, 4, 5)}}</p>
                            <p class="balance">{{ item.coin }} OA</p>
                        </van-row>
                    </li>
                </ul>
                <div v-else class="no-data">{{$t('transmitText26')}}</div>
            </div>
        </div>
        <div class="back-to-home" @click="backToHome">{{$t('backToHome')}}</div>
        <a class="telegram-warp" href='https://t.me/OAcoin1'>
            <img src="../assets/img/telegram.png"  />
        </a>
        <a class="twitter-warp" href='https://twitter.com/OAcoin1'>
            <img src="../assets/img/twitter.png"  />
        </a>
        <van-overlay style="overflow-y: auto;" :show="showAddressDialog" @click="showAddressDialog = false">
            <div class="modal-wrapper" @click.stop>
                <BindAddress @bindAddress="bindAddress" @handleAddressClose="handleAddressClose" />
            </div>
        </van-overlay>
        <van-overlay style="overflow-y: auto;" :show="showEmailDialog">
            <div class="modal-wrapper" @click.stop>
                <SubmitEmail @handleClose="handleClose" :address="address" @submitInfo="submitInfo" />
            </div>
        </van-overlay>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import SubmitEmail from '@/components/submitEmail.vue';
import BindAddress from '@/components/bindAddress.vue';
import {urlDelP} from '@/constant';
import {getInvitationInfo, getInvitationRecord, getAirDrop, handleWithdr} from '@/api/api';
export default {
    data() {
        return {
            showLangPopover: false,
            invites: 0,
            inviteCoins: 0,
            showAddressDialog: false,
            showEmailDialog: false,
            progressSteps: [
                {number: 5, amount: 0},
                {number: 15, amount: 0},
                {number: 50, amount: 0},
                {number: 100, amount: 0}
            ],
            address: '',
            inviteList: [
            ],
            paddress: ''
        };
    },
    components: {
        BindAddress, SubmitEmail
    },
    computed: {
        ...mapGetters({
            getLocaleLang: 'getLocaleLang',
            getUserAddress: 'getUserAddress'
        }),
        getProgress() {
            if (Number(this.inviteCoins) === 0) {
                return '5%';
            }
            return (this.inviteCoins / 8) + '%';
        },
        hasBindAddress() {
            return this.getUserAddress && this.getUserAddress !== '';
        },
        getInviteUrl() {
            let res = '';
            let currentUrl = window.location.href;
            if (currentUrl.indexOf('?') > -1) {
                if (currentUrl.indexOf('paddress') > -1) {
                    res = urlDelP(currentUrl, 'paddress') + '&paddress=' + this.getUserAddress;
                } else {
                    res = currentUrl + '&paddress=' + this.getUserAddress;
                }
            } else {
                res = currentUrl + '?paddress=' + this.getUserAddress;
            }
            return res;
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
            changeLang: 'changeLang',
            setUserAddress: 'setUserAddress'
        }),
        toWebsite(url){
            this.$router.push(url)
        },
        onSelect(action) {
            this.$i18n.locale = action.id;
            this.changeLang(action.id);
        },
        handleInvite() {
            let clipboard = new this.clipboard(".invite-btn");
            clipboard.on('success', () => {
                this.$toast.success(this.$t('cultureText12'));
            });
            clipboard.on('error', () => {
                this.$toast.fail(this.$t('cultureText13'));
            });
        },
        desensitization(str, beginLen, endLen){
            if (Number(beginLen) && Number(endLen)) {
                var firstStr = str.substr(0, beginLen);
                var lastStr = str.substr(-Number(endLen));
                var middleStr = '***';
                var tempStr = firstStr+middleStr+lastStr;
                return tempStr;
            }
            return str;
        },
        tixian(item) {
            if (!item.status) {
                this.$toast.fail('Not available');
                return;
            }
            if (item.status === 0) {
                this.$toast.fail(`Can't get it yet`);
                return;
            }
            if (item.status === 2) {
                this.$toast.fail(`Already received`);
                return;
            }
            this.$toast.loading({
                duration: 5000,
                message: 'Submitting...',
                forbidClick: true,
                loadingType: 'spinner',
            });
            handleWithdr({address: this.getUserAddress, id: item.id}).then(()=> {
                this.$toast.clear();
                
                this.$toast.success(this.$t('transmitText30'));
                this.initPage();
            }).catch(() => {});
        },
        getInviteInfo() {
            getInvitationInfo({address: this.getUserAddress}).then(res => {
                
                let data = res.data;
                
                if(data.content){
                    let dglDrop = data.content.dglDrop;
                    this.invites = dglDrop.users + dglDrop.indirectUsers;
                    this.inviteCoins = dglDrop.balance;
                    this.progressSteps = data.content && data.content.withdrRecordList && data.content.withdrRecordList.length >0 ? data.content.withdrRecordList.slice(0, 4) : [];
                }else{
                    this.setUserAddress(null);
                }
                
            });
        },
        getInviteRecord() {
            getInvitationRecord({address: this.getUserAddress}).then(res => {
                
                let data = res.data.content;
                if(data){
                    this.inviteList = data.map(item => {
                        return {
                            address: item.faddress,
                            coin: item.rewardAmount
                        };
                    });
                }
                
            });
        },
        handleAddressClose() {
            this.showAddressDialog = false;
        },
        handleClose() {
            this.showEmailDialog = false;
        },
        submitInfo(info) {
            this.$toast.loading({
                duration: 5000,
                message: 'Submitting...',
                forbidClick: true,
                loadingType: 'spinner',
            });
            let params = {};
            if (this.paddress && this.paddress !== '') {
                params = {...info, pAddress: this.paddress};
            } else {
                params = info;
            }
            getAirDrop(params).then(res => {
                this.$toast.clear();
                this.$toast.success(this.$t('transmitText28'));
                this.showEmailDialog = false;
                this.showAddressDialog = false;
                res.data && res.data.content && this.setUserAddress(res.data.content);
                this.initPage();
            }).catch(() => {
            });
        },
        bindAddress(address) {
            this.address = address;
            this.showEmailDialog = true;
            // this.showAddressDialog = false;
        },
        openAddressDialog() {
            this.showAddressDialog = true;
        },
        backToHome() {
            this.$router.push('/');
        },
        initPage() {
            this.getInviteInfo();
            this.getInviteRecord();
        }
    },
    mounted() {
        this.paddress = this.$route.query.paddress;
        this.initPage();
        
    }
}
</script>
<style lang="stylus" scoped>
.transmit-wrap {
    position: relative;
    width: 100%;
    background: url(../assets/img/transmit-bg.png) no-repeat;
    background-size: 100% auto;
    padding: 612px 52px 194px;
    box-sizing: border-box;
    &.en {
        background-image: url(../assets/img/transmit-bg-en.png);
    }
    &.ja {
        background-image: url(../assets/img/transmit-bg-ja.png);
    }
    .lang-wrap {
        position: absolute;
        top: 40px;
        right: 40px;
        border-radius: 10px;
        background-color: #F5BF3F;
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
            background: url(../assets/img/footer-qiu-bai.png) no-repeat;
            background-size: contain;
        }
    }
    .telegram-warp{
        position: absolute;
        bottom: 10px;
        left: 30px;
        img{
            width:50px;
        }
    }
    .twitter-warp{
        position: absolute;
        bottom: 10px;
        left: 100px;
        img{
            width:50px;
        }
    }
    
    .group {
        // min-height: 1202px;
        background: #fff;
        padding: 24px 16px 50px;
        .outer {
            text-align: center;
            .title {
                display: inline-block;
                position: relative;
                font-size: 40px;
                font-weight: 600;
                padding: 0 40px;
                color: #EC6234;
                &::before, &::after {
                    position: absolute;
                    content: '';
                    top: 50%;
                    width: 100px;
                    height: 20px;
                    background: url(../assets/img/transmit-title-bg.png) no-repeat;
                    background-size: contain;
                    transform: translateY(-50%);
                }
                &::before {
                    right: 100%;
                }
                &::after {
                    left: 100%;
                    background-image: url(../assets/img/transmit-title-bg-1.png);
                }
            }
        }
        .show-user-address {
            padding-left: 0;
            font-size: 30px;
            font-weight: 500;
            text-align: center;
        }
        .bind-address-btn {
            width: 400px;
            height: 60px;
            line-height: 60px;
            border-radius: 30px;
            text-align: center;
            font-size: 24px;
            color: #fff;
            background-color: #EC6234;
            margin: 26px auto 54px;
        }
        .line {
            width: 100%;
            height: 0;
            border-top: 1px dashed #FF3E0E;
        }
        .tips-text {
            padding: 20px 24px 32px;
            font-size: 20px;
            font-weight: 500;
            color: #333;
        }
        .progress-wrap {
            width: 100%;
            height: 124px;
            box-sizing: border-box;
            position: relative;
            padding: 0 12px;
            .main-line {
                position: absolute;
                top: 24px;
                left: 0;
                right: 0;
                width: 100%;
                height: 20px;
                background-color: #FFBC5E;
                transition: all 0.3s linear;
                border-radius: 10px;
                .current {
                    width: 10%;
                    height: 100%
                    background-color: #EC6234;
                    border-radius: 10px;
                }
            }
            .progress-steps {
                position: absolute;
                padding: 0 76px;
                top: 0;
                left: 0;
                right: 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .item {
                    width: 90px;
                    text-align: center;
                    .box {
                        margin: 0 auto;
                        width: 70px;
                        height: 70px;
                        background-size: cover;
                        background-position: center;
                        
                        transition: all 0.3s linear;
                        
                    }
                    .box-active {
                        background: url(../assets/img/progress-box-bg.png) no-repeat;
                    }
                    .box-disable {
                        background: url(../assets/img/progress-box-bg-no.png) no-repeat;
                    }
                    .nums {
                        font-size: 20px;
                        font-weight: 500;
                        color: #333;
                        text-align: center;
                        // margin-top: 20px;
                    }
                }
            }
        }
        .invite-btn {
            width: 83.85%;
            height: 76px;
            line-height: 76px;
            border-radius: 38px;
            text-align: center;
            background: linear-gradient(180deg, #FFBC5E 0%, #FF5700 96%, #FF6900 100%);
            box-shadow: 0px 6px 14px 0px rgba(255, 157, 94, 0.62);
            color: #fff;
            font-size: 36px;
            margin: 40px auto 44px;
        }
        .my-invites {
            padding: 0 20px;
            .title {
                font-size: 36px;
                font-weight: 500;
                color: #333;
                margin-bottom: 20px;
            }
            .content {
                display: flex;
                width: 100%;
                background-color: #FDFBEF;
                padding: 20px;
                font-size: 36px;
                font-weight: 500;
                box-sizing: border-box;
                .con {
                    .num {
                        font-size: 48px;
                        font-weight: 500;
                        color: #636C77;
                    }
                    .bottom {
                        font-size: 24px;
                        color: #636C77;
                        margin-top: 20px;
                    }
                    &:last-child {
                        margin-left: 100px;
                    }
                    &:last-child .num {
                        color: #F79331;
                    }
                }
            }
        }
        .invite-list {
            margin-top: 40px;
            padding: 0 20px;
            .title {
                font-size: 36px;
                color: #333;
                font-weight: 500;
                margin-bottom: 20px;
            }
            .no-data {
                font-size: 30px;
                color: #666;
            }
            &>ul {
                max-height: 160px;
                overflow-y: auto;
            }
            &>ul>li {
                margin-bottom: 10px;
                line-height: 1.4;
            }
            .address {
                color: #636C77;
                font-size: 28px;
            }
            .balance {
                color: #F79331;
                font-size: 28px;
            }
        }
    }
    .back-to-home {
        position: absolute;
        bottom: 90px;
        left: 50%;
        transform: translateX(-50%);
        width: 290px;
        height: 64px;
        line-height: 64px;
        background: linear-gradient(180deg, #FFE07F 0%, #FF9510 100%);
        border-radius: 32px;
        text-align: center;
        font-size: 28px;
        color: #fff;
        font-weight: 600;
    }
}
</style>