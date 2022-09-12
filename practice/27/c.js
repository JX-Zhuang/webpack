import { COMMON_VAR } from './common';
console.log('c file', COMMON_VAR);
import('./c1').then(m => m.c1Func());
import('./c2').then(m => m.c2Func());