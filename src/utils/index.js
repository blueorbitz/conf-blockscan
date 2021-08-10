import { storage } from '@forge/api';

export function isEmpty(str) {
  return str === '' || str == null;
}

export function processError(e) {
  console.error(e);
  if (e.error)
    return e;
  else
    return { error: e.message };
}

export async function parseCoinConfig(config) {
  let param = {};
  if (config.source === 'store' && config.wallet == null)
    return { error: 'Wallet key not found' };
  else if (config.source === 'store')
    param = await storage.get(config.wallet);

  return { ...config, ...param };
}
