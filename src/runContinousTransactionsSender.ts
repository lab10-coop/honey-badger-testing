
import { ContinousTransactionsSender } from './continousTransactionsSender';
import { TransactionPerformanceTrackExporter } from './transactionPerformanceTrackExporter';
import Web3 from 'web3';

const mnemonic = "easy stone plastic alley faith duty away notice provide sponsor amount excuse grain scheme symbol";

const config = require('config');
console.log('config: ', config);

const web3 = new Web3(config.networkUrl);
// web3.eth.transactionConfirmationBlocks = 24;

const sender = new ContinousTransactionsSender(mnemonic, 0, web3, config.continuousSenderIntervalMin, config.continuousSenderIntervalMax, true);


sender.startSending().then((value) => {
    console.log(`started ContinousTransactionsSender`);
}).catch((reason => {
    console.error(`runContinousTransactionsSender: Error while sending: `, reason);
}));

setTimeout(()=> {


    sender.stop();
    console.log('stopped sending transactions');
    console.log('Waiting for 10s last transactions');

    // wait further 10 seconds. some transactions might still get validated.
    setTimeout(()=> {
        console.log(`performance Tests:`,sender.currentPerformanceTracks);
        const performanceTracks =  Array.from(sender.currentPerformanceTracks.values());
        const exporter = new TransactionPerformanceTrackExporter(performanceTracks);
        console.log(exporter.toCSV());
    }, 10000);
}, config.testDurationMs);

