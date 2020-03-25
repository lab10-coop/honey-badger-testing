

import Web3 from 'web3';

// ethereumjs-wallet is a typescript project without types :-o
const Wallet = require('ethereumjs-wallet');
import {KeyPair, generateAddressesFromSeed } from './utils';
import {PromiEvent, TransactionConfig, TransactionReceipt} from "web3-core";
import {TransactionPerformanceTrack} from './types';

export class ContinousTransactionsSender {

    private currentNonce = 0;
    private currentInternalID = 0;
    private address : string;
    private privateKey : string;
    private isRunning = false;
    public currentPerformanceTracks = new Map<string, TransactionPerformanceTrack>();

    public constructor(readonly mnemonic: string, readonly mnemonicAccountIndex: number, public readonly web3: Web3, public readonly sheduleInMsMinimum: number, public readonly sheduleInMsMaximum: number, public readonly trackPerformance = true,) {

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
        this.currentInternalID++;
        const signedTransaction = await this.web3.eth.accounts.signTransaction(tx, this.privateKey);

        if (this.trackPerformance) {
            this.currentPerformanceTracks.set(signedTransaction.transactionHash!, new TransactionPerformanceTrack(this.currentInternalID, signedTransaction.transactionHash!, Date.now()));
        }

        await this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction!).once('transactionHash', (receipt: string) => {
            console.log(`transactionHash ${receipt}`);
        })
        .once('receipt', (receipt => {
            const now = Date.now();
            console.log(`${now} - Received ${receipt.transactionHash} in block ${receipt.blockNumber}`);
            if (this.trackPerformance) {
                const track = this.currentPerformanceTracks.get(receipt.transactionHash)!;
                track.timeReceipt = now;
                track.blockNumber = receipt.blockNumber;
            }
        }))
        .once('confirmation', (confNumber, receipt) => {
            const now = Date.now();
            console.log(`${now} - Transaction Confirmation ${confNumber}  - ${receipt.blockNumber} - ${receipt.transactionHash}`);
            if (this.trackPerformance) {
                const track = this.currentPerformanceTracks.get(receipt.transactionHash)!;
                track.timeConfirmed = now;
                track.blockNumber = receipt.blockNumber; //might overwrite if the block get's mined in another block than it got received
            }
            // we could figure out the confirmation time here be gather the block from the blockchain,
            // and take the value of the blocktime.
        })
        .once('error', (error => {
            console.log(`Error while sending Transaction: `, error);
        }))
    }

    private getRandomWaitInterval() {
        return this.sheduleInMsMinimum + Math.random() * (this.sheduleInMsMaximum - this.sheduleInMsMinimum);
    }

    public async startSending() {
        // this.web3.eth.sendTransaction();

        this.currentNonce = await this.web3.eth.getTransactionCount(this.address);
        this.isRunning = true;

        const executeFunction = () => {
            if (this.isRunning) {
                //shedule next function:
                setTimeout(executeFunction, this.getRandomWaitInterval());
                this.sendTx();
            }
        };

        setTimeout(executeFunction, this.getRandomWaitInterval());
    }

    public  stop() {
        // not sure if realy needed.
        //throw  new Error(`Stop not implemented yet`);
        this.isRunning = false;
    }
}
