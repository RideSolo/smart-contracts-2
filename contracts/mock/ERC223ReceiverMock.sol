pragma solidity ^0.4.24;
import "../mixins/ERC223ReceiverMixin.sol";


contract ERC223ReceiverMock is ERC223ReceiverMixin {
  event Fallback(address indexed _from, uint _value, bytes _data);

  function tokenFallback(address _from, uint _value, bytes _data) public {
    emit Fallback(_from, _value, _data);
  }
}