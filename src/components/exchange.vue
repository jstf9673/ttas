<template>
  <!-- Exchange -->
  <div :class="['exchange', isPc ? 'block_pc': null]">
    <div class="wrap">
      <p class="title">{{$t('exchange')}}</p>
      <p class="info">{{$t('exchangeText1')}}</p>
      <div class="coin_change">
        <!-- From 输入框 -->
        <div class="change_box">
          <van-row type="flex" justify="space-between" class="box_title">
            <p>From</p>
            <p class="balance">Balance: {{ coinArr[0].balance }}</p>
          </van-row>
          <van-row type="flex" justify="end" class="coin-icon">
              <img :src="coinArr[0].img" alt class="coin_icon" />
          </van-row>
          <van-row type="flex" justify="space-between">
            <van-col span="12">
              <van-field
                v-model="coinArr[0].num"
                @input="changeCoinNum(0)"
                type="number"
                class="inp"
              />
            </van-col>
            <van-col class="box-bottom" span="12">
                <p class="max" @click="maxFn">MAX</p>
                <p class="coin_text">{{ coinArr[0].text }}</p>
            </van-col>
          </van-row>
        </div>
        <!-- change按钮 -->
        <img src="../assets/img/exchange@2x.png" alt class="change_icon" @click="changeCoin" />
        <!-- To 输入框 -->
        <div class="change_box">
          <van-row type="flex" justify="space-between" class="box_title">
            <p>To</p>
            <p class="balance">Balance: {{ coinArr[1].balance }}</p>
          </van-row>
          <van-row type="flex" justify="end" class="coin-icon">
              <img :src="coinArr[1].img" alt class="coin_icon" />
          </van-row>
          <van-row type="flex" justify="space-between">
            <van-col span="12">
              <van-field
                v-model="coinArr[1].num"
                @input="changeCoinNum(1)"
                type="number"
                class="inp"
              />
            </van-col>
            <van-col class="box-bottom" span="12">
                <p class="coin_text">{{ coinArr[1].text }}</p>
            </van-col>
          </van-row>
        </div>
      </div>
      <!-- exchange按钮 -->
      <div class="exchange_btn_one" v-if="isOne" @click="exchange">{{$t('echangeBtnText2')}}</div>
      <van-row type="flex" justify="space-between" v-else>
        <div class="exchange_btn_two" @click="approve">{{$t('echangeBtnText1')}}</div>
        <div class="exchange_btn_two" @click="exchange">{{$t('echangeBtnText2')}}</div>
      </van-row>
    </div>
  </div>
</template>
<script>
import * as math from 'mathjs';
// import Web3 from 'web3';
import UsdtContract from '@/assets/contracts/IERC20.json';
import OaContract from '@/assets/contracts/OAToken.json';
// import Clipboard from 'clipboard';
export default {
    props: {
        isPc: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            defaultAccount: 'Disconnect',
            web3: null,
            VALVE: '0.0',
            BALANCE: '0',
            BONUS: '0',
            TOTAL: 1000000000000000,
            MARKETCAP: 0,
            isOne: false, // 控制按钮
            coinArr: [
                
                {
                    img: "/images/usdt.png",
                    text: "USDT",
                    num: 0.0000,
                    balance:0
                },
                {
                    img: "/images/oa.png",
                    text: "OA",
                    num: 0.0000,
                    balance:0
                }
            ],
            blackAddress: '0x0000000000000000000000000000000000000000',
            inviteCode: this.$route.query.inviteCode,  // 邀请码
            usdtInfo:{
                address:'0x55d398326f99059fF775485246999027B3197955',
                decimal:18,
                contract:null,
                allowance:0
            },
            oaInfo:{
                address:'0x5b6e3447408C65D5118BFb86C75a49313a77e125',
                decimal:18,
                contract:null,
                allowance:0
            }
        };
    },
    methods: {
        /* 点击max把币种余额进行赋值 */ 
        maxFn() {
            this.coinArr[0].num = this.coinArr[0].balance;
            this.changeCoinNum(0);
        },
        formatNum(num, wei = 4) {
            return math.format(math.floor(Number(num), wei),{notation: 'fixed'});
        },
        desensitization(str, beginLen, endLen) {
            var firstStr = str.substr(0, beginLen);
            var lastStr = str.substr(endLen);
            var middleStr = '***';
            var tempStr = firstStr + middleStr + lastStr;
            return tempStr;
        },
        exchange() {
            this.$toast.loading({
                duration: 100000,
                message: 'Submitting...',
                forbidClick: true,
                loadingType: 'spinner',
            });
            var that = this;
            if (that.coinArr[0].num <= 0) {
                this.$toast.fail("Transaction amount must be greater than 0");
                return;
            }
            if (Number(that.coinArr[0].num) > Number(that.coinArr[0].balance)) {
                this.$toast.fail("Insufficient balance");
                return;
            }
            
            if (this.coinArr[0].text == 'USDT') {
                
                var amount = that.web3.utils.toWei(that.coinArr[0].num, 'ether');
                that.oaInfo.contract.methods.buyToken(amount,that.inviteCode).send({from:that.web3.eth.defaultAccount}).then(function() {
                    that.$toast.clear();
                    
                    that.$toast.success("Successful transaction");
                    that.getInit();
                    that.getBalance();
                });
            } else {
                this.$toast.fail("At the airdrop stage, sales are not yet open");
                return;
                // var amountT = that.web3.utils.toWei(that.coinArr[0].num, 'ether');
                // that.oaInfo.contract.methods.sellToken(amountT).send({from:that.web3.eth.defaultAccount}).then(function(hash) {
                //     that.$toast.clear();
                //     console.log("that.oaInfo.contract.methods.sellToken",hash)
                //     that.$toast.success("Successful transaction");
                //     that.getInit();
                //     that.getBalance();
                // });
            }
        },
        approve() {
            this.$toast.loading({
                duration: 100000,
                message: 'Submitting...',
                forbidClick: true,
                loadingType: 'spinner',
            });
            var that = this;
            var amount = "10000000";
            var amountWei = that.web3.utils.toWei(amount, 'ether');
            
            
            that.usdtInfo.contract.methods.approve(that.oaInfo.address,amountWei).send({from:that.web3.eth.defaultAccount}).then(function(){
                
                that.usdtInfo.allowance = amount;
                that.$toast.clear();
                that.$toast.success("Successful transaction");
                that.changeIsOne();
                
            });
        },
        getAllowance() {
            var that = this;
            that.usdtInfo.contract.methods.allowance(that.web3.eth.defaultAccount,this.oaInfo.address).call().then(function(r){
                that.usdtInfo.allowance = that.web3.utils.fromWei(r, 'ether');
                
                that.changeIsOne();
            });
        },
        getBalance() {
            var that = this;
            var oaBalance;
            that.oaInfo.contract.methods.balanceOf(that.web3.eth.defaultAccount).call().then(function(r){
                
                oaBalance = that.formatNum(that.web3.utils.fromWei(r, 'ether'), 4);
                if (that.coinArr[0].text === 'OA') {
                    that.coinArr[0].balance = oaBalance;
                } else {
                    that.coinArr[1].balance = oaBalance;
                }
            });
            var tokenBalance;
            that.usdtInfo.contract.methods.balanceOf(that.web3.eth.defaultAccount).call().then(function(r){
                
                tokenBalance = that.formatNum(that.web3.utils.fromWei(r, 'ether'),4);
                if (that.coinArr[0].text === 'OA') {
                    that.coinArr[1].balance = tokenBalance;
                } else {
                    that.coinArr[0].balance = tokenBalance;
                }
                that.BALANCE = tokenBalance;
            });
            if(that.coinArr[0].text == 'OA'){
                that.coinArr[0].balance = oaBalance;
                that.coinArr[1].balance = tokenBalance;
            }else{
                that.coinArr[1].balance = oaBalance;
                that.coinArr[0].balance = tokenBalance;
            }
        },
        changeIsOne() {
            var that = this;
            if (this.coinArr[0].text === 'USDT') {
                if (that.usdtInfo.allowance > 0) {
                    that.isOne = true;
                } else {
                    that.isOne = false;
                }
            } else {
                that.isOne = true;
            }
        },
        /* 转换对应币种 */
        changeCoin() {
            this.coinArr.reverse();
            this.changeIsOne();
            this.changeCoinNum(0);
        },
        changeCoinNum(i){
            var that = this;
            var curPrice = math.bignumber(that.VALVE);
            
            var text = this.coinArr[i].text;
            
            if (!this.coinArr[i].num || this.coinArr[i].num < 0) {
                return;
            }
            var num = math.bignumber(this.coinArr[i].num);
            var otherNum = 0;
            if (i === 0) {
                if (text === 'USDT') {
                    otherNum = math.divide(num, curPrice);
                } else {
                    otherNum = math.multiply(num, curPrice);
                }
                this.coinArr[1].num = that.formatNum(otherNum, 4);
            } else {
                if (text === 'USDT') {
                    otherNum = math.divide(num, curPrice);
                } else {
                    otherNum = math.multiply(num, curPrice);
                }
                this.coinArr[0].num = that.formatNum(otherNum, 4);
            }
        },
        /* 初始化获取数据 VALVE,HOLDERS,MARKETCAP,BONUS,inviteUrl */
        getInit() {
            var that = this;
            
            this.oaInfo.contract.methods.getTokenData(this.web3.eth.defaultAccount).call().then(function(r){
                
                // _result[0] = curPrice;
                // _result[1] = minPrice;
                // _result[2] = gShares;
                // _result[3] = balances[_owner];
                // _result[4] = shares[_owner];
                // _result[5] = balanceOf(_owner);
                // _result[6] = gBonus;
                // _result[7] = bonus[_owner];
                // _result[8] = bonusOf(_owner);
                // _result[9] = bonusBalances[_owner];
                that.VALVE = that.formatNum(that.web3.utils.fromWei(r[0], 'ether'),10);
                that.BALANCE = that.formatNum(that.web3.utils.fromWei(r[5], 'ether'),4);
                that.BONUS = that.formatNum(that.web3.utils.fromWei(r[8], 'ether'),4);
                
                that.MARKETCAP = that.formatNum(math.multiply(math.bignumber(that.VALVE), math.bignumber(that.TOTAL)));
                
                that.changeCoinNum(0);
            })
            
        },
        checkInviteCode() {
            let inviteCode = localStorage.getItem("inviteCode")
            
            if (!inviteCode || !this.web3.utils.isAddress(inviteCode)) {
                this.inviteCode = this.blackAddress;
            }else{
                 this.inviteCode = inviteCode;
            }
            
            
        },
        initUsdtContract(){
            var that = this;
            that.usdtInfo.contract = new that.web3.eth.Contract(UsdtContract.abi,that.usdtInfo.address);
            // that.usdtInfo.contract.methods.decimals().call(function(e,r){
            //   that.usdtInfo.decimal = r;
            // })
        },
        initTtasContract(){
            var that = this;
            that.oaInfo.contract = new that.web3.eth.Contract(OaContract.abi,that.oaInfo.address);
            // that.oaInfo.contract.methods.decimals().call(function(e,r){
            //   that.oaInfo.decimal = r;
            // })
        },
        initWeb3() {
            this.web3 = this.$web3;
        },
        async getWalletDefaultAccount(){
            var that = this;
            var address = null;
            if(that.web3){
                await that.web3.eth.getAccounts((error, accounts) => {
                    address = accounts[0];
                });
            }
            return address;
        },
    },
    mounted() {
        this.$toast.loading({
            duration: 5000,
            message: 'Launching...',
            forbidClick: true,
            loadingType: 'spinner',
        });
        this.MARKETCAP = this.formatNum(math.multiply(math.bignumber(this.VALVE), math.bignumber(this.TOTAL)));
        this.initWeb3();
        this.checkInviteCode();
        this.changeIsOne();

        this.getWalletDefaultAccount().then(result => { 
            if (result) {
                this.web3.eth.defaultAccount = result;
                this.inviteUrl += '?inviteCode='+this.web3.eth.defaultAccount
                this.defaultAccount = this.desensitization(result, 4, -4);
                // do sth.
                this.initUsdtContract();
                this.initTtasContract();
                this.getInit();
                this.getAllowance();
                this.getBalance();
                this.$toast.clear();
            }else {
                // do other sth.
            }
        });
    }
};
</script>
<style scoped lang="stylus">
.exchange {
    margin: 20% auto 0;
    width: 92%;
    height :80%;
    padding: 50px 40px 40px;
    box-sizing: border-box;
    box-shadow: 0px 15px 100px rgba(28, 31, 44, 0.08);
    background: #fff;
    border-radius: 60px;

    .wrap {
    }

    .title {
      font-size: 48px;
      font-weight: 600;
      color: #E96D4C;
      margin-bottom: 7px;
    }

    .info {
      font-size: 30px;
      font-weight: 400;
      color: #929399;
    }

    .coin_change {
      margin-top: 52px;

      .change_box {
          box-sizing: border-box;
          padding: 10px 30px 8px;
        margin 0 auto;
        padding-bottom: 10px;
        width:100%;
        background: #F7F8FA;
        border-radius: 30px;
        .max {
          margin-right: 23px;
          font-size: 30px;
          font-weight: 600;
          color: #FC8E7E;
          cursor pointer
        }
        .van-row {
        //   padding: 0 30px;
        }

        .coin_icon {
          width: 60px;
          height: 60px;
        }

        .coin_text {
          font-size: 30px;
          font-weight: 600;
          color: #BDC6FF;
        }

        .inp {
          padding: 0;
          font-size: 48px;
          font-weight: 600;
          color: #000;
          background: transparent;

          >>>.van-field__control {
            color: #000;
          }
        }
      }

      .box_title {
        padding: 0 !important;
        font-weight: 500;
        color: #333947;
        margin-bottom: 20px;
        & > p {
            font-size: 36px;
        }
        .balance {
          color: #B88449;
        }
      }
        .box-bottom {
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            &>p {
                &.max {
                    font-size: 30px;
                    color: #ED4752;
                }
                &.coin_text {
                    font-size: 30px;
                    color: #4A5267;
                }
            }
        }
      .change_icon {
        margin: 30px auto;
        display: flex;
        width: 50px;
        height: 50px;
      }
    }

    .exchange_btn_one {
      width: 100%;
      height: 80px;
      background-color: #FFB0B0;
      font-size: 36px;
      line-height: 80px;
      border-radius: 30px;
      color: #D6414B;
      font-weight: 600;
      text-align: center;
      margin-top: 60px;
    }

    .exchange_btn_two {
      width: 47.5%;
      height: 80px;
      margin-top: 60px;
      border-radius: 30px;
      background-color: #B1353D;
      font-size: 36px;
      line-height: 80px;
      color: #fff;
      font-weight: 600;
      text-align: center;
      &:last-child {
          background-color: #FFB0B0;
          color: #D6414B;
      }
    }
  }
</style>