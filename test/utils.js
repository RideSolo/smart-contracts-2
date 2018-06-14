module.exports = {
  sig(address, opts) {
    if (typeof opts === "undefined") {
      opts = {};
    }

    return {
      value: 0,
      gasPrice: 0,
      gasLimit: 4.5e6,
      from: address,
      ...opts
    };
  }
};
