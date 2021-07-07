<template>
    <div class="email-wrap">
        <div class="close" @click="closeEmailWrap"></div>
        <div class="title">{{$t('transmitText14')}}</div>
        <div class="form-wrap">
            <div class="form-item label">
                <div class="form-label">{{$t('transmitText15')}}</div>
                <input type="text" @change="getImgCode" v-model="form.email">
            </div>
            <div class="form-item">
                <input class="input" type="text" v-model="form.imgCode" :placeholder="$t('transmitText16')">
                <div class="img-code" @click="getImgCode" :style="{'background-image': `url(${imgCode})`}"></div>
            </div>
            <div class="form-item">
                <input class="input" type="text" v-model="form.captchaCode" :placeholder="$t('transmitText17')">
                <div class="btn" @click="commitCode">{{$t('transmitText18')}}</div>
            </div>
            <div class="form-item check">
                <div class="check" :class="{'no-check': !checkable}" @click="toggleCheck">
                    <span class="check-box"></span>
                    {{$t('transmitText19')}}
                </div>
            </div>
            <div class="submit-btn" @click="submit">{{$t('transmitText20')}}</div>
        </div>
    </div>
</template>
<script>
import {baseURL} from '@/request/baseConfig';
import {getEmailValiCode} from '@/api/api';
const emailReg = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
export default {
    props: {
        address: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            showEmailDialog: false,
            checkable: false,
            randomNum: 0,
            loading: false,
            email:'oa@oa.com',
            form: {
                email: '',
                imgCode: '',
                captchaCode: ''
            }
        };
    },
    computed: {
        imgCode() {
            return baseURL + `/users/word.jpg?email=${this.email}&width=130&height=110&random=${this.randomNum}`;
        }
    },
    methods: {
        toggleCheck() {
            this.checkable = !this.checkable;
        },
        closeEmailWrap() {
            this.$emit('handleClose');
        },
        commitCode() {
            let {email, imgCode} = this.form;
            if (!email || email === '') {
                this.$toast.fail(this.$t('transmitText22'));
                return;
            }
            if (!emailReg.test(email)) {
                this.$toast.fail(this.$t('transmitText23'));
                return;
            }
            this.$toast.loading({
                duration: 5000,
                message: 'Sending...',
                forbidClick: true,
                loadingType: 'spinner',
            });
            getEmailValiCode({email: email, captchaImgCode: imgCode}).then(() => {
                
                this.$toast.clear();
                this.$toast.success(this.$t('transmitText27'));
            });
        },
        submit() {
            let {captchaCode, imgCode} = this.form;
            if (!captchaCode || captchaCode === '') {
                this.$toast.fail(this.$t('transmitText24'));
                return;
            }
            if (!imgCode || imgCode === '') {
                this.$toast.fail(this.$t('transmitText25'));
                return;
            }
            if (!this.checkable) {
                this.$toast.fail(this.$t('transmitText29'));
                return;
            }
            this.$emit('submitInfo', {...this.form, address: this.address});
        },
        getImgCode() {
            if(this.form.email){
                this.email = this.form.email;
            }
            this.randomNum = Math.random() * 100000;
        }
    },
    mounted() {}
}
</script>
<style lang="stylus" scoped>
.email-wrap {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    box-sizing: border-box;
    padding: 70px 40px 98px;
    .close {
        position: absolute;
        width: 30px;
        height: 30px;
        top: 20px;
        right: 20px;
        background: url(../assets/img/close-icon.png) no-repeat;
        background-size: cover;
    }
    .title {
        width: 480px;
        font-size: 48px;
        color: #333;
        line-height: 1.3;
        margin-bottom: 26px;
    }
    .form-wrap {
        width: 100%;
        .form-item {
            display: flex;
            height: 80px;
            line-height: 80px;
            position: relative;
            box-sizing: border-box;
            margin-bottom: 40px;
            padding-right: 120px;
            &.label {
                width: 100%;
                border: 2px solid #4A5267;
                background-color: #F7F8F9;
                padding-left: 160px;
                padding-right: 0;
                .form-label {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 30px;
                    line-height: 80px;
                    font-size: 24px;
                    color: #000;
                }
                input {
                    width: 100%;
                    border: none;
                    outline: none;
                    padding: 0 0 0 20px;
                    height: 100%;
                    // margin-top: 10px;
                    font-size: 24px;
                    box-sizing: border-box;
                    background-color: transparent;
                }
            }
            .input {
                font-size: 24px;
                width: 100%;
                border: 2px solid #4A5267;
                padding-left: 20px;
                border-radius: 0;
                outline: none;
                &:focus {
                    outline: none;
                    box-shadow: none;
                }
            }
            .img-code {
                position: absolute;
                right: 0;
                top: 0;
                width: 120px;
                height: 100%;
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
            }
            .btn {
                position: absolute;
                right: 0;
                top: 0;
                width: 120px;
                height: 100%;
                font-size: 36px;
                text-align: center;
            }
            .check {
                display: flex;
                align-items: center;
                font-size: 20px;
                color: #000;
                line-height: 1.3;
                &.no-check {
                    opacity: 0.5;
                    .check-box {
                        background-image: url(../assets/img/unchecked.png);
                    }
                }
                .check-box {
                    display: inline-block;
                    width: 24px;
                    height: 24px;
                    margin-right: 3px;
                    background-image: url(../assets/img/checked.png);
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                }
            }
            &.check {
                padding-right: 0;
            }
        }
        .submit-btn {
            width: 86.6%;
            height: 80px;
            line-height: 80px;
            background-color: #B1353D;
            text-align: center;
            color: #fff;
            margin: 44px auto 0;
            font-size: 36px;
            cursor: pointer;
        }
    }
}
@media screen and (min-width: 750px) {
    .email-wrap {
        left: 50%;
        transform: translateX(-50%);
    }
    .email-wrap .form-wrap .submit-btn {
        margin-left: 0;
        width: 100%;
    }
}
</style>