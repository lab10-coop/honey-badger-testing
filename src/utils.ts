


export declare interface KeyPair {
  address: string,
  privateKey: string
}


export function generateAddressesFromSeed(mnemonic: string, count: number) : Array<KeyPair> {

  let bip39 = require("bip39");
  let hdkey = require("ethereumjs-wallet/hdkey");
  let seed = bip39.mnemonicToSeedSync(mnemonic);
  let hdwallet = hdkey.fromMasterSeed(seed);
  let wallet_hdpath = "m/44'/60'/0'/0/";

  let accounts = [];
  for (let i = 0; i < count; i++) {
    let wallet = hdwallet.derivePath(wallet_hdpath + i).getWallet();
    let address = "0x" + wallet.getAddress().toString("hex");
    let privateKey = wallet.getPrivateKey().toString("hex");
    accounts.push({address: address, privateKey: privateKey});
  }

  return accounts;
}
