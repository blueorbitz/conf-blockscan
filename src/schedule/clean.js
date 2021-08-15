import { storage } from '@forge/api';
import { buildRestOutput } from '../utils';
import { retrieveCache } from '../utils/cache';

const MAX_ITERATION = 10;
const EXPIRE_CACHE = 12 * 60 * 60 * 1000; // 12 hours of cache

export default async () => {
  console.log('schedule clean');

  try {
    let nextCursor, iteration;
    const now = new Date().getTime();

    do {
      const response = await retrieveCache(nextCursor);

      await Promise.all(response.results.map(obj => {
        const time = obj.value.time;
        if ((now - time) < EXPIRE_CACHE)
          return false; // still valid

        console.log('removing cache:', obj.key);
        return storage.delete(obj.key);
      }));

      nextCursor = response.nextCursor;
      iteration++;
    } while (nextCursor != null && iteration < MAX_ITERATION)

    return buildRestOutput(JSON.stringify({ iteration }));
  }
  catch (error) {
    console.error(error);
    return buildRestOutput('', 500, 'Internal Error');
  }
};