const RBACMixin = artifacts.require("RBACMixin.sol");

contract("RBAC Mixin", ([owner, stranger, another]) => {
  describe("RBAC", () => {
    it("should wait 1 second", async () => {
      const instance = await RBACMixin.new();
      const role = await instance.roles(owner);
      console.log(role.toNumber().toString(2));
    });
  });
});
