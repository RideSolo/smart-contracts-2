import { sig } from "./utils";
import expectThrow from "zeppelin-solidity/test/helpers/expectThrow";
const MustToken = artifacts.require("MustToken.sol");

contract("Token contract", ([owner, minter, buyer, another]) => {
  let token;
  let STRANGER_ROLE;
  let ALL_ROLES;
  let ADMIN_ROLE;
  let MINTER_ROLE;
  before(async () => {
    token = await MustToken.new();
    STRANGER_ROLE = (await token.STRANGER_ROLE()).toNumber();
    ALL_ROLES = (await token.ALL_ROLES()).toNumber();
    ADMIN_ROLE = (await token.ADMIN_ROLE()).toNumber();
    MINTER_ROLE = (await token.MINTER_ROLE()).toNumber();
  });

  describe("Constants", () => {
    it("Should be named as Main Universal Standard of Tokenization", async () => {
      assert.equal(
        "Main Universal Standard of Tokenization",
        await token.name()
      );
    });
    it("Should have symbol/ticker named as MUST", async () => {
      assert.equal("MUST", await token.symbol());
      assert.equal("MUST", await token.ticker());
    });
  });
  describe("Minting", () => {
    before(async () => {
      await token.updateRole(minter, MINTER_ROLE, sig(owner));
    });

    it("should have 0 token after start", async () => {
      assert.equal(
        0,
        await token.totalSupply(),
        "Total supply isn't 0 at start"
      );
    });

    it("shoud allow minter to mint tokens", async () => {
      const beforeBalance = await token.balanceOf(buyer);
      const beforeTotal = await token.totalSupply();
      await token.mint(buyer, 1, sig(minter));
      const afterBalance = await token.balanceOf(buyer);
      const afterTotal = await token.totalSupply();

      assert.equal(
        1,
        afterBalance.sub(beforeBalance),
        "Balance didn't increase on minted value after minting"
      );
      assert.equal(
        1,
        afterTotal.sub(beforeTotal),
        "Total supply didn't increase on minted value after minting"
      );
    });

    it("should reject minting over hardcap", async () => {
      const currentTotal = await token.totalSupply();
      const hardcap = await token.hardcap();
      const leftTotal = hardcap.sub(currentTotal);

      await token.mint(buyer, leftTotal, sig(minter));
      await expectThrow(token.mint(buyer, 1, sig(minter)));
    });

    it("should allow to burn tokens", async () => {
      const balance = await token.balanceOf(buyer);
      await token.burn(balance, sig(buyer));
      const afterBalance = await token.balanceOf(buyer);
      const afterTotal = await token.totalSupply();

      assert.equal(0, afterBalance, "Balance didn't burn after burn action");
      assert.equal(0, afterTotal, "Total supply didn't burn after burn action");
    });
  });
  describe("Finalization", () => {
    before(async () => {
      await token.mint(buyer, 100000000, sig(minter));
    });

    it("should reject transfer before sane", async () => {
      await expectThrow(token.transfer(another, 50000, sig(buyer)));
    });

    it("shold reject sanetization from non admin", async () => {
      const NOT_ADMIN = ~ADMIN_ROLE & 0xff;
      await token.updateRole(buyer, NOT_ADMIN, sig(owner));
      await expectThrow(token.transfer(another, 50000, sig(buyer)));
      await expectThrow(token.approve(another, 50000, sig(buyer)));
      await expectThrow(
        token.transfer(another, 50000, Buffer.from("hello world"), sig(buyer))
      );
      await expectThrow(
        token.transferFrom(buyer, another, 25000, sig(another))
      );
      await expectThrow(
        token.transferFrom(
          buyer,
          another,
          25000,
          Buffer.from("hello world"),
          sig(another)
        )
      );
    });

    it("should allow owner sane token", async () => {
      await token.saneIt(sig(owner));
      assert.isTrue(await token.sane(), "Token isn't sane after sane action");
    });

    it("should finish minting in sane", async () => {
      assert.isTrue(
        await token.mintingFinished(),
        "Minting isn't finish after sane action"
      );
    });

    it("should allow to transfer tokens after sane", async () => {
      await token.transfer(another, 5000, sig(buyer));
      await token.approve(another, 50000, sig(buyer));
      await token.transfer(
        another,
        50000,
        Buffer.from("hello world"),
        sig(buyer)
      );
      await token.transferFrom(buyer, another, 25000, sig(another));
      await token.transferFrom(
        buyer,
        another,
        25000,
        Buffer.from("hello world"),
        sig(another)
      );
    });

    it("prevent minting after sane", async () => {
      await expectThrow(token.mint(buyer, 10000, sig(minter)));
    });
  });
});
