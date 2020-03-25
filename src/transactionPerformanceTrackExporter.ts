

import { TransactionPerformanceTrack } from './types'

import { createArrayCsvStringifier, createObjectCsvWriter } from 'csv-writer'
import {ArrayCsvStringifierParams, ObjectCsvStringifierParams} from "csv-writer/src/lib/csv-stringifier-factory";

export class TransactionPerformanceTrackExporter {

    constructor(public readonly performanceTracks: ArrayLike<TransactionPerformanceTrack>) {

    }

    public toCSVFile(filename : string) {

    }

    public toCSV() : string {

        //const stringifier = createArrayCsvStringifier({});
        //const strArray = ['Hello'];
        //const stringifier = createObjectCsvWriter({ header: [] });


        //stringifier.stringifyRecords(this.performanceTracks);

        //let data = [][]
        //stringifier.stringifyRecords()

/*
        const csvWriter = createObjectCsvWriter({
            path: '/home/sn/lab10/honey-badger-testing/output/file.csv',
            header: [
                {id: 'name', title: 'NAME'},
                {id: 'lang', title: 'LANGUAGE'}
            ]
        });

        const records = [
            {name: 'Bob',  lang: 'French, English'},
            {name: 'Mary', lang: 'English'}
        ];

        csvWriter.writeRecords(records)       // returns a promise
            .then(() => {
                console.log('...Done');
            });
*/


        const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
        const csvStringifier = createCsvStringifier({
            alwaysQuote: true,
            header: [
                {id: 'internalTxID', title: 'internalTxID'},
                {id: 'transactionHash', title: 'transactionHash'},
                {id: 'blockNumber', title: 'blockNumber'},
                {id: 'durationSendToConfirmation', title: 'durationSendToConfirmation'},
                {id: 'durationSendToReceipt', title: 'durationSendToReceipt'},
                {id: 'timeSend', title: 'timeSend'},
                {id: 'timeReceipt', title: 'timeReceipt'},
                {id: 'timeConfirmed', title: 'timeConfirmed'},
            ]
        });

        return csvStringifier.stringifyRecords(this.performanceTracks);
    }
}
