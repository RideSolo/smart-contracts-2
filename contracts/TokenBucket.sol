pragma solidity ^0.4.24;
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./mixins/RBACMixin.sol";

interface IMintableToken {
  function mint(address _to, uint256 _amount) external returns (bool);
}

contract TokenBucket is RBACMixin {
  using SafeMath for uint;
  uint public size;
  uint public rate;
  uint public lastMintTime;
  uint public leftOnLastMint;

  IMintableToken public token;

  event Leak(address indexed beneficiar, uint left);

  constructor (address _token, uint _size, uint _rate) public {
    token = IMintableToken(_token);
    size = _size;
    rate = _rate;
  }

  function setSize(uint _size) public returns (bool) {
    size = _size;
  }

  function setRate(uint _rate) public returns (bool) {
    rate = _rate;
  }

  function setSizeAndRate(uint _size, uint _rate) public returns (bool) {
    return setSize(_size) && setRate(_rate);
  }

  function mint(address _beneficiar, uint _amount) public returns (bool) {
    uint available = availableForMint();
    require(_amount <= available);
    leftOnLastMint = available.sub(_amount);
    lastMintTime = now; // solium-disable-line security/no-block-members
    require(token.mint(_beneficiar, _amount));
    return true;
  }

  function availableForMint() public view returns (uint) {
     // solium-disable-next-line security/no-block-members
    uint timeAfterMint = now - lastMintTime;
    uint availableRate = rate.mul(timeAfterMint).add(leftOnLastMint);
    return size < availableRate ? size : availableRate;
  }
}