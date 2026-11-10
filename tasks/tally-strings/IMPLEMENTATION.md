# Implementation Notes: tallyStrings

## Approach

1. **Validation & Boundary Defenses:**
   - Rejects non-objects and null inputs with `TypeError`.
   - Uses `types.isProxy(values)` from `node:util` to reject Proxies (including revoked Proxies).
   - Verifies input is a real Array with `Object.getPrototypeOf(values) === Array.prototype`, rejecting subclasses (e.g. `class A extends Array`), altered prototypes, and non-array objects.
   - Iterates using an index loop (`0 <= i < values.length`), intentionally avoiding array iterator methods that could be shadowed or overridden.
   - Validates dense array integrity using `Object.hasOwn(values, i)` at every index, correctly catching sparse holes even when inherited properties are set on `Array.prototype`.
   - Strictly enforces primitive string types using `typeof item === 'string'`, rejecting boxed objects (`new String()`), subclasses, and non-string values with `TypeError`.

2. **Counting & Preserving First-Seen Order:**
   - Employs a standard JavaScript `Map`, which preserves key insertion order according to specification.
   - Treats all string keys identically as ordinary values, properly handling empty strings (`""`), special keys (`"__proto__"`, `"constructor"`, `"toString"`), and lone surrogates without collision or prototype pollution.

3. **Freshness & Mutation Invariance:**
   - Returns a fresh outer array containing fresh `[key, count]` pairs.
   - Mutating return values or frozen inputs will not alter subsequent calls.
