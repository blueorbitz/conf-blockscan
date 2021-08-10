import { fetch } from '@forge/api';
import { stringify } from 'query-string';
import { isEmpty, processError } from '.';

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
      if (isEmpty(this.coin) || isEmpty(this.chain))
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

  async addressBalance(address, params = {}) {
    if (isEmpty(address))
      return { error: 'Missing required parameter' };

    return await this._get('/addrs/' + address + '/balance', params);
  };

  async addressTransaction(address, params = {}) {
    if (isEmpty(address))
      return { error: 'Missing required parameter' };

    if (this.coin === 'eth')
      return await this._get(`/addrs/${address}/full`, params);
    else
      return await this._get(`/addrs/${address}`, params);
  }

  async transactionHash(hash) {
    if (isEmpty(hash))
      return { error: 'Missing required parameter' };

    return await this._get(`/txs/${hash}`);
  }
}
