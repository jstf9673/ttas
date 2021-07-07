var Web3 = require('web3');
var fs = require('fs')
 
// 连接私有链
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
 
 
var abi = JSON.parse(fs.readFileSync("./build/contracts/HRC20HUSD.json"));
 
var address = '0x6c971180934E05362fd416277d45B6d7639b37f2';  // 合约地址
 

var info = new web3.eth.Contract(abi.abi,address);
console.log(address)
info.methods.balanceOf("0x69Ee725505752d80D8A2b2b871d81f9F5E722f87").call( 
    function(error, result) {
        console.log(error);
        console.log(result);
        if(!error) {
            console.log(result);
        } else {
            console.error(error);
        }
    });
 
 
