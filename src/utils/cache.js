import md5 from 'md5';
import { stringify } from 'query-string';
import { storage, startsWith } from '@forge/api';

const KEY_LIMIT = 100; // from Atlassian document for storage
const VALUE_LIMIT = 32000; // from Atlassian document for storage
const EXPIRE_CACHE = 30 * 60 * 1000; // 30 minute expire

export const buildKey = (id, key) => `C#${id}#${md5(key)}`;

const byteSize = (obj) => new TextEncoder().encode(JSON.stringify(obj)).length;

export default class CacheRequest {
  constructor(id) {
    this.id = id;
    this.cacheWithQuery = true;
    this.doNotCache = false;

    this.getCache = this.getCache.bind(this);
    this.addCache = this.addCache.bind(this);
  }
  
  async addCache(url, query, response) {
    const { cacheWithQuery, id, doNotCache } = this;

    if (doNotCache)
      return;
    
    const urlKey = cacheWithQuery ? `${url}?${stringify(query)}` : url;
    const flag = await add(id, urlKey, response);

    if (flag)
      console.log('addCache', buildKey(id, urlKey), urlKey);
  }

  async getCache(url, query) {
    const { cacheWithQuery, id, doNotCache } = this;

    if (doNotCache)
      return false;

    const urlKey = cacheWithQuery ? `${url}?${stringify(query)}` : url;

    const invalid = await invalidCache(id, urlKey);
    if (invalid)
      return false;

    const obj = await get(id, urlKey);
    if (obj !== false)
      console.log('getCache', buildKey(id, urlKey), urlKey);

    return obj;
  }
}

async function add(id, key, value) {
  const storeKey = buildKey(id, key);
  const storeValue = { time: new Date().getTime(), value };

  if (byteSize(storeKey) > KEY_LIMIT || byteSize(storeValue) > VALUE_LIMIT)
    return false;

  await storage.set(storeKey, storeValue);
  return true;
}

async function get(id, key) {
  const storeKey = buildKey(id, key);
  if (byteSize(storeKey) > KEY_LIMIT)
    return false;

  const result = await storage.get(storeKey);
  return result == null ? false : result.value;
}

async function invalidCache(id, key) {
  const storeKey = buildKey(id, key);
  const result = await storage.get(storeKey);
  if (result == null)
    return false;
  
  const now = new Date().getTime();
  if ((now - result.time) < EXPIRE_CACHE)
    return false;

  console.log('invalidate cache:', storeKey);
  return true;
}

export async function retrieveCache(cursor) {
  let query = storage.query()
    .where('key', startsWith('C#'))
    .limit(10);

  if (cursor)
    query = query.cursor(cursor);

  return await query.getMany();
}