pragma solidity ^0.4.24;


contract RBACMixin {
  uint8 constant public ALL_ROLES     = 0xFF;
  uint8 constant public ADMIN_ROLE    = 1 << 0;
  uint8 constant public MINTER_ROLE   = 1 << 1;

  /// @dev uint8 could collect up to 8 roles
  mapping (address => uint8) public roles;

  constructor () public {
    roles[msg.sender] = ALL_ROLES;
    updateRole(msg.sender, ALL_ROLES);
  }

  modifier needRole(address _who, uint8 _role) {
    require(hasRoles(_who, _role));
    _;
  }

  function updateRole(address _who, uint8 _roles) public needRole(msg.sender, ADMIN_ROLE) returns(bool) {
    roles[_who] = _roles;
  }

  function hasRoles(address _who, uint8 _role) public view returns(bool) {
    return roles[_who] & _role == _role;
  }
}