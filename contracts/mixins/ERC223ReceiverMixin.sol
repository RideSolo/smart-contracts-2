pragma solidity ^0.4.24;


contract ERC223ReceiverMixin {
  function tokenFallback(address _from, uint _value, bytes _data) public;
}