import { Memo } from './Memo.js';

export * from './Memo.js';

export function memoise(...args) {
    return new Memo(...args);
}