import { fetch } from '@forge/api';
import { stringify } from 'query-string';

// implementation reference
// https://github.com/blockcypher/node-client/blob/master/lib/bcypher.js

const URL_ROOT = 'https://api.blockcypher.com/v1/';

export default class Blockcy {
  constructor(coin, chain, token) {
    this.coin = coin;
    this.chain = chain;
    this.token = token;
  }

  async _get(url, params) {
    try {
      if (this.coin == null || this.chain == null)
        throw new Error('Invalid chain is selected');
      
      const urlr = URL_ROOT + this.coin + '/' + this.chain + url;
      const _params = Object.assign({}, params, { token: this.token });
      console.log('blockcy _get:', urlr);

      const response = await fetch(`${urlr}?${stringify(_params)}`);
      const json = await response.json();
      return json;
    } catch (e) {
      return processError(e);
    }
  }

  async getAddrBal(addr, params = {}) {
    return await this._get('/addrs/' + addr + '/balance', params);
  };
}

function processError(e) {
  console.error(e);
  if (e.error)
    return e;
  else
    return { error: e.message };
}
