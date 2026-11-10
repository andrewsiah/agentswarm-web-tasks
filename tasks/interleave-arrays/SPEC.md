# Interleave two string arrays

Implement export function interleaveArrays(left, right) in interleave_arrays.mjs,
Node 22 standard library only.

left and right must each be a dense normal Array: prototype exactly
Array.prototype, not a Proxy (use types.isProxy from node:util; this includes
revoked proxies), and every index an own property. Reject subclasses, altered
prototypes, nonarrays and holes with exact TypeError. Every element must be a
primitive string; boxed String objects (also subclasses) and all other values
raise exact TypeError. Validate BOTH arrays completely before returning.

Return a fresh normal Array alternating left[0], right[0], left[1], right[1],
... When one array runs out, append the remaining elements of the other in
order. Strings are opaque: no trimming, normalization, sorting or case folding;
empty strings and lone surrogates are ordinary values.

Error messages are unconstrained. Never change input values or properties;
frozen arrays are supported. Ignore extra named array properties and never call
user-shadowed array methods or the input's iterator (use index loops). Index
properties are ordinary data properties. Independent calls return independent
mutable arrays, including for empty input.

Examples (arguments -> result); every one is checked:
- `([], []) -> []`
- `(['a', 'b'], ['x', 'y']) -> ['a', 'x', 'b', 'y']`
- `(['a', 'b', 'c'], ['x']) -> ['a', 'x', 'b', 'c']`
- `(['a'], ['x', 'y', 'z']) -> ['a', 'x', 'y', 'z']`
- `([], ['x', 'y']) -> ['x', 'y']`
- `(['a'], []) -> ['a']`
- `(['a', 'a'], ['a']) -> ['a', 'a', 'a']`
- `(['', ' '], ['A']) -> ['', 'A', ' ']`
- `(['\u00e9'], ['e\u0301']) -> ['\u00e9', 'e\u0301']`
- `(['\ud800'],['\udc00']) -> ['\ud800','\udc00']`
- `(['a'],[1]) -> TypeError`
- `([1],'x') -> TypeError`
- `(Array(1),[]) -> TypeError`
- `([new String('a')],[]) -> TypeError`
- `(new Proxy(['a'],{}),[]) -> TypeError`

Only edit interleave_arrays.mjs and optional IMPLEMENTATION.md in this task directory.
Quick run from the repository root (Node 22):
`node tasks/interleave-arrays/check.mjs --solution "$PWD/tasks/interleave-arrays/interleave_arrays.mjs"`
The issue supplies a separate trusted checker pin and offline Docker command.
A pass remains CHECK_PASS_UNVERIFIED until independent source/scope review.
