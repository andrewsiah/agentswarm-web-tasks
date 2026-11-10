import { types } from 'node:util';

/**
 * Tallies distinct string occurrences in first-seen order.
 *
 * @param {string[]} values - A dense normal array of primitive strings.
 * @returns {[string, number][]} A fresh array of [value, count] pairs ordered by first appearance.
 * @throws {TypeError} If values is not a dense normal Array, is a Proxy, has holes, or contains non-primitive strings.
 */
export function tallyStrings(values) {
  if (values === null || typeof values !== 'object') {
    throw new TypeError('Expected an array');
  }
  if (types.isProxy(values)) {
    throw new TypeError('Proxy not allowed');
  }
  if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype) {
    throw new TypeError('Expected a normal Array');
  }

  const len = values.length;
  if (typeof len !== 'number' || !Number.isInteger(len) || len < 0) {
    throw new TypeError('Invalid array length');
  }

  const map = new Map();

  for (let i = 0; i < len; i++) {
    if (!Object.hasOwn(values, i)) {
      throw new TypeError(`Sparse array or hole detected at index ${i}`);
    }
    const item = values[i];
    if (typeof item !== 'string') {
      throw new TypeError(`Element at index ${i} must be a primitive string`);
    }
    const count = map.get(item);
    if (count === undefined) {
      map.set(item, 1);
    } else {
      map.set(item, count + 1);
    }
  }

  const result = [];
  for (const [key, count] of map.entries()) {
    result.push([key, count]);
  }
  return result;
}
