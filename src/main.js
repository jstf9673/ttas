import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import Vant from "vant";
import clipboard from 'clipboard';
import i18n from '@/i18n/i18n';
import "vant/lib/index.css";
import "vant/lib/icon/local.css";
import './assets/css/index.css';
import VueWechatTitle from "vue-wechat-title";
import Web3 from 'web3';
// import {initWeb3} from '@/constant';
// rem h5 适配
import "amfe-flexible/index.js";
import UsdtContract from '@/assets/contracts/IERC20.json';
import OaContract from '@/assets/contracts/OAToken.json';
import * as math from 'mathjs';
Vue.use(Vant);
Vue.use(VueWechatTitle);
Vue.prototype.$18n = i18n;
Vue.config.productionTip = false;
Vue.prototype.clipboard = clipboard;

function formatNum(num, wei = 4) {
  return math.format(math.floor(Number(num), wei),{notation: 'fixed'});
}

var web3;
if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  // 请求用户授权
  window.ethereum.enable();
} else if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
}else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("https://http-mainnet.hecochain.com"));
}
async function getWalletDefaultAccount() {
  var address = null;
  await web3.eth.getAccounts((error, accounts) => {
    address = accounts[0];
  });
  return address;
}

let isMounted = false;


getWalletDefaultAccount().then(result => { 
  if (result) {
      web3.eth.defaultAccount = result;
      // this.defaultAccount = this.desensitization(result, 4, -4);
      let usdtInfo = {
        address: '0x55d398326f99059fF775485246999027B3197955',
        decimal: 18,
        contract: null,
        allowance: 0
      };
      usdtInfo.contract = new web3.eth.Contract(UsdtContract.abi,usdtInfo.address);
      web3.usdtInfo = usdtInfo;
      let oaInfo = {
          address: '0x5b6e3447408C65D5118BFb86C75a49313a77e125',
          decimal: 18,
          contract: null,
          allowance: 0
      };
      oaInfo.TOTAL = 200000000;
      web3.oaInfo = oaInfo;
      oaInfo.contract = new web3.eth.Contract(OaContract.abi,oaInfo.address);
      oaInfo.contract.methods.getTokenData(web3.eth.defaultAccount).call().then(function(r){
        
        oaInfo.VALUE = formatNum(web3.utils.fromWei(r[0], 'ether'),10);
        oaInfo.BALANCE = formatNum(web3.utils.fromWei(r[5], 'ether'),4);
        oaInfo.BONUS = formatNum(web3.utils.fromWei(r[8], 'ether'),4);
        oaInfo.MARKETCAP = formatNum(math.multiply(math.bignumber(oaInfo.VALUE), math.bignumber(oaInfo.TOTAL)));
        
        mount();
    })
  }else {
      // do other sth.
      mount();
  }
});

setTimeout(()=>{
  mount();
},3000);
function mount(){
  if(!isMounted){
    isMounted = true;
    Vue.prototype.$web3 = web3;
    new Vue({
      router,
      store,
      i18n,
      render: h => h(App)
    }).$mount("#app");
    
  }
}





