import bcypher from './bcypher';

export default class BlockchainApi {
  static async GetAddressBalance(coin, network, address) {
    const bcapi = new bcypher(coin, network, process.env.TOKEN);

    const addrBal = await bcapi.getAddrBal(address, { omitWalletAddresses: true });
    return addrBal;
  }
}