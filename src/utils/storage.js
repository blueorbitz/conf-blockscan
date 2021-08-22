import { storage, startsWith } from '@forge/api';
import { useProductContext } from '@forge/ui';

export async function addWallet(wallet) {
  const context = useProductContext();
  const spaceKey = context.spaceKey;
  const timestamp = new Date().getTime();
  const { type, name, platform, address, settings } = wallet;

  const key = `W#${spaceKey}#${type}#${platform}#${timestamp}`;
  return await storage.set(key, { key, type, name, platform, address, settings, timestamp, spaceKey });
}

export async function editWallet(wallet) {
  const timestamp = new Date().getTime();
  wallet.timestamp = timestamp;
  return await storage.set(wallet.key, wallet);
}

export async function removeWallet(wallet) {
  return await storage.delete(wallet.key);
}

export async function getAllWHash() {
  const context = useProductContext();
  const spaceKey = context.spaceKey;

  const results = await storage.query()
    .where('key', startsWith(`W#${spaceKey}#`))
    .limit(20)
    .getMany();
  
  return results.results;
}

export async function getWallets(search) {
  const context = useProductContext();
  const spaceKey = context.spaceKey;

  const results = await storage.query()
    .where('key', startsWith(search || `W#${spaceKey}#wallet`))
    .limit(20)
    .getMany();
  
  return results.results;
}

export async function getContracts() {
  const context = useProductContext();
  const spaceKey = context.spaceKey;

  const results = await storage.query()
    .where('key', startsWith(`W#${spaceKey}#contract`))
    .limit(20)
    .getMany();
  
  return results.results;
}

export async function getLastTransaction(walletKey) {
  return await storage.get(`TX#${walletKey}`);
}

export async function updateLastTransaction(walletKey, value) {
  return await storage.set(`TX#${walletKey}`, value);
}