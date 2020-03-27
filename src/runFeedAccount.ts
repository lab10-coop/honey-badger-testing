"use strict";


import { ConfigManager } from './configManager';

import {KeyPair, generateAddressesFromSeed } from './utils';


import Web3 from 'web3';
import {PromiEvent, SignedTransaction, TransactionConfig, TransactionReceipt} from "web3-core";


const config = ConfigManager.getConfig();
const web3 = ConfigManager.getWeb3();

//const privKey = '0xab174fabad1b7290816cbebf3f235af9145f0ee482b0775992dcb04d5e9ad77d';

const privKey = '0xA2540F5D61616E3DC7957F153F231A47BD8283C31719FB52608952324C3B29F3';

const mnemonic = config.mnemonic;

//const web3 = new Web3('http://185.244.194.53:8541');

const account = web3.eth.accounts.privateKeyToAccount(privKey);
//console.log('Address: ', account.address);
const addr = account.address; // '0x0102ac5315c1bd986a1da4f1fe1b4bca36fa4667';

const countOfRecipients = 1000;
const valueToFeed = '100000000000000000000';
//on new network you might want to "feed" all the accounts.
const transactionValue = '0';

async function printBalances(addresses: Array<KeyPair>){
    for(let i = 0; i < addresses.length; i++) {
        const a = addresses[i].address;
        const balance = await web3.eth.getBalance(a);
        console.log(i + ': ' + a + ' : ' + balance);
    }
};

async function runFeed() {

    const addresses = generateAddressesFromSeed(mnemonic, countOfRecipients);

    console.log('Balances before run:');
    await printBalances(addresses);


    //web3.eth.transactionConfirmationBlocks = 0;
    const currentBlockNumber = await web3.eth.getBlockNumber();

    console.log('currentBlockNumber = ', currentBlockNumber);

    //const web3Local = new Web3('http://127.0.0.1:8540');

    //console.log('currentBlockNumber from  local = ', await web3Local.eth.getBlockNumber());

    let nonceBase = await web3.eth.getTransactionCount(addr);

    console.log(`Current Transaction Count: ${nonceBase}`);
    //going to cache the number of transactions,
    // so the signing process does not

    //return;

    const rawTransactions : Array<SignedTransaction> = new Array<SignedTransaction>(countOfRecipients);

    for(let i = 0; i < countOfRecipients; i++) {

        //console.log(`next nonce: ${nonce}`);
        const txObj : TransactionConfig = {
            from: addr,
            to: addresses[i].address,
            gas: 21000,
            gasPrice: '090000000000',
            value: valueToFeed,
            nonce: nonceBase + i,
        };

        console.log(`preparing TX: `, txObj);



        const signedTx = await web3.eth.accounts.signTransaction(txObj, privKey);
        console.log('got signed Transaction: ', signedTx.rawTransaction);

        rawTransactions[i] = signedTx!;
    }

    console.log(`all Transaction Signatures created`, rawTransactions);


    const startDate = Date.now();

    let transactionsConfirmed = 0;

    const confirmationsPromises = new Array<PromiEvent<TransactionReceipt>>(countOfRecipients);

    for(let i = 0; i < countOfRecipients; i++) {
        const signedTx = rawTransactions[i];

        console.log(`sending: ${i}`, signedTx);
        const sendResult = web3.eth.sendSignedTransaction(signedTx.rawTransaction!)
            .once('error', (error: Error) => {
                console.error(`Error While Sending! ${i} ${signedTx.messageHash}`, error);
            })
            .once('confirmation', (confNumber: number, receipt: TransactionReceipt) => {
                console.log(`Received Tx on Blockchain: blockNumber: ${receipt.blockNumber}, transactionHash: ${receipt.transactionHash}`);
                transactionsConfirmed++;
            })
            .once('transactionHash', (receipt: string) => {
                console.log(`TransactionHash : ${receipt}`);
            });

        confirmationsPromises[i] = sendResult;
    }



    console.log(`All Transactions send to the blockchain.`);

    nonceBase = nonceBase + countOfRecipients;

    //sending dummy Transaction
    /*web3.eth.sendTransaction({
      from: addr,
      to: addr,
      gas: 21000,
      gasPrice: '100000000000',
      nonce: nonceBase + 1
    })*/

    for(let i = 0; i < countOfRecipients; i++) {
        const promiEvent = confirmationsPromises[i];
        await promiEvent;
        console.log(`Confirmed Transaction ${i}`);
    }

    console.log(`Confirmed all Transactions`);

    //console.log('send Result: ', sendResult);
    //const newTargetAddressBalance = await web3.eth.getBalance(addr);
    //console.log('new target address Balance: ', newTargetAddressBalance);
}

runFeed().then((value) => {
    console.log('Job Done!!', value);
    process.exit();
}, (error) => {
    console.error('got some Error', error);
    process.exit(1);
});
