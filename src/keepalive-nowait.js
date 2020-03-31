// sends transactions from a single account in a loop, incrementing the nonce locally (not waiting for previous txs to be accepted / mined)

const Web3 = require('web3');

const addr = '0x0102ac5315c1bd986a1da4f1fe1b4bca36fa4667';
const privKey = '0xab174fabad1b7290816cbebf3f235af9145f0ee482b0775992dcb04d5e9ad77d';

//const web3 = new Web3('http://localhost:8540');
const web3 = new Web3('ws://185.244.194.53:9541'); // hbbft
//const web3 = new Web3('wss://ws.tau1.artis.network'); // tau1

let runningNonce;

const RUNTIME_S = 10;

const createdTxs = new Set();
const sentTxs = new Set();
const doneTxs = new Set();
const failedTxs = new Set();
const sentPromises = [];

let allowExit = false;

async function sendTx() {
  const txObj = {
    to: addr,
    gas: 210000,
    gasPrice: 1000000000,
    nonce: runningNonce,
    // value: Math.floor(Math.random() * 1000000)
  };
  runningNonce += 1;
  const signedTx = await web3.eth.accounts.signTransaction(txObj, privKey);

  createdTxs.add(signedTx);

  const txProm = web3.eth.sendSignedTransaction(signedTx.rawTransaction)
  .once('transactionHash', (hash) => {
    //console.log(`${hash} sent`);
    sentTxs.add(hash);
  }).once('receipt', (receipt) => {
    //console.log(`${receipt.transactionHash} mined`);
    doneTxs.add(receipt);
  }).on('error', (err) => {
    console.error(err);
    failedTxs.add(signedTx);
  });
  sentPromises.push(txProm);
}

/*
async function loopWithInterval(intervalMs) {
  runningNonce = await web3.eth.getTransactionCount(addr);
  console.log(`Starting at nonce: ${runningNonce}`);
  const loopHandle = setInterval(sendTx, intervalMs);
  setTimeout(async () => {
    clearInterval(loopHandle);
    console.log(`loop stopped with ${sentPromises.length} txs created, waiting for all promises to return`);
    setTimeout(() => {
      console.log('report');
      report();
    }, 5000); // hack bcs Promise.all blocks :-/
    await Promise.all(sentPromises);
    console.log('Promise.all done :-)');
    report();
  }, RUNTIME_S * 1000);
}
 */

// send txs up to a given limit of txs which is the count of txs which were broadcast, but not yet mined
async function loopWithQueueSizeLimit(limit) {
  runningNonce = await web3.eth.getTransactionCount(addr);
  console.log(`Starting at nonce: ${runningNonce}`);

  const loopHandle = setInterval(maybeSendTx, 10);
  setTimeout(async () => {
    clearInterval(loopHandle);
    console.log(`loop stopped with ${sentPromises.length} txs created, waiting for all promises to return`);
    setTimeout(() => {
      console.log('report');
      report();
    }, 5000); // hack bcs Promise.all often blocks forever :-/
    await Promise.all(sentPromises);
    console.log('Promise.all done :-)');
    //report();
    allowExit = true;
  }, RUNTIME_S * 1000);

  function maybeSendTx() {
    const nrCreated = sentPromises.length;
    const nrMined = doneTxs.size;
    if (nrMined - nrCreated < limit) {
      sendTx();
    }
  }
}

function report() {
  const doneTxHashes = new Set([...doneTxs].map(receipt => receipt.transactionHash));
  const pendingTxs = [...sentTxs].filter(txHash => !doneTxHashes.has(txHash));
  console.log(`${pendingTxs.length} are still pending: ${pendingTxs}`);
  console.log(`executed ${doneTxs.size} transactions in ${RUNTIME_S} seconds | ${doneTxs.size / RUNTIME_S} tps`);
  console.log(`${createdTxs.size} created, ${sentTxs.size} sent, ${doneTxs.size} done, ${failedTxs.size} failed`);
  console.log('you may exit now (Ctrl -C)');
}

console.log(`Starting a loop of ${RUNTIME_S} seconds duration`);
//loopWithInterval(100);
loopWithQueueSizeLimit(100);

// trying to keep the application alive. Not sure if it makes a difference
/*
(function wait() {
  if (!allowExit) {
    setTimeout(wait, 1000)
  } else {
    console.log('exit allowed');
  }
})();
*/