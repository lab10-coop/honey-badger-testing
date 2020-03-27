
import { ConfigManager } from './configManager';
import { ContinuousTransactionsSender } from './continuousTransactionsSender';
import { TransactionPerformanceTrackExporter } from './transactionPerformanceTrackExporter';
import Web3 from 'web3';


const web3 = ConfigManager.getWeb3();
const config = ConfigManager.getConfig();
// web3.eth.transactionConfirmationBlocks = 24;

const sender = new ContinuousTransactionsSender(config.mnemonic, config.mnemonicAccountIndex, web3, config.continuousSenderIntervalMin, config.continuousSenderIntervalMax, config.calcNonceEveryTurn);


sender.startSending().then((value) => {
    console.log(`started ContinuousTransactionsSender`);
}).catch((reason => {
    console.error(`runContinuousTransactionsSender: Error while sending: `, reason);
}));


setTimeout(()=> {
    sender.stop();
    console.log('stopped sending transactions');
    console.log('Waiting for 10s last transactions');

    // wait further 10 seconds. some transactions might still get validated.
    setTimeout(()=> {
        // console.log(`performance Tests:`,sender.currentPerformanceTracks);
        const performanceTracks =  Array.from(sender.currentPerformanceTracks.values());
        const exporter = new TransactionPerformanceTrackExporter(performanceTracks);
        console.log(exporter.toCSV());
        process.exit(0);
    }, 10000);
},config.testDurationMs);

