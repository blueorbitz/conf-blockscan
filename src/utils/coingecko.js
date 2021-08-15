import { fetch } from '@forge/api';
import { stringify } from 'query-string';
import { processError } from '.';

// implementation reference

const URL_ROOT = 'https://api.coingecko.com/api/v3';

export default class CoinGecko {
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
      const urlr = `${URL_ROOT}${url}?${stringify(query)}`;
      console.log('coingecko:', urlr);

      const response = await fetch(urlr);
      const json = await response.json();
      return json;
    } catch (e) {
      processError(e);
    }
  }
}
