pragma solidity 0.5.0;

import "truffle/Assert.sol";

import "../contracts/HRC20HUSD.sol";
// import "../contracts/TTAS.sol";

contract TestMetacoin {
    uint256 public decimals = 18;
    uint256 private coinUnit = 10 ** decimals;
    uint256 private curPrice= 10000000000;
    function testInitialBalanceUsingDeployedContract() public {
        uint256 allowAmount = 1000 * coinUnit;
        address uAddr = 0x6c971180934E05362fd416277d45B6d7639b37f2;
        address reciveAddr = 0x2CDf51F98E224a15e61880cA680e7dfe6edC9863;
        // address aAddr = 0x5d9f08eE8cf02B8b88432Ab3bFfDD9932b186eb6;
        // address pAddr = 0x2CDf51F98E224a15e61880cA680e7dfe6edC9863;
        HRC20HUSD usdt = HRC20HUSD(uAddr);
        // TTAS ttas = TTAS(aAddr);
        // usdt.approve(tAddr,allowAmount);
        usdt.transfer(reciveAddr,100*coinUnit);
        // ttas.buyToken(allowAmount,pAddr);
    }


}