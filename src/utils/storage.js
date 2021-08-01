import { storage, startsWith } from '@forge/api';
import { useProductContext } from '@forge/ui';

export async function addWallet(wallet) {
  const context = useProductContext();
  const spaceKey = context.spaceKey;
  const timestamp = new Date().getTime();
  const { coin, network, address, name } = wallet;

  const key = `W#${spaceKey}#${coin}#${timestamp}`;
  return await storage.set(key, { key, name, coin, network, address, timestamp, spaceKey });
}

export async function editWallet(wallet) {
  const timestamp = new Date().getTime();
  wallet.timestamp = timestamp;
  return await storage.set(wallet.key, wallet);
}

export async function removeWallet(wallet) {
  return await storage.delete(wallet.key);
}

export async function getWallets() {
  const context = useProductContext();
  const spaceKey = context.spaceKey;

  const results = await storage.query()
    .where('key', startsWith(`W#${spaceKey}#`))
    .limit(20)
    .getMany();
  
  return results.results;
}