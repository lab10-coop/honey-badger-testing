
import { ConfigManager } from './configManager';
import { ContinuousTransactionsSender } from './continuousTransactionsSender';
import { TransactionPerformanceTrackExporter } from './transactionPerformanceTrackExporter';
import { LogFileManager } from "./logFileManager";
import Web3 from 'web3';


console.log('NODE_ENV: ', process.env.NODE_ENV);

const web3 = ConfigManager.getWeb3();
const config = ConfigManager.getConfig();
// web3.eth.transactionConfirmationBlocks = 24;

const sender = new ContinuousTransactionsSender(config.mnemonic, config.mnemonicAccountIndex, web3, config.continuousSenderIntervalMin, config.continuousSenderIntervalMax, config.calcNonceEveryTurn, config.trackPerformance);

if (config.logToFile !== undefined){
    sender.logToMemory = config.logToFile;
}

if (config.logToTerminal !== undefined) {
    sender.logToConsole = config.logToTerminal;
}

if (config.maximumPoolSize !== undefined) {
    sender.maximumPoolSize = config.maximumPoolSize;
}

sender.startSending().then((value: void) => {
    console.log(`started ContinuousTransactionsSender`);
}).catch((reason : any) => {
    console.error(`runContinuousTransactionsSender: Error while sending: `, reason);
});


setTimeout(()=> {
    sender.stop();
    console.log('stopped sending transactions');
    console.log('Waiting for 10s last transactions');

    // wait further 10 seconds. some transactions might still get validated.
    setTimeout(()=> {
        // console.log(`performance Tests:`,sender.currentPerformanceTracks);
        const performanceTracks =  Array.from(sender.currentPerformanceTracks.values());
        const exporter = new TransactionPerformanceTrackExporter(performanceTracks);
        const csvResult = exporter.toCSV();
        console.log(csvResult);
        LogFileManager.writeCSVOutput(csvResult);
        LogFileManager.writeJSONOutput(JSON.stringify(performanceTracks));
        if (config.logToFile) {
            LogFileManager.writeLogOutput(sender.currentLogEntries);
        }
        process.exit(0);
    }, 10000);
}, config.testDurationMs);
