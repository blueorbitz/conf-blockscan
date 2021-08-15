import { fetch } from '@forge/api';
import { stringify } from 'query-string';
import { isEmpty, processError } from '.';
import CacheRequest from './cache';

// implementation reference
// https://github.com/blockcypher/node-client/blob/master/lib/bcypher.js

const URL_ROOT = 'https://api.blockcypher.com/v1/';

export default class Blockcy extends CacheRequest {
  constructor(coin, chain, token) {
    super('BC')
    this.coin = coin;
    this.chain = chain;
    this.token = token;
  }

  async _get(url, params) {
    try {
      if (isEmpty(this.coin) || isEmpty(this.chain))
        throw new Error('Invalid chain is selected');
      
      const path = this.coin + '/' + this.chain + url;
      const urlr = URL_ROOT + path;
      const _params = Object.assign({}, params, { token: this.token });

      const cacheRes = await this.getCache(path, params);
      if (cacheRes !== false) {
        console.log('bcypher cache:', path);
        return cacheRes;
      }

      console.log('blockcy _get:', urlr);

      const response = await fetch(`${urlr}?${stringify(_params)}`);
      const json = await response.json();
      
      this.addCache(path, params, json);

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
  
  async blockHash(hash) {
    if (isEmpty(hash))
      return { error: 'Missing required parameter' };

    return await this._get(`/blocks/${hash}`);
  }
}
