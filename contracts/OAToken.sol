// SPDX-License-Identifier: SimPL-2.0
//"m1.1.0releasing";
pragma solidity ^0.5.0;
//pragma experimental ABIEncoderV2;


interface IBEP20 {
  function totalSupply() external view returns (uint256);
  function decimals() external view returns (uint8);
  function symbol() external view returns (string memory);
  function name() external view returns (string memory);
  function getOwner() external view returns (address);
  function balanceOf(address account) external view returns (uint256);
  function transfer(address recipient, uint256 amount) external returns (bool);
  function allowance(address _owner, address spender) external view returns (uint256);
  function approve(address spender, uint256 amount) external returns (bool);
  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a);
        uint256 c = a - b;
        return c;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a);
        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        require(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0);
        uint256 c = a / b;
        return c;
    }
}

contract OAToken {
    using SafeMath for uint256;
    struct Parent{
        address parentAddr;
        bool isUsed;
    }
    
    string public constant name = "Ολυμπιακοί Αγώνες Token";
    string public constant symbol = "OA";
    uint256 public constant decimals = 18;
    uint256 private constant coinUnit = 10 ** decimals;
    uint256 public constant totalSupply = 200000000 * coinUnit;
    uint256 private constant stopgBonus = 180000000 * coinUnit;
    uint256 private constant contactBalance = 75000000 * coinUnit;
    uint256 private constant bonusTotalSupply = 20000000 * coinUnit;
    uint256 private constant INVI_AWARD_REQ_BALANCE = 100 * coinUnit;
    uint256 private constant MAX_AMOUNT = 5000 * coinUnit;
    
    address private ownerAddress;
    uint256 private gShares;
    uint256 private curPrice;
    uint256 private minPrice;
    uint256 private gBonus;

    mapping(address => uint256) balances;
    mapping(address => uint256) shares;
    mapping(address => uint256) bonusBalances;
    mapping(address => uint256) bonus;
    mapping(address => uint256) bonusTotal;
    mapping(address => uint256) lightBalances;

    mapping (address => Parent) internal bonusBlackAddressMap;
    address[] internal bonusBlackAddressList;
    mapping (address => mapping (address => uint256)) internal allowed;
    mapping(address => Parent) public parents;


    mapping(address => address[]) private lightAddress;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed from, address indexed spender, uint256 value);
    event changePrice(uint256 price);

    address private uAddr;
    address private blackAccount = address(0);

    constructor(address  _uAddr,address [] memory  _defTokens) public {
        uAddr = _uAddr;
        ownerAddress = msg.sender;
        uint256 amount = totalSupply.div(2);
        balances[blackAccount] = amount;
        emit Transfer(address(0), blackAccount, amount);
        
        
        balances[address(this)] = contactBalance;
        emit Transfer(address(0), address(this), contactBalance);

        amount = 5000000*coinUnit;
        balances[ownerAddress] = amount;
        emit Transfer(address(0), ownerAddress, amount);

        bonusBlackAddressMap[ownerAddress].isUsed = true;
        bonusBlackAddressMap[blackAccount].isUsed = true;
        bonusBlackAddressMap[address(this)].isUsed = true;
        
        bonusBlackAddressList.push(ownerAddress);
        bonusBlackAddressList.push(blackAccount);
        bonusBlackAddressList.push(address(this));
        
        amount = totalSupply.div(10).div(_defTokens.length);
        for (uint256 index = 0; index < _defTokens.length; index++) {
            address ad = _defTokens[index];
            balances[ad] = balances[ad].add(amount);
            emit Transfer(address(0), ad, amount);
            if(!bonusBlackAddressMap[ad].isUsed){
                bonusBlackAddressMap[ad].isUsed = true;
                bonusBlackAddressList.push(ad);
            }
            
        }
        
        

        curPrice = 10000000000000000;
        minPrice = 10000000000000000;
    }

    function() external payable {
        revert();
    }

    function sendReward(address [] memory  _rewardAddress,uint256 [] memory  _rewardAmount)  public onlyOwner {
        require(_rewardAddress.length == _rewardAmount.length, "OACoin: _rewardAddress.length != _rewardAmount.length");
        for (uint256 index = 0; index < _rewardAddress.length; index++) {
            address ad = _rewardAddress[index];
            uint256 reward =  _rewardAmount[index];
            transfer(ad, reward);
        }
    }

    function buyToken(uint256 amountU,address _parent) public {
        require(amountU <= MAX_AMOUNT, "OACoin: Transaction amount cannot exceed 5000 $");
        IBEP20(uAddr).transferFrom(msg.sender, address(this), amountU);
        //2.0
        _parentRewardAndBonus(msg.sender,_parent,amountU);

        uint256 _price = curPrice;
        uint256 increase = minPrice.mul(amountU).div(10000*coinUnit);
        curPrice = _price.add(increase);
        emit changePrice(curPrice);
        uint256 amountT = amountU.mul(coinUnit).div(_price);
        transferFromThis(msg.sender, amountT);
    }

    function sellToken(uint256 amountT) public {
        uint256 lastPrice = curPrice;
        transfer(address(this), amountT);
        uint256 amountU = amountT.mul(curPrice).div(coinUnit);
        require(amountU <= MAX_AMOUNT, "OACoin: Transaction amount cannot exceed 5000 $");
        uint256 decrease = minPrice.mul(amountU).div(10000*coinUnit);
        if (curPrice > decrease) {
            curPrice = curPrice.sub(decrease);
            if(curPrice < minPrice) {
                curPrice = minPrice;
            } 
        } else {
            curPrice = minPrice;
        }
        if(lastPrice != curPrice){
            emit changePrice(curPrice);
        }
        //2.0
        IBEP20(uAddr).transfer(msg.sender, amountU.mul(9).div(10));
    }

    function _parentRewardAndBonus(address _owner,address _parent,uint256 amountU) internal {
        if(balanceOf(address(0)) >= stopgBonus){
            return;
        }
        if(_owner == _parent){
            _parent = address(0);
        }
        if(!isExistEntry(_owner)){
            parents[_owner].parentAddr = _parent;
            parents[_owner].isUsed = true;
            if(!bonusBlackAddressMap[_parent].isUsed){
                lightAddress[_parent].push(_owner);
            }
        }
        _parent = parents[_owner].parentAddr;
        //2.REFRECE
        if(!bonusBlackAddressMap[_parent].isUsed){
            uint256 parentTokenBalance = balanceOf(_parent);
            if(parentTokenBalance.mul(curPrice) >= INVI_AWARD_REQ_BALANCE){
                uint256 parentRewardUsdt = amountU.mul(4).div(100);
                lightBalances[parents[_owner].parentAddr] = lightBalances[parents[_owner].parentAddr].add(parentRewardUsdt);
            }
        }
        if(!bonusBlackAddressMap[_owner].isUsed){
            //3.bonus
            bonusBalances[_owner] = bonusOf(_owner);
            bonus[_owner] = gBonus;
            
            gBonus = gBonus.add(amountU.mul(2).div(100));
            
        }
    }

    function isExistEntry(address _addr) public view returns(bool){
        return parents[_addr].isUsed;
    }
    
    function isExistBlackAddress(address _addr) public view returns(bool){
        return bonusBlackAddressMap[_addr].isUsed;
    }




    function updateShares(address _sender) internal {
        if (shares[_sender] == gShares) {
            return;
        }
        uint256 totalAmount = totalSupply;
        if(balanceOf(address(0)) >= stopgBonus){
            if(address(0) == _sender){
                return;
            }
            totalAmount = bonusTotalSupply;
        }
        uint256 amount = balances[_sender];
        balances[_sender] = amount.add(gShares.sub(shares[_sender]).mul(amount).div(totalAmount));
        shares[_sender] = gShares;
    }

    function getTokenData(address _owner) external view returns (uint256[] memory) {
        uint256[] memory _result = new uint256[](10);
        _result[0] = curPrice;
        _result[1] = minPrice;
        _result[2] = gShares;
        _result[3] = balances[_owner];
        _result[4] = shares[_owner];
        _result[5] = balanceOf(_owner);
        _result[6] = gBonus;
        _result[7] = bonus[_owner];
        _result[8] = bonusOf(_owner);
        _result[9] = bonusBalances[_owner];
        return _result;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        uint256 amount = balances[_owner];
        uint256 totalAmount = totalSupply;
        uint256 blackBalance = balances[address(0)];
        blackBalance = blackBalance.add(gShares.sub(shares[address(0)]).mul(blackBalance).div(totalAmount));
        if(blackBalance >= stopgBonus){
            totalAmount = bonusTotalSupply;
            if(address(0) != _owner){
                return amount;
            }
        }
        amount = amount.add(gShares.sub(shares[_owner]).mul(amount).div(totalAmount));
        return amount;
    }



    function bonusBlackBalance() public view returns (uint256 balance) {
        for (uint256 index = 0; index < bonusBlackAddressList.length; index++) {
           balance =  balance.add(balanceOf(bonusBlackAddressList[index]));
        }
        return balance;
    }



    modifier onlyOwner() {
        require(isOwner(), "Ownable: caller is not the owner");
        _;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == ownerAddress;
    }

    function bonusOf(address _owner) public view returns (uint256 bonusOfBalance) {
        if(isExistBlackAddress(msg.sender)){
            bonusOfBalance = 0;
        }else if(bonusBlackBalance() >= totalSupply){
            bonusOfBalance = 0;
        }else{
            bonusOfBalance = gBonus.sub(bonus[_owner]).mul(balanceOf(_owner)).div(totalSupply.sub(bonusBlackBalance()));
            bonusOfBalance = bonusBalances[_owner].add(bonusOfBalance);
        }
        bonusOfBalance = lightBalances[_owner].add(bonusOfBalance);
        return bonusOfBalance;
    }


    function bonusGet() public returns (bool) {
        uint256 bonusBalance = bonusOf(msg.sender);
        require(bonusBalance > 0,"Bonus: Insufficient bonusBalance");
        IBEP20(uAddr).transfer(msg.sender, bonusBalance);
        bonus[msg.sender] = gBonus;
        bonusBalances[msg.sender] = 0;
        bonusTotal[msg.sender] = bonusTotal[msg.sender].add(bonusBalance);
        lightBalances[msg.sender] = 0;
        return true;
    }

    function lightInfo(address _owner) public view returns (uint256 lightSize,uint256 lightTotal,uint256 lightReceive) {
        lightSize = lightAddress[_owner].length;
        lightTotal = bonusTotal[_owner];
        lightReceive = bonusOf(_owner);
        return (lightSize,lightTotal,lightReceive);
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0));
        updateShares(msg.sender);
        require(_value <= balances[msg.sender]);
        uint256 amountU = _value.mul(curPrice).div(coinUnit);
        _parentRewardAndBonus(msg.sender,address(this),amountU);

        balances[msg.sender] = balances[msg.sender].sub(_value);
        if(msg.sender != ownerAddress){
            uint256 _valueDvd = _value.div(10);
            gShares = gShares.add(_valueDvd);
            _value = _value.sub(_valueDvd);
        }
        
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFromThis(address _to, uint256 _value) internal returns (bool) {
        require(_to != address(0));
        updateShares(address(this));
        require(_value <= balances[address(this)]);

        balances[address(this)] = balances[address(this)].sub(_value);
        uint256 _valueDvd = _value.div(10);
        gShares = gShares.add(_valueDvd);
        _value = _value.sub(_valueDvd);        
        balances[_to] = balances[_to].add(_value);
        emit Transfer(address(this), _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowed[_owner][_spender];
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(_to != address(0));
        updateShares(_from);
        require(_value <= balances[_from]);
        require(_value <= allowed[_from][msg.sender]);
        _parentRewardAndBonus(_from,_to,_value.mul(curPrice).div(coinUnit));
        balances[_from] = balances[_from].sub(_value);
        uint256 _valueDvd = _value.div(10);
        gShares = gShares.add(_valueDvd);
        _value = _value.sub(_valueDvd);
        balances[_to] = balances[_to].add(_value);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        emit Transfer(_from, _to, _value);
        return true;
    }
}
