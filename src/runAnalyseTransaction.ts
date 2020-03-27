

import { ConfigManager } from './configManager';

const web3 = ConfigManager.getWeb3();

const txHash = '0x29cde46afc692b0ad06c33817955db6c7103eb37923bdcc870eb2710b648db1d';


web3.eth.getTransaction(txHash).then((value) => {
    console.log(value);
}, (reason => {
    console.error(`Unable to analyse Transaction ${txHash}`);
}) )
