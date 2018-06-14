pragma solidity ^0.4.23;
import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";


contract CappedMintableTokenMixin is MintableToken {
  function hardcap() public pure returns(uint);

  function mint(
    address _to,
    uint256 _amount
  )
    public
    returns (bool) 
  {
    require(totalSupply().add(_amount) <= hardcap());
    return super.mint(_to, _amount);
  }
}