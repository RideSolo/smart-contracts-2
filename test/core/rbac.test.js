import { sig } from "../utils";
import expectThrow from "zeppelin-solidity/test/helpers/expectThrow";
const RBACMixin = artifacts.require("RBACMixin.sol");

contract("RBAC Mixin", ([owner, stranger, another]) => {
  describe("RBAC", () => {
    let rbac;
    let STRANGER_ROLE;
    let ALL_ROLES;
    let ADMIN_ROLE;
    let MINTER_ROLE;
    before(async () => {
      rbac = await RBACMixin.new(sig(owner));
      STRANGER_ROLE = (await rbac.STRANGER_ROLE()).toNumber();
      ALL_ROLES = (await rbac.ALL_ROLES()).toNumber();
      ADMIN_ROLE = (await rbac.ADMIN_ROLE()).toNumber();
      MINTER_ROLE = (await rbac.MINTER_ROLE()).toNumber();
    });

    it("creator should have exclusive roles", async () => {
      const ownerRoles = await rbac.roles(owner);
      assert.equal(
        ALL_ROLES,
        ownerRoles.toNumber(),
        "Owner have no exclusive rights after creation"
      );
    });

    it("stranger should haven't any roles", async () => {
      assert.equal(
        STRANGER_ROLE,
        await rbac.roles(stranger),
        "Stranger role isn't same as STRANGER_ROLE constant"
      );
    });

    it("creator should have a rights to grant mint role", async () => {
      await rbac.updateRole(stranger, MINTER_ROLE, sig(owner));
    });

    it("minter should haven't access to update roles", async () => {
      await expectThrow(rbac.updateRole(another, MINTER_ROLE, sig(stranger)));
    });

    it("should allow to grand multiple roles", async () => {
      await rbac.updateRole(another, ADMIN_ROLE | MINTER_ROLE, sig(owner));
    });
  });
});
