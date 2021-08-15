import { fetch } from '@forge/api';
import { stringify } from 'query-string';
import { processError } from '.';
import CacheRequest from './cache';

// implementation reference

const URL_ROOT = 'https://api.coingecko.com/api/v3';

export default class CoinGecko extends CacheRequest {
  constructor() {
    super('CG')
  }

  async contractInfo(platform, c_address) {
    if (platform === 'eth')
      platform = 'ethereum';

    const query = {
      localization: false,
      tickers: false,
      // market_data: false,
      community_data: false,
      developer_data: false,
      sparkline: false,
    };

    this.cacheWithQuery = false;
    return await this.request(`/coins/${platform}/contract/${c_address}`, query);
  }

  async simplePrice(platform) {
    switch (platform) {
      case 'btc': platform = 'bitcoin'; break;
      case 'eth': platform = 'ethereum'; break;
      case 'doge': platform = 'doge'; break;
      default: platform = 'bitcoin';
    }

    const result = await this.request('/simple/price', {
      ids: platform,
      vs_currencies: 'usd',
    });
    return result[platform];
  }

  async coinHistory(id, date) {
    if (id == null)
      return { error: 'Coin id not specified' };

    return await this.request(`/coins/${id}/history`, {
      date,
      localization: 'false',
    });
  }

  async request(url, query = {}) {
    try {
      const cacheRes = await this.getCache(url, query);
      if (cacheRes !== false)
        return cacheRes;

      const urlr = `${URL_ROOT}${url}?${stringify(query)}`;
      console.log('coingecko:', urlr);

      const response = await fetch(urlr);
      const json = await response.json();

      this.addCache(url, query, json);

      return json;
    } catch (e) {
      processError(e);
    }
  }
}
