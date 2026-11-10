# Running totals of safe integers

Implement export function runningTotal(values) in running_total.mjs, Node 22
standard library only.

values must be a dense normal Array: prototype exactly Array.prototype, not a
Proxy (use types.isProxy from node:util; this includes revoked proxies), and
every index an own property. Reject subclasses, altered prototypes, nonarrays
and holes with exact TypeError. Every element must be a primitive number; boxed
Number objects (also subclasses), strings, bigints and all other values raise
exact TypeError. Validate ALL types before numeric checks, so [1.5,'x'] raises
TypeError. Then every element must be a safe integer (Number.isSafeInteger),
otherwise exact RangeError (NaN, infinities, fractions, unsafe integers).

Return a fresh normal Array of the same length where element i is
values[0]+...+values[i]. Sums start from +0, so -0 inputs never produce -0
outputs. EVERY running total must also be a safe integer, otherwise exact
RangeError, even if a later total returns to the safe range.

Error messages are unconstrained. Never change input values or properties;
frozen arrays are supported. Ignore extra named array properties and never call
user-shadowed array methods or the input's iterator (use index loops). Index
properties are ordinary data properties. Independent calls return independent
mutable arrays, including for empty input.

Examples (arguments -> result); every one is checked:
- `([]) -> []`
- `([1, 2, 3]) -> [1, 3, 6]`
- `([5, -2, -3]) -> [5, 3, 0]`
- `([0, 0]) -> [0, 0]`
- `([-1, -1]) -> [-1, -2]`
- `([9007199254740991, -1]) -> [9007199254740991, 9007199254740990]`
- `([-9007199254740991, 9007199254740991]) -> [-9007199254740991, 0]`
- `([-0]) -> [0]`
- `([-0,-0]) -> [0,0]`
- `(['1']) -> TypeError`
- `([new Number(1)]) -> TypeError`
- `(Array(1)) -> TypeError`
- `([1.5]) -> RangeError`
- `([NaN]) -> RangeError`
- `([9007199254740991,1]) -> RangeError`
- `([9007199254740991,1,-1]) -> RangeError`
- `([1.5,'x']) -> TypeError`
- `(new Proxy([1],{})) -> TypeError`

Only edit running_total.mjs and optional IMPLEMENTATION.md in this task directory.
Quick run from the repository root (Node 22):
`node tasks/running-total/check.mjs --solution "$PWD/tasks/running-total/running_total.mjs"`
The issue supplies a separate trusted checker pin and offline Docker command.
A pass remains CHECK_PASS_UNVERIFIED until independent source/scope review.
