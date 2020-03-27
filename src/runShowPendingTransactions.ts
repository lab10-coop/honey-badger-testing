

import { ConfigManager } from "./configManager";

import { Transaction } from  'web3-core';

import * as _ from  'underscore';


function transactionsToString(transactions: Array<Transaction>) {

    _.groupBy([1.3, 2.1, 2.4], function(num){ return Math.floor(num); });
    const groupyByFrom : _.Dictionary<Transaction[]> = _.groupBy(transactions, function(x){ return x.from });
    console.log(groupyByFrom);

}

async function start() {
    const web3 = ConfigManager.getWeb3();
    //seems not to work because web3 doesnt support this functionallity for prarity nodes
    // or in other words: Parity is not compatible. it does not provide a txpool_content function, it provides parity_pendingTransactions
    // see: https://ethereum.stackexchange.com/questions/25454/in-parity-what-is-the-equivalent-rpc-call-to-geths-txpool-content
    const pendingTx = await web3.eth.getPendingTransactions((error, result) => {

        if (!((typeof error) === 'undefined')) {
            console.error(`Error retrieving Transactions: ${typeof error}`, error);

        } else {
            transactionsToString(result);
        }
    });

    transactionsToString(pendingTx);
}

start();

