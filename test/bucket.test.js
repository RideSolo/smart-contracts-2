import { sig } from "./utils";
import expectThrow from "zeppelin-solidity/test/helpers/expectThrow";
import increaseTime, {
  duration
} from "zeppelin-solidity/test/helpers/increaseTime";
const TokenBucket = artifacts.require("TokenBucket.sol");
const GenericToken = artifacts.require("GenericToken.sol");

contract("TokenBucket", ([owner, minter, first, second, third, fourth]) => {
  let bucket, token, size, rate;
  before(async () => {
    rate = 5000 * 10e8; // 5k tokens per second
    size = 300000 * 10e8; // 300k tokens per second (1 minute to fullfil)
    token = await GenericToken.new();
    bucket = await TokenBucket.new(token.address, size, rate);
    await token.transferOwnership(bucket.address);
    await bucket.addMinter(minter);
  });

  describe("Calculation", () => {
    it("should have full size at start", async () => {
      assert.equal(
        size.toString(),
        (await bucket.availableForMint()).toString(10)
      );
    });

    it("should decrease available after mint", async () => {
      await bucket.mint(first, 100);
      const available = await bucket.availableForMint();
      assert.isAbove(size, available.toNumber());
      assert.equal(size - 100, available.toNumber());
    });

    it("should return available after time", async () => {
      const availableAtBegin = await bucket.availableForMint();
      await bucket.mint(second, availableAtBegin);
      const availableAfterMint = await bucket.availableForMint();
      assert.equal(
        0,
        availableAfterMint,
        "Available amount to mint isn't zero after mint"
      );
      await increaseTime(duration.minutes(1));
      const availableAfterTime = await bucket.availableForMint();
      assert.equal(
        size,
        availableAfterTime,
        "After minute available hasn't achived size"
      );
    });
  });

  describe("Administration", () => {
    it("should reject changes from strangers", async () => {
      await Promise.all(
        [first, second].map(async account => {
          await expectThrow(bucket.setSize(size + size, sig(account)));
          await expectThrow(bucket.setRate(rate + rate, sig(account)));
          await expectThrow(
            bucket.setSizeAndRate(size + size, rate + rate, sig(account))
          );
        })
      );
    });

    it("should reject changes from minter", async () => {
      await expectThrow(bucket.setSize(size + size, sig(minter)));
      await expectThrow(bucket.setRate(rate + rate, sig(minter)));
      await expectThrow(
        bucket.setSizeAndRate(size + size, rate + rate, sig(minter))
      );
    });

    it("should allow owner to change settings", async () => {
      await bucket.setRate(rate + rate, sig(owner));
      await bucket.setSize(size + size, sig(owner));
      await bucket.setSizeAndRate(size + size, rate + rate, sig(owner));
    });
  });
});
