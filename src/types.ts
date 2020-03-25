


export class TransactionPerformanceTrack {

    constructor(public internalTxID : number, public transactionHash : string, public timeSend : number) {
    }

    // internal Transaction ID: only for identifieying transactions within this performance test session

    public timeReceipt : number | undefined;

    public timeConfirmed : number | undefined;

    public blockNumber: number | undefined;

    get durationSendToConfirmation(): number | undefined {
        if (!this.timeConfirmed) return undefined;

        return  this.timeConfirmed - this.timeSend;
    }

    get durationSendToReceipt() : number | undefined {
        if (!this.timeReceipt)return undefined;

        return  this.timeReceipt - this.timeSend;
    }
}

