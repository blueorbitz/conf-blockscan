import { fetch } from '@forge/api';
import { stringify } from 'query-string';
import { processError } from '.';
import CacheRequest from './cache';

// implementation reference
// https://etherscan.io/apidocs

const URL_ROOT = 'https://api.etherscan.io/api';

export default class EtherScan extends CacheRequest {
  constructor() {
    super('ES')
  }

  async tokenBalance(c_address, address) {
    return await this.request('account', 'tokenbalance', {
      contractaddress: c_address,
      address: address,
    });
  }

  async tokenTransaction(address) {
    return await this.request('account', 'tokentx', {
      address: address,
    });
  }

  async request(module, action, options) {
    try {
      if (module == null || action == null)
        throw new Error('Invalid action');

      const apikey = process.env.ETHERSCAN_APIKEY;
      const param = { module, action, ...options, apikey };
      
      const cacheRes = await this.getCache(action, options);
      if (cacheRes !== false)
        return cacheRes;

      const urlr = `${URL_ROOT}?${stringify(param)}`;
      console.log('etherscan:', urlr);

      const response = await fetch(urlr);
      const json = await response.json();

      this.addCache(action, options, json);

      return json;
    } catch (e) {
      processError(e);
    }
  }
}
