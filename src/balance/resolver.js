import Resolver from '@forge/resolver';
import { storage } from '@forge/api';

const resolver = new Resolver();

resolver.define('get-all', ({ context }) => {
  return ['hello world'];
});

export default resolver.getDefinitions();
