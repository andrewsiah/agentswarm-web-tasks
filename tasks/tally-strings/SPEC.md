# Tally strings in first-seen order

Implement export function tallyStrings(values) in tally_strings.mjs, Node 22
standard library only.

values must be a dense normal Array: prototype exactly Array.prototype, not a
Proxy (use types.isProxy from node:util; this includes revoked proxies), and
every index an own property. Reject subclasses, altered prototypes, nonarrays
and holes with exact TypeError. Every element must be a primitive string; boxed
String objects (also subclasses) and all other values raise exact TypeError.

Return a fresh normal Array of fresh two-element normal Arrays [value, count],
one per distinct string, ordered by FIRST occurrence. count is a primitive
number. Compare with exact JS string equality: no trimming, normalization or
case folding. Every string is an ordinary key, including '', '__proto__',
'constructor' and lone surrogates (a Map works; a plain object does not).

Error messages are unconstrained. Never change input values or properties;
frozen arrays are supported. Ignore extra named array properties and never call
user-shadowed array methods or the input's iterator (use index loops). Index
properties are ordinary data properties. Independent calls return independent
mutable arrays, including for empty input.

Examples (arguments -> result); every one is checked:
- `([]) -> []`
- `(['a', 'b', 'a']) -> [['a', 2], ['b', 1]]`
- `(['b', 'a', 'b', 'b']) -> [['b', 3], ['a', 1]]`
- `(['A', 'a']) -> [['A', 1], ['a', 1]]`
- `(['', '']) -> [['', 2]]`
- `([' a', 'a']) -> [[' a', 1], ['a', 1]]`
- `(['\u00e9', 'e\u0301', '\u00e9']) -> [['\u00e9', 2], ['e\u0301', 1]]`
- `(['__proto__', 'constructor', '__proto__']) -> [['__proto__', 2], ['constructor', 1]]`
- `(['\ud800','\ud800','\udc00']) -> [['\ud800',2],['\udc00',1]]`
- `([1]) -> TypeError`
- `([new String('a')]) -> TypeError`
- `(Array(1)) -> TypeError`
- `('ab') -> TypeError`
- `(new Proxy(['a'],{})) -> TypeError`

Only edit tally_strings.mjs and optional IMPLEMENTATION.md in this task directory.
Quick run from the repository root (Node 22):
`node tasks/tally-strings/check.mjs --solution "$PWD/tasks/tally-strings/tally_strings.mjs"`
The issue supplies a separate trusted checker pin and offline Docker command.
A pass remains CHECK_PASS_UNVERIFIED until independent source/scope review.
