

import Web3 from 'web3';

// ethereumjs-wallet is a typescript project without types :-o
const Wallet = require('ethereumjs-wallet');
import {KeyPair, generateAddressesFromSeed } from './utils'


export class ContinousTransactionsSender {

    private currentNonce = 0;
    private address : string;
    private privateKey : string;

    public constructor(readonly mnemonic: string, readonly mnemonicAccountIndex: number, public readonly web3: Web3, public readonly sheduleInMs: number) {

        const wallets = generateAddressesFromSeed(mnemonic, mnemonicAccountIndex + 1);
        const wallet = wallets[mnemonicAccountIndex];
        console.log(wallet);

        this.address = wallet.address;
        this.privateKey = wallet.privateKey;
        //this.currentNonce = web3.eth.getTransactionCount();
    }

    public startSending() {
        // this.web3.eth.sendTransaction();
    }

    public  stop() {
        // not sure if realy needed.
        throw  new Error(`Stop not implemented yet`);
    }
}
