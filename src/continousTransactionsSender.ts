

import Web3 from 'web3';

// ethereumjs-wallet is a typescript project without types :-o
const Wallet = require('ethereumjs-wallet');
import {KeyPair, generateAddressesFromSeed } from './utils'
import {PromiEvent, TransactionConfig, TransactionReceipt} from "web3-core";


export class ContinousTransactionsSender {

    private currentNonce = 0;
    private address : string;
    private privateKey : string;

    private isRunning = false;

    public constructor(readonly mnemonic: string, readonly mnemonicAccountIndex: number, public readonly web3: Web3, public readonly sheduleInMs: number) {

        const wallets = generateAddressesFromSeed(mnemonic, mnemonicAccountIndex + 1);
        const wallet = wallets[mnemonicAccountIndex];
        console.log(wallet);

        this.address = wallet.address;
        this.privateKey = wallet.privateKey;
        //this.currentNonce = web3.eth.getTransactionCount();
    }

    private async sendTx() {

        const tx: TransactionConfig = {
            from: this.address,
            to: this.address,
            value: '0',
            gas: '21000',
            gasPrice: '1000000000',
            nonce: this.currentNonce
        };

        this.currentNonce = this.currentNonce + 1;
        const signedTransaction = await this.web3.eth.accounts.signTransaction(tx, this.privateKey);
        await this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction!).once('transactionHash', (receipt: string) => {
            console.log(`transactionHash ${receipt}`);
        })
        .once('receipt', (receipt => {
            console.log(`Received ${receipt.transactionHash} in block ${receipt.blockNumber}`);
        }))
        .once('confirmation', (confNumber, receipt) => {
            console.log(`Transaction Confirmation ${confNumber}  - ${receipt.blockNumber} - ${receipt.transactionHash}`);
        })
        .once('error', (error => {
            console.log(`Error while sending Transaction: `, error);
        }))
    }

    public async startSending() {
        // this.web3.eth.sendTransaction();

        this.currentNonce = await this.web3.eth.getTransactionCount(this.address);
        this.isRunning = true;
        setInterval(()=>{
            if (this.isRunning) {
                this.sendTx();
            }
        }, this.sheduleInMs);
    }

    public  stop() {
        // not sure if realy needed.
        //throw  new Error(`Stop not implemented yet`);
        this.isRunning = false;
    }
}
