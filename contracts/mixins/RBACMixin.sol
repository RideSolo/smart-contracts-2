pragma solidity ^0.4.24;
// pragma experimental ABIEncoderV2;


contract RBACMixin {
  string constant FORBIDDEN = "Haven't enough right to access";
  
  uint8 constant public STRANGER_ROLE = 0;
  uint8 constant public ALL_ROLES     = 0xFF;
  uint8 constant public ADMIN_ROLE    = 1 << 0;
  uint8 constant public MINTER_ROLE   = 1 << 1;

  /// @dev uint8 could collect up to 8 roles
  mapping (address => uint8) public roles;

  event SetRole(address indexed _who, uint8 indexed _roles);

  constructor () public {
    roles[msg.sender] = ALL_ROLES;
    updateRole(msg.sender, ALL_ROLES);
  }

  modifier needRole(address _who, uint8 _role) {
    require(hasRoles(_who, _role), FORBIDDEN);
    _;
  }

  function updateRole(address _who, uint8 _roles) public needRole(msg.sender, ADMIN_ROLE) returns(bool) {
    roles[_who] = _roles;
    emit SetRole(_who, _roles);
    return true;
  }

  function hasRoles(address _who, uint8 _role) public view returns(bool) {
    return roles[_who] & _role == _role;
  }
}