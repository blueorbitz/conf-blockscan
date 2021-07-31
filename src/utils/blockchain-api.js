import Promise from 'bluebird';
import bcypher from 'blockcypher';

export default class BlockchainApi {
  static async GetAddressBalance(coin, network, address) {
    const bcapi = new bcypher(coin, network, process.env.TOKEN);

    const getAddrBalSync = Promise.promisify(bcapi.getAddrBal);
    const addrBal = { a: 1 }; //await getAddrBalSync(address, { omitWalletAddresses: true });

    return addrBal;
  }

}