<template>
  <div id="app">
    <div class="header" v-show="noNeedHead.indexOf($route.name) < 0">
      <Header />
    </div>
    <main>
      <router-view v-wechat-title="$route.meta.title" />
    </main>
    <div class="footer"  v-show="noNeedHead.indexOf($route.name) < 0">
      <Footer />
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import * as math from 'mathjs';
import UsdtContract from '@/assets/contracts/IERC20.json';
import OaContract from '@/assets/contracts/OAToken.json';
import Header from './components/header';
import Footer from './components/footer';
export default {
  data() {
    return {
      web3: null,
      isShowTab: false,
      active: 0,
      noNeedHead: ['transmit', 'kline'],
      // icon: {
      //   indexActive: require("./assets/index/index-active.png"),
      //   indexInactive: require("./assets/index/index-inactive.png"),
      //   myActive: require("./assets/index/my-active.png"),
      //   myInactive: require("./assets/index/my-inactive.png")
      // }
    };
  },
  computed: {
    ...mapGetters({
      MARKETCAP: 'getMARKETCAP',
      TOTAL: 'getTOTAL',
      VALVE: 'getVALUE',
      inviteCode: 'getInviteCode',
      blackAddress: 'getdefaultBlackAddress',
      oaInfo: 'getoaInfo',
      usdtInfo: 'getusdtInfo'
    })
  },
  components: {
    Footer, Header
  },
  methods: {
    ...mapMutations({
      setInviteCode: 'setInviteCode',
      setusdtInfo: 'setusdtInfo',
      setoaInfo: 'setoaInfo',
      setVALUE: 'setVALUE',
      setBALANCE: 'setBALANCE',
      setBONUS: 'setBONUS',
      setTOTAL: 'setTOTAL',
      setMARKETCAP: 'setMARKETCAP',
      setDefaultAccount: 'setDefaultAccount',
      setUserAddress: 'setUserAddress'
    }),
    resizeRem() {
      let doEle = document.documentElement;
      let width = doEle.getBoundingClientRect().width;
      if (width > 750) {
        doEle.style.fontSize = '37.5px';
      }
    },
    initWeb3() {
        this.web3 = this.$web3;
    },
    checkInviteCode() {
      let inviteCode = undefined;
      if (!this.$route.query.inviteCode || this.$route.query.inviteCode == '') {
          inviteCode = this.blackAddress;
      }
      if (this.web3 && !this.web3.utils.isAddress(this.inviteCode)) {
          inviteCode = this.blackAddress;
      }
      // 设置inviteCode，存进全局变量
      this.setInviteCode(inviteCode);
    },
    initUsdtContract() {
        let contract = new this.web3.eth.Contract(UsdtContract.abi,this.usdtInfo.address);
        this.setusdtInfo({
          ...this.usdtInfo,
          contract
        });
    },
    initTtasContract() {
        let contract = new this.web3.eth.Contract(OaContract.abi,this.oaInfo.address);
        this.setoaInfo({
          ...this.oaInfo,
          contract
        });
    },
    async getWalletDefaultAccount() {
        var address = null;
        if(this.web3){
            await this.web3.eth.getAccounts((error, accounts) => {
                address = accounts[0];
            });
        }
        return address;
    },
    formatNum(num, wei = 4) {
        return math.format(math.floor(Number(num), wei),{notation: 'fixed'});
    },
    getInit() {
        var that = this;
        

        this.oaInfo.contract.methods.getTokenData(this.web3.eth.defaultAccount).call().then(function(r){
            
            let VALVE = that.formatNum(that.web3.utils.fromWei(r[0], 'ether'),10);
            let BALANCE = that.formatNum(that.web3.utils.fromWei(r[5], 'ether'),4);
            let BONUS = that.formatNum(that.web3.utils.fromWei(r[8], 'ether'),4);
            
            let MARKETCAP = that.formatNum(math.multiply(math.bignumber(that.VALVE), math.bignumber(that.TOTAL)));
            
            // that.changeCoinNum(0);
            that.setVALUE(VALVE);
            that.setBALANCE(BALANCE);
            that.setBONUS(BONUS);
            that.setMARKETCAP(MARKETCAP);
        })
    },
    initData() {
      let that = this;
      that.$toast.loading({
          duration: 1000,
          message: 'Launching...',
          forbidClick: true,
          loadingType: 'spinner',
      });
      
      let MARKETCAP = this.formatNum(math.multiply(math.bignumber(this.VALVE), math.bignumber(this.TOTAL)));
      that.setMARKETCAP(MARKETCAP);
      that.initWeb3();
      that.checkInviteCode();
      if (!that.web3) {
        return;
      }
      that.getWalletDefaultAccount().then(result => { 
          if (result) {
              that.web3.eth.defaultAccount = result;
              // this.defaultAccount = this.desensitization(result, 4, -4);
              
              that.setDefaultAccount(result);
              // do sth.
              that.initUsdtContract();
              that.initTtasContract();
              that.getInit();
              // this.getAllowance();
              // this.getBalance();
              that.$toast.clear();
          }else {
              // do other sth.
          }
      });
    }
  },
  mounted() {
    this.resizeRem();
    window.addEventListener('resize', this.resizeRem);
    window.addEventListener('pageshow', this.resizeRem);
    this.initWeb3();
    this.setUserAddress(this.web3.eth.defaultAccount)
    // 初始化
    // this.initData();
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeRem);
    window.removeEventListener('pageshow', this.resizeRem);
  }
};
</script>
<style lang="stylus">
// @font-face
//   font-family: "SourceHanSansCN-Regular";
//   src: url("./assets/font/SourceHanSansCN-Regular.otf");
// p, span
//   font-family: 'SourceHanSansCN-Regular' !important;
p
  margin: 0;
body
  /*background: #F9F9F9;*/
  /*padding-bottom: 50px;*/
</style>
