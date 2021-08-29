import { fetch } from '@forge/api';
import { stringify } from 'query-string';
import { processError } from '.';
import CacheRequest from './cache';

const OPENSEA_URL = 'https://api.opensea.io/api/v1/asset';

export default class OpenSea extends CacheRequest {
  constructor() {
    super('OS')
  }

  async singleAsset(contractAddress, tokenId) {
    return await this.request(`/${contractAddress}/${tokenId}`);
  }

  async request(url, query = {}) {
    try {
      const cacheRes = await this.getCache(url, query);
      if (cacheRes !== false)
        return cacheRes;

      const urlr = `${OPENSEA_URL}${url}?${stringify(query)}`;
      console.log('opensea:', urlr);

      const response = await fetch(urlr);
      const json = await response.json();

      this.addCache(url, query, json);

      return json;
    } catch (e) {
      processError(e);
    }
  }
}
