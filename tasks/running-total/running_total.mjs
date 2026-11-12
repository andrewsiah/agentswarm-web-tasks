import { types } from 'node:util';

export function runningTotal(values) {
  // 1. Prevent fake arrays, subclasses, and proxies
  if (
    !values || 
    typeof values !== 'object' || 
    types.isProxy(values) || 
    !Array.isArray(values) || 
    Object.getPrototypeOf(values) !== Array.prototype
  ) {
    throw new TypeError("Input must be a dense normal Array");
  }

  const len = values.length;

  // 2. LOOP 1: Catch sparse arrays (holes) and validate data types (TypeError)
  // This must be done in a separate pass before any numeric operations
  for (let i = 0; i < len; i++) {
    // Check for sparse array holes (e.g., [1, , 3] or Array(1))
    if (!Object.hasOwn(values, i)) {
      throw new TypeError("Array must not have holes");
    }
    // Block strings, objects, bigints, boxed Numbers, etc.
    if (typeof values[i] !== 'number') {
      throw new TypeError("All elements must be primitive numbers");
    }
  }

  // Initialize a fresh array without using push() to avoid shadowed-method exploits
  const result = [];
  let sum = 0;

  // 3. LOOP 2: Check safe integer limits (RangeError) and compute sum
  for (let i = 0; i < len; i++) {
    const val = values[i];

    // Block fractions, NaN, Infinity, and out-of-bounds values
    if (!Number.isSafeInteger(val)) {
      throw new RangeError("Elements must be safe integers");
    }

    sum += val;

    // Check if the running total exceeds safe integer limits
    if (!Number.isSafeInteger(sum)) {
      throw new RangeError("Running total exceeds safe integer limits");
    }

    // Ensure -0 becomes +0 as per test requirements ([-0] -> [0])
    result[i] = sum === 0 ? 0 : sum;
  }

  return result;
}