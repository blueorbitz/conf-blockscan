import { fetch } from '@forge/api';
import { stringify } from 'query-string';
import cheerio from 'cheerio';
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

  async transaction(hash) {
    if (hash.slice(0, 2) !== '0x')
      hash = '0x' + hash;

    const path = `/tx/${hash}`;
    const urlr = `https://etherscan.io${path}`;

    const cacheRes = await this.getCache(path, {});
    if (cacheRes !== false)
      return cacheRes;

    console.log('etherscan:', urlr);
    const response = await fetch(urlr);
    const html = await response.text();
    const $ = cheerio.load(html);

    const data = {};
    const listItem = $('#ContentPlaceHolder1_maintable div.row');
    listItem.each((idx, el) => {
      const title = $(el).find('.col-md-3').text().slice(0, -1);
      switch (title) {
        case 'Transaction Hash':
          data[title] = $(el).find('.col-md-9 #spanTxHash').text();
          break;
        case 'Status':
          data[title] = $(el).find('.col-md-9 span').text();
          break;
        case 'From':
        case 'To':
          data[title] = $(el).find('.col-md-9').text()
            .trim()
            .replace($(el).find('.col-md-9 span').text(), '')
            .split(' ');
          break;
        case 'Interacted With (To)':
          data[title] = { transfers: [] };
          const transfers = $(el).find('.col-md-9 ul');
          if (transfers.html() == null)
            data[title].title = $(el).find('.col-md-9').text().trim()
              .replace($(el).find('.col-md-9 span#spanToAdd').text(), '');
          else
            data[title].title = 'Contract ' + transfers.siblings().text().trim()
              .replace($(el).find('#spanToAdd').text(), '');

          if (transfers.html()) {
            data[title].transfers = [];
            transfers.find('li').each((idx2, el2) => {
              data[title].transfers.push($(el2).text().trim());
            });
          }
          break;
        case 'Transaction Action':
          break;
        case 'Tokens Transferred':
          const sequence = [];
          $(el).find('.col-md-9 .media-body').children().each((idx2, el2) => {
            if ($(el2).children().first().is('a'))
              sequence.push({ href: $(el2).children().first().attr('href'), text: $(el2).text() });
            else
              sequence.push($(el2).text());
          });
          data[title] = sequence;
          break;
        case 'Value':
          data[title] = $(el).find('.col-md-9 span span').text();
          break;
      }
    });

    this.addCache(path, {}, data);

    return data;
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
