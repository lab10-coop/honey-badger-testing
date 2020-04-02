

import Web3 from 'web3';

// ethereumjs-wallet is a typescript project without types :-o
const Wallet = require('ethereumjs-wallet');
import {KeyPair, generateAddressesFromSeed } from './utils';
import {PromiEvent, TransactionConfig, TransactionReceipt} from "web3-core";
import {TransactionPerformanceTrack} from './types';

export class ContinuousTransactionsSender {

    private currentNonce = 0;
    private currentInternalID = 0;
    private address : string;
    private privateKey : string;
    private isRunning = false;
    private currentPoolSize = 0;

    public currentPerformanceTracks = new Map<string, TransactionPerformanceTrack>();
    public currentLogEntries = new Array<string>();

    public logToConsole = true;
    public logToMemory = false;

    public maximumPoolSize: number = 99999999;

    public constructor(readonly mnemonic: string, readonly mnemonicAccountIndex: number, public readonly web3: Web3, public readonly sheduleInMsMinimum: number, public readonly sheduleInMsMaximum: number, public readonly calcNonceEveryTurn: boolean = false, public readonly trackPerformance = true, public readonly batchSize: number | undefined = 1) {

        const wallets = generateAddressesFromSeed(mnemonic, mnemonicAccountIndex + 1);
        const wallet = wallets[mnemonicAccountIndex];
        console.log(wallet);

        this.address = wallet.address;
        this.privateKey = wallet.privateKey;
        //this.currentNonce = web3.eth.getTransactionCount();
    }

    private log(message: string, ...args: any) {
        if (this.logToConsole){
            console.log(message, args);
        }
        if (this.logToMemory) {
            this.currentLogEntries.push(message);
        }
    }

    private error(message: string, ...args: any) {
        if (this.logToConsole){
            console.error(message, args);
        }
        if (this.logToMemory) {
            this.currentLogEntries.push(message);
        }
    }

    private async sendTx(nonce: number) {

        if (this.currentPoolSize > this.maximumPoolSize) {
            return;
        }

        if (this.calcNonceEveryTurn) {
            this.currentNonce = await this.web3.eth.getTransactionCount(this.address);
        }

        const tx: TransactionConfig = {
            from: this.address,
            to: this.address,
            value: '0',
            gas: '21000',
            gasPrice: '1000000000',
            nonce: this.currentNonce
        };

        this.currentInternalID++;
        this.currentNonce++;

        const signedTransaction = await this.web3.eth.accounts.signTransaction(tx, this.privateKey);

        if (this.trackPerformance) {

            const existingEntry = this.currentPerformanceTracks.get(signedTransaction.transactionHash!);
            if (existingEntry != undefined) {
                console.error(`Detected a case where the same transaction get send twice!! tx: ${signedTransaction.transactionHash}`,tx, existingEntry);
            }

            this.currentPerformanceTracks.set(signedTransaction.transactionHash!, new TransactionPerformanceTrack(this.currentInternalID, signedTransaction.transactionHash!, Date.now(), tx));
        }

        this.currentPoolSize++;
        this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction!).once('transactionHash', (receipt: string) => {
            this.log(`transactionHash ${receipt}`);
        })
        .once('receipt', (receipt => {
            const now = Date.now();
            this.log(`${now} - Received ${receipt.transactionHash} in block ${receipt.blockNumber}`);
            this.currentPoolSize--;
            if (this.trackPerformance) {
                const track = this.currentPerformanceTracks.get(receipt.transactionHash)!;
                track.timeReceipt = now;
                track.blockNumber = receipt.blockNumber;
            }
        }))
        .once('confirmation', (confNumber, receipt) => {
            const now = Date.now();
            this.log(`${now} - Transaction Confirmation ${confNumber}  - ${receipt.blockNumber} - ${receipt.transactionHash}`);
            if (this.trackPerformance) {
                const track = this.currentPerformanceTracks.get(receipt.transactionHash)!;
                track.timeConfirmed = now;
                track.blockNumber = receipt.blockNumber; //might overwrite if the block get's mined in another block than it got received
            }
            // we could figure out the confirmation time here be gather the block from the blockchain,
            // and take the value of the blocktime.
        })
        .once('error', (error => {
            this.error(`Error while sending Transaction: ${signedTransaction.transactionHash!}`, error);
        }))
    }

    private getRandomWaitInterval() {
        return this.sheduleInMsMinimum + Math.random() * (this.sheduleInMsMaximum - this.sheduleInMsMinimum);
    }

    public async startSending() {
        // this.web3.eth.sendTransaction();

        this.currentNonce = await this.web3.eth.getTransactionCount(this.address);
        this.isRunning = true;

        // :-o a async recursive function with reentrancy syncronization :-o

        const executeFunction = async () => {
            if (this.isRunning) {
                //shedule next function:
                setTimeout(executeFunction, this.getRandomWaitInterval());
                if (this.currentPoolSize < this.maximumPoolSize) {
                    this.sendTx(this.currentNonce);
                } else {
                    //console.log(`Ignoring transaciton: too many in pool ${this.currentPoolSize}`);
                }
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
