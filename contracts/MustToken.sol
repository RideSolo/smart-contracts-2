pragma solidity ^0.4.24;
import "./mixins/RBACMixin.sol";
import "./mixins/RBACMintableTokenMixin.sol";
import "./mixins/RBACERC223TokenFinalization.sol";
import "./mixins/CappedMintableTokenMixin.sol";
import "zeppelin-solidity/contracts/token/ERC20/StandardBurnableToken.sol";


contract MustToken is StandardBurnableToken, CappedMintableTokenMixin, RBACERC223TokenFinalization, RBACMintableTokenMixin {
  // solium-disable-next-line uppercase
  string constant public name = "Main Universal Standard of Tokenization"; 
  string constant public symbol = "MUST"; // solium-disable-line uppercase
  string constant public ticker = symbol; // solium-disable-line uppercase
  uint constant public decimals = 8; // solium-disable-line uppercase

  function hardcap() public pure returns(uint) {
    // 5KK with 8 decimals
    return 5 * (10 ** 6) * (10 ** 8);
  }

  function saneIt() public returns (bool) {
    require(super.saneIt());
    mintingFinished = true;
    emit MintFinished();
    return true;
  }
}