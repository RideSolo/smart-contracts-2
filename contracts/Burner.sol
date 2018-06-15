pragma solidity ^0.4.24;

import "./mixins/ERC223Mixin.sol";
import "./mixins/ERC223Mixin.sol";
import "./mixins/ERC223ReceiverMixin.sol";


contract ERC223TokenBurner {
  function burn(uint256 _amount) public returns (bool);
}

contract Burner is ERC223ReceiverMixin {

  event Burn(address burner, uint256 amount, uint8 discount);

  uint64 public constant date01June2018 = 1527811200;
  uint64 public constant date31Dec2018 = 1546214400;
  uint64 public constant date31Dec2019 = 1577750400;
  uint64 public constant date31Dec2020 = 1609372800;
  uint64 public constant date31Dec2021 = 1640908800;
  uint64 public constant date31Dec2022 = 1672444800;

  uint64[] public dates = [date01June2018 
                           ,date31Dec2018 
                           ,date31Dec2019
                           ,date31Dec2020
                           ,date31Dec2021
                           ,date31Dec2022
                          ];

  uint8[] public discounts = [50, 75, 80, 90, 95];

  function tokenFallback(address _from, uint _value, bytes _data) public {
    require(now >= date01June2018);
    uint8 i = 0;
    while (i < dates.length && dates[i] > now)
      i++;
    uint8 discount = discounts[i];
    ERC223TokenBurner token = ERC223TokenBurner(msg.sender);
    require(token.burn(_value));
    Burn(_from, _value, discount);
  }
}
