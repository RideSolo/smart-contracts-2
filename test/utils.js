export function sig(address, opts) {
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

export function timeTravelTo(date) {
  const duration = new Date(date).getTime() / 1000 - web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1;
  const id = Date.now();

  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [duration],
      id: id,
    }, err1 => {
      if (err1) return reject(err1)

      web3.currentProvider.sendAsync({
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: id+1,
      }, (err2, res) => {
        return err2 ? reject(err2) : resolve(res)
      })
    })
  })
}

