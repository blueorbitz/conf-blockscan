import Resolver from '@forge/resolver';
import { useConfig } from '@forge/ui';
import { defaultConfig } from './constant';
import BlockAPI from '../utils/blockchain-api';

const resolver = new Resolver();

resolver.define('get-all', ({ context }) => {
  return ['hello world'];
});

resolver.define('get-balance', async ({ context }) => {
  const config = useConfig() || defaultConfig;
  try {
    return await BlockAPI.GetAddressBalance(config.coin, config.network, config.address);
  } catch(e) {
    console.error(e);
    return null;
  }
});

export default resolver.getDefinitions();
