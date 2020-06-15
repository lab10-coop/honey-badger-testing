import { ConfigManager } from './configManager';
import { LogFileManager } from './logFileManager';
import BigNumber from 'bignumber.js';



async function writeBlockNumberFile() {

  const web3 = ConfigManager.getWeb3();
  const latestBlockNumber = await web3.eth.getBlockNumber();

  LogFileManager.writeBlockNumberOutput(latestBlockNumber);
}

writeBlockNumberFile().then(() => {
  process.exit(0);
});
