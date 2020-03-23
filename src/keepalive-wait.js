// sends transactions from a single account in a loop, waiting for the nonce to increment at the RPC node

"use strict";

const Web3 = require('web3');

const addr = '0x0102ac5315c1bd986a1da4f1fe1b4bca36fa4667';
const privKey = '0xab174fabad1b7290816cbebf3f235af9145f0ee482b0775992dcb04d5e9ad77d';

async function sendTx() {
        const web3 = new Web3('http://185.244.194.53:8541');
        //const web3 = new Web3('http://rpc.tau1.artis.network');
        //const web3 = new Web3('http://localhost:8555');
        const nonce = await web3.eth.getTransactionCount(addr);
        console.log(`next nonce: ${nonce}`);
        const txObj = {
                to: addr,
                gas: 21000
        };
        const signedTx = await web3.eth.accounts.signTransaction(txObj, privKey);

//      console.log(`signedTx: ${JSON.stringify(signedTx, null, 2)}`);
        console.log(`txObj: ${JSON.stringify(txObj, null, 2)}`);

        web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                .once('transactionHash', hash => console.log(`txHash: ${hash}`))
                .on('error', err => console.log('giving up :-('));
/*
                .on('error', async err => {
                        console.log(`failed with: ${err}. trying with next nonce...`);
                        txObj.nonce = nonce + 1; // beware of doing ++, it's a hex string
                        const newSignedTx = await web3.eth.accounts.signTransaction(txObj, privKey);
                        web3.eth.sendSignedTransaction(newSignedTx.rawTransaction)
                                .once('transactionHash', hash => console.log(`txHash: ${hash}`))
                                .on('error', async err => {
                                        console.log(`failed with: ${err}. trying with ubernext nonce...`);
                                        txObj.nonce = nonce + 2; // beware of doing ++, it's a hex string
                                        const newSignedTx = await web3.eth.accounts.signTransaction(txObj, privKey);
                                        web3.eth.sendSignedTransaction(newSignedTx.rawTransaction)
                                                .once('transactionHash', hash => console.log(`txHash: ${hash}`))
                                                .on('error', err => console.log('giving up :-('));
                                });
                });
                */
}

//f();

// interval in seconds
function loop(func, interval) {
        console.log('in loop');
        setTimeout(() => {
                console.log('in setTimeout');
                func;
                loop();
        }, interval);
}

//loop(sendTx, 5000);
//
setInterval(sendTx, 1000);
