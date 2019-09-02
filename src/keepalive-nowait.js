// sends transactions from a single account in a loop, incrementing the nonce locally (not waiting for previous txs to be accepted / mined)

const Web3 = require('web3');

const addr = '0x0102ac5315c1bd986a1da4f1fe1b4bca36fa4667';
const privKey = '0xab174fabad1b7290816cbebf3f235af9145f0ee482b0775992dcb04d5e9ad77d';

const web3 = new Web3('http://localhost:8540');

let runningNonce = 0;

async function sendTx() {
  const txObj = {
    to: addr,
    gas: 210000,
    nonce: runningNonce,
    // value: Math.floor(Math.random() * 1000000)
  };
  runningNonce += 1;
  const signedTx = await web3.eth.accounts.signTransaction(txObj, privKey);

  await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    .once('transactionHash', hash => console.log(`txHash: ${hash}`));
}

async function startSending() {
  runningNonce = await web3.eth.getTransactionCount(addr);
  console.log(`Starting at nonce: ${runningNonce}`);
  setInterval(sendTx, 1000);
}

startSending();
