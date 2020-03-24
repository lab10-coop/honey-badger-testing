
import { ContinousTransactionsSender } from './continousTransactionsSender';
import Web3 from 'web3';

const mnemonic = "easy stone plastic alley faith duty away notice provide sponsor amount excuse grain scheme symbol";


const config = require('config');


const web3 = new Web3(config.networkUrl);
const sender = new ContinousTransactionsSender(mnemonic, 0, web3, 1000);

const startSending = sender.startSending();
startSending.then((value) => {
    console.log(`Finished runContinousTransactionsSender`);
}).catch((reason => {
    console.error(`runContinousTransactionsSender: Error while sending: `, reason);
}))
