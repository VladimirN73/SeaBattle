import { extend } from 'lodash';
import { base } from './environment.base';

export const environment = extend(base, {
  production: false,
  name: "dev"
});
