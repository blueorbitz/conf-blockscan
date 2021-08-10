import bcypher from './bcypher';
import etherscan from './etherscan';
import coingecko from './coingecko';
import { eachRight } from 'lodash';

export default class BlockchainApi {
  static async GetCoinBalance(coin, network, address) {
    const bcapi = new bcypher(coin, network, process.env.TOKEN);

    const addrBal = await bcapi.getAddrBal(address, { omitWalletAddresses: true });
    return addrBal;
  }

  static async GetTokenBalance(platform, c_address, address) {
    const esapi = new etherscan();
    switch (platform) {
      case 'eth':
        return await esapi.tokenBalance(c_address, address);
      default:
        return { error: 'Platform not supported'};
    }
  };

  static async GetContractInfo(platform, c_address) {
    const cgapi = new coingecko();
    return await cgapi.contractInfo(platform, c_address);
  }

  static async GetSimplePrice(platform) {
    const cgapi = new coingecko();
    return await cgapi.simplePrice(platform);
  }
}

export const supportedCoins = [
  { name: 'Bitcoin', value: 'btc' },
  { name: 'Ethereum', value: 'eth' },
  { name: 'Doge', value: 'doge' },
];

export function satoshiToBtc(value) {
  return value / 100000000;
}

export function gweiToEth(value) {
  return value / 1000000000000000000;
}

export function toReadableFiat(value) {
  return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}