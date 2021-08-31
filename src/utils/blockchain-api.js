import bcypher from './bcypher';
import etherscan from './etherscan';
import coingecko from './coingecko';
import opensea from './opensea';
import { eachRight } from 'lodash';

export default class BlockchainApi {
  static async GetCoinBalance(coin, network, address) {
    const bcapi = new bcypher(coin, network, process.env.TOKEN);
    return await bcapi.addressBalance(address, { omitWalletAddresses: true });
  }

  static async GetCoinTransaction(coin, network, address) {
    const bcapi = new bcypher(coin, network, process.env.TOKEN);
    return await bcapi.addressTransaction(address, {}, 'eth-full');
  }
  
  static async GetCoinTransactionLite(coin, network, address) {
    const bcapi = new bcypher(coin, network, process.env.TOKEN);
    return await bcapi.addressTransaction(address, { limit: 2 }, 'lite');
  }

  static async GetTransactionHash(coin, network, hash) {
    const bcapi = new bcypher(coin, network, process.env.TOKEN);
    return await bcapi.transactionHash(hash);
  }

  static async GetBlockHash(coin, network, hash) {
    const bcapi = new bcypher(coin, network, process.env.TOKEN);
    return await bcapi.blockHash(hash);
  }

  static async GetTokenBalance(platform, c_address, address) {
    const esapi = new etherscan();
    switch (platform) {
      case 'eth':
        return await esapi.tokenBalance(c_address, address);
      default:
        return { error: 'Platform not supported' };
    }
  };

  static async GetTokenTransaction(platform, address) {
    const esapi = new etherscan();
    switch (platform) {
      case 'eth':
        return await esapi.tokenTransaction(address);
      default:
        return { error: 'Platform not supported' };
    }
  }

  static async GetWebTransaction(hash) {
    const esapi = new etherscan();
    return await esapi.transaction(hash);
  }

  static async GetContractInfo(platform, c_address) {
    const cgapi = new coingecko();
    return await cgapi.contractInfo(platform, c_address);
  }

  static async GetSimplePrice(platform) {
    const cgapi = new coingecko();
    return await cgapi.simplePrice(platform);
  }

  static async GetCoinHistory(coin, date) {
    const cgapi = new coingecko();
    return await cgapi.coinHistory(coin, date);
  }

  static async GetNFTAsset(contract, tokenId) {
    const osapi = new opensea();
    return await osapi.singleAsset(contract, tokenId);
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

export function normalizeEthAddr(address) {
  if (address == null)
    return '';

  return address.slice(0, 2) === '0x'
    ? address.slice(2).toLowerCase()
    : address.toLowerCase();
}

export const converterList = [
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum' },
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
  { id: 'bitcoin-cash', symbol: 'bch', name: 'Bitcoin Cash' },
  { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin' },
  { id: 'cardano', symbol: 'ada', name: 'Cardano' },
  { id: 'binancecoin', symbol: 'bnb', name: 'Binance Coin' },
  { id: 'tether', symbol: 'usdt', name: 'Tether' },
  { id: 'litecoin', symbol: 'ltc', name: 'Litecoin' },
  { id: 'ripple', symbol: 'xrp', name: 'XRP' },
];
