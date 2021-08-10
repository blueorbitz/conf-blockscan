import { fetch } from '@forge/api';
import { stringify } from 'query-string';

// implementation reference
// https://etherscan.io/apidocs

const URL_ROOT = 'https://api.etherscan.io/api';

export default class EtherScan {
  async tokenBalance(c_address, address) {
    return await this.request('account', 'tokenbalance', {
      contractaddress: c_address,
      address: address,
    });
  }

  async request(module, action, options) {
    try {
      if (module == null || action == null)
        throw new Error('Invalid action');

      const apikey = process.env.ETHERSCAN_APIKEY;
      const param = { module, action, ...options, apikey };
      const urlr = `${URL_ROOT}?${stringify(param)}`;
      console.log('etherscan:', urlr);

      const response = await fetch(urlr);
      const json = await response.json();
      return json;
    } catch (e) {
      processError(e);
    }
  }
}

function processError(e) {
  console.error(e);
  if (e.error)
    return e;
  else
    return { error: e.message };
}
