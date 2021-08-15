import { buildRestOutput } from '../utils';

export default async (req) => {
  console.log('schedule watch');
  return buildRestOutput();
};