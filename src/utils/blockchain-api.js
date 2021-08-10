import bcypher from './bcypher';

export default class BlockchainApi {
  static async GetAddressBalance(coin, network, address) {
    const bcapi = new bcypher(coin, network, process.env.TOKEN);

    const addrBal = await bcapi.getAddrBal(address, { omitWalletAddresses: true });
    return addrBal;
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
