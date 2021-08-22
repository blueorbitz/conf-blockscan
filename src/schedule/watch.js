import { buildRestOutput } from '../utils';
import * as storage from '../utils/storage';
import BlockAPI from '../utils/blockchain-api';

export default async () => {
  console.log('schedule watch');
  try {
    let response = await storage.getWallets('W#');
    response = response.filter(o => o.key.indexOf('#wallet#') !== -1);

    for (let i = 0; i < response.length; i++) {
      const obj = response[i].value;

      const { platform, address, key } = obj;
      const transactions = await BlockAPI.GetCoinTransactionLite(platform, 'main', address);
      if (transactions.error)
        continue;
      
      const lastHash = transactions.txrefs[0].tx_hash;
      const storedHash = await storage.getLastTransaction(key);
      console.log('hash check:', storedHash, lastHash);
      if (storedHash == null)
        await storage.updateLastTransaction(key, lastHash);
      else if (storedHash !== lastHash) {
        console.log('PUSH NOTIFICATION EVENT');
        await storage.updateLastTransaction(key, lastHash);
      }
    }

    return buildRestOutput();
  }
  catch (error) {
    console.error(error);
    return buildRestOutput('', 500, 'Internal Error');
  }
};