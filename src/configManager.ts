

import Web3 from 'web3';


export interface TestConfig {

    networkUrl : string,
    continuousSenderIntervalMin: number,
    continuousSenderIntervalMax: number,
    testDurationMs : number,
    mnemonic: string,
    mnemonicAccountIndex: number,
    calcNonceEveryTurn: boolean
}


//const mnemonic = "easy stone plastic alley faith duty away notice provide sponsor amount excuse grain scheme symbol";

const config = require('config') as TestConfig;
console.log('config: ', config);

export class ConfigManager {

    public static getConfig() {
        return config;
    }

    public static getWeb3() {

        const result = new Web3(config.networkUrl);
        return result;
    }


}


