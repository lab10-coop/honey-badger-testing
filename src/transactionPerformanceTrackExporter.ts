

import { TransactionPerformanceTrack } from './types'

import { createArrayCsvStringifier, createObjectCsvWriter } from 'csv-writer'
import {ArrayCsvStringifierParams, ObjectCsvStringifierParams} from "csv-writer/src/lib/csv-stringifier-factory";

export class TransactionPerformanceTrackExporter {

    constructor(public readonly performanceTracks: ArrayLike<TransactionPerformanceTrack>) {

    }

    public toCSVFile(filename : string) {

    }

    public toCSV() : string {

        const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
        const csvStringifier = createCsvStringifier({
            alwaysQuote: true,
            header: ['internalTxID', 'transactionHash', 'blockNumber','timeSend', 'timeReceipt', 'timeConfirmed']
        });

        let headerString = csvStringifier.header.join(',') + '\n';

        return headerString + csvStringifier.stringifyRecords(this.performanceTracks);
    }
}
