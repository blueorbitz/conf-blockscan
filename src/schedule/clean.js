import { buildRestOutput } from '../utils';

export default async () => {
  console.log('schedule clean', arguments);
  return buildRestOutput();
};