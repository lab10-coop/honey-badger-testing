
import { ContinousTransactionsSender } from './continousTransactionsSender';
import Web3 from 'web3';


const mnemonic = "easy stone plastic alley faith duty away notice provide sponsor amount excuse grain scheme symbol";


const web3 = new Web3();

const sender = new ContinousTransactionsSender(mnemonic, 0, web3, 1000);

