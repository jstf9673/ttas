// const Migrations = artifacts.require("Migrations");
const HRC20HUSD = artifacts.require("HRC20HUSD");
const OAToken = artifacts.require("OAToken");
module.exports = function (deployer) {
  var arr = ['0xd998279Bc062052c8190d32738b77D5dA125439C'];
  
  deployer.deploy(OAToken,'0x55d398326f99059fF775485246999027B3197955',arr);
  // deployer.deploy(HRC20HUSD,'USDT','USDT').then(function() {
  //   return deployer.deploy(OAToken,HRC20HUSD.address,arr);
  // });
  
};
//bsctestnet
//usdt:0xB4a0AA561193eF0F16f49Da7767E2f8623837AdC
//oatoken:0x8b51400910316d425A671233ccC9E86d7710Ef18,0xCbd00c8A352CA5E9a19AE2Eec95087808bc91D66,0x745BdDF14355f5cBDBc16141d6CC63B1f46e61ae

//mac-ganache
//oatoken:0x667784C3B33D466502Feeac48903F7BEFC3E8542