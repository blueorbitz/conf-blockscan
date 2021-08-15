import { storage, startsWith } from '@forge/api';
import { useProductContext } from '@forge/ui';

export async function addWallet(wallet) {
  const context = useProductContext();
  const spaceKey = context.spaceKey;
  const timestamp = new Date().getTime();
  const { type, name, platform, address } = wallet;

  const key = `W#${spaceKey}#${type}#${platform}#${timestamp}`;
  return await storage.set(key, { key, type, name, platform, address, timestamp, spaceKey });
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

export async function getWallets() {
  const context = useProductContext();
  const spaceKey = context.spaceKey;

  const results = await storage.query()
    .where('key', startsWith(`W#${spaceKey}#wallet`))
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
