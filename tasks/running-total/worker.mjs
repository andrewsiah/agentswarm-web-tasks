import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {types} from 'node:util';
const task="running-total";
const helper=(await import(pathToFileURL(process.argv[2])))["runningTotal"];
const cases=JSON.parse(readFileSync(new URL('./fixtures/cases.json',import.meta.url)));
function check(args,expected) {
 const before=structuredClone(args);
 const a=helper(...args),b=helper(...args);
 assert.deepEqual(a,expected);assert.deepEqual(b,expected);
 for(const r of [a,b]) {assert.equal(types.isProxy(r),false);assert.equal(Array.isArray(r),true);assert.equal(Object.getPrototypeOf(r),Array.prototype);}
 assert.notEqual(a,b);for(const x of args) assert.notEqual(a,x);
 if(task==='tally-strings') {
  for(let i=0;i<a.length;i++) {assert.equal(types.isProxy(a[i]),false);assert.equal(Object.getPrototypeOf(a[i]),Array.prototype);assert.notEqual(a[i],b[i]);assert.equal(typeof a[i][1],'number');}
  if(a.length) a[0].push('changed');
 }
 a.push('changed');assert.deepEqual(helper(...args),expected);
 assert.deepEqual(args,before,'input mutation');
}
const rejects=(args,ErrorType)=>assert.throws(()=>helper(...args),e=>e!==null && typeof e==='object' && e.constructor===ErrorType,String(args.length));
function inheritedHole(value,probe) {
 // A hole must be rejected even when Array.prototype supplies a value of the right type at that index.
 Object.defineProperty(Array.prototype,1,{value,configurable:true,writable:true});
 try {probe();} finally {delete Array.prototype[1];}
 assert.equal(Object.hasOwn(Array.prototype,1),false);
}
for(const row of cases) check(row.args,row.expected);
check([[-0]],[0]);
check([[-0,-0]],[0,0]);
rejects([['1']],TypeError);
rejects([[new Number(1)]],TypeError);
rejects([Array(1)],TypeError);
rejects([[1.5]],RangeError);
rejects([[NaN]],RangeError);
rejects([[9007199254740991,1]],RangeError);
rejects([[9007199254740991,1,-1]],RangeError);
rejects([[1.5,'x']],TypeError);
rejects([new Proxy([1],{})],TypeError);
class A extends Array {} class S extends String {} class N extends Number {}
const proxy=x=>new Proxy(x,{}),revoked=()=>{const p=Proxy.revocable([],{});p.revoke();return p.proxy;};
const badArrays=()=>[undefined,null,true,1,'ab',{},{length:0},new Set(),new A(),A.from(['a']),Object.setPrototypeOf([],null),Object.setPrototypeOf(['a'],Object.prototype),Array(1),['a',,'b'],proxy([]),proxy(['a']),revoked()];
const badStrings=[undefined,null,true,1,1n,Symbol('x'),[],['a'],{},new String('a'),new S('a'),proxy(new String('a'))];
const badNumbers=[undefined,null,true,'1','',1n,Symbol('x'),[],[1],{},new Number(1),new N(1),proxy(new Number(1))];
const shadowed=['slice','concat','map','forEach','filter','reduce','push','at','entries','keys','values','join','constructor'];
function shadow(values) {
 const copy=[...values];for(const name of shadowed) copy[name]=null;copy[Symbol.iterator]=null;copy.extra='ignored';return copy;
}
function unchangedShadow(copy,values) {
 for(const name of shadowed) assert.equal(copy[name],null);assert.equal(copy[Symbol.iterator],null);assert.equal(copy.extra,'ignored');
 assert.equal(copy.length,values.length);for(let i=0;i<values.length;i++) assert.ok(Object.is(copy[i],values[i]));
}
if(task==='interleave-arrays') {
 for(const v of badArrays()) {rejects([v,['x']],TypeError);rejects([['a'],v],TypeError);rejects([v,v],TypeError);}
 for(const v of badStrings) {rejects([[v],[]],TypeError);rejects([[],['x',v]],TypeError);rejects([['a',v],['x']],TypeError);}
 inheritedHole('p',()=>{rejects([['a',,'b'],[]],TypeError);rejects([[],['x',,'y']],TypeError);});
 rejects([['a','b'],[1]],TypeError);rejects([[1],'x'],TypeError);rejects([['a'],['b',new String('c')]],TypeError);
 const left=shadow(['a','b']),right=shadow(['x']);
 assert.deepEqual(helper(left,right),['a','x','b']);unchangedShadow(left,['a','b']);unchangedShadow(right,['x']);
 assert.deepEqual(helper(Object.freeze(['a']),Object.freeze(['b','c'])),['a','b','c']);
 const same=['a','b'];const r=helper(same,same);assert.deepEqual(r,['a','a','b','b']);assert.notEqual(r,same);assert.deepEqual(same,['a','b']);
 const big=Array.from({length:1000},(_,i)=>'v'+i);const out=helper(big,[]);assert.deepEqual(out,big);assert.notEqual(out,big);
 check([['a','c','e'],['b','d']],['a','b','c','d','e']);check([['x'],['y']],['x','y']);
} else if(task==='running-total') {
 for(const v of badArrays()) rejects([v],TypeError);
 for(const v of badNumbers) {rejects([[v]],TypeError);rejects([[1,v]],TypeError);rejects([[1.5,v]],TypeError);rejects([[9007199254740991,1,v]],TypeError);}
 for(const v of [NaN,Infinity,-Infinity,0.5,-1.5,2**53,-(2**53),Number.MAX_VALUE,Number.EPSILON]) {rejects([[v]],RangeError);rejects([[1,v]],RangeError);}
 inheritedHole(1,()=>{rejects([[1,,1]],TypeError);});
 rejects([[NaN,'x']],TypeError);
 for(const v of [[9007199254740991,1],[-9007199254740991,-1],[9007199254740991,1,-1],[4503599627370496,4503599627370496]]) rejects([v],RangeError);
 const values=shadow([1,2]);assert.deepEqual(helper(values),[1,3]);unchangedShadow(values,[1,2]);
 assert.deepEqual(helper(Object.freeze([2,-0,3])),[2,2,5]);
 for(const r of [helper([-0]),helper([0,-0]),helper([-0,0,-0])]) for(const x of r) assert.ok(Object.is(x,0),'positive zero required');
 const big=Array.from({length:1000},(_,i)=>i);const out=helper(big);assert.equal(out.length,1000);assert.equal(out[999],499500);
 check([[4503599627370495,4503599627370496]],[4503599627370495,9007199254740991]);check([[3,-3,3]],[3,0,3]);
} else {
 for(const v of badArrays()) rejects([v],TypeError);
 for(const v of badStrings) {rejects([[v]],TypeError);rejects([['a',v]],TypeError);rejects([['a','a',v]],TypeError);}
 inheritedHole('p',()=>{rejects([['a',,'b']],TypeError);});
 const values=shadow(['b','a','b']);assert.deepEqual(helper(values),[['b',2],['a',1]]);unchangedShadow(values,['b','a','b']);
 assert.deepEqual(helper(Object.freeze(['x','x'])),[['x',2]]);
 const keys=['__proto__','constructor','toString','hasOwnProperty','valueOf','0','length','prototype'];
 check([[...keys,...keys,'0']],keys.map(k=>[k,k==='0'?3:2]));
 const big=Array.from({length:1000},(_,i)=>i%2?'odd':'even');check([big],[['even',500],['odd',500]]);
 check([['a\u0000','a']],[['a\u0000',1],['a',1]]);
}
console.log(`PASS ${task}: ${cases.length} fixtures plus specials, exact types, proxies, subclasses, holes, frozen, shadowed-method and independence probes`);
