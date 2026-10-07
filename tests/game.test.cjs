const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements=new Map();const el=()=>({innerHTML:'',textContent:'',classList:{add(){},remove(){},toggle(){}},addEventListener(){},getContext(){return {}},setPointerCapture(){}});
const document={querySelector(s){if(!elements.has(s))elements.set(s,el());return elements.get(s)},querySelectorAll(){return []},addEventListener(){},hidden:false};
const sandbox={document,window:{addEventListener(){}},localStorage:{getItem(){return null},setItem(){}},performance:{now(){return 0}},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},console,assert};vm.createContext(sandbox);vm.runInContext(fs.readFileSync('dist/game.js','utf8'),sandbox);
vm.runInContext(`
S=fresh();S.volume=0;
assert.equal(S.chickens.length,3);assert.equal(capacity(),40);
assert.equal(tierFor(1,.99),0);assert.equal(tierFor(3,.5),1);assert.equal(tierFor(5,0),1);assert.equal(tierFor(12,.99),5);
for(let i=0;i<200;i++){const e=makeEgg(1);assert(e.damage>=1&&e.damage<=5)}
for(let t=0;t<55;t++){tick();for(const c of S.chickens){c.x=c.tx;c.y=c.ty}}
assert(S.nests.some(Boolean),'healthy hens must lay eggs');
S.nests.forEach((_,i)=>collect(i));assert(S.eggs.length>0,'eggs must collect');
S.eggs=Array.from({length:40},()=>({tier:0,damage:1}));S.nests[0]={tier:0,damage:1};collect(0);assert.equal(S.eggs.length,40);assert(S.nests[0]);
S=fresh();S.volume=0;S.eggs=[{tier:0,damage:1},{tier:0,damage:5}];view='mountain';rockIndex=0;paused=false;
interact({x:40,y:500});assert.equal(S.eggs.length,1);impact(shots.pop());assert.equal(S.rocks[0].hp,24);assert.equal(S.hits,0);
interact({x:550,y:330});impact(shots.pop());assert.equal(S.rocks[0].hp,19);assert.equal(S.hits,1);
impact({x:550,y:330,hit:true,ri:0,egg:{damage:100}});assert(S.rocks[0].broken);assert.equal(S.minerals.length,1);
S=fresh();S.volume=0;S.eggs=[{tier:2,damage:9}];incubate(2);assert.equal(S.eggs.length,0);assert.equal(S.incubators.length,1);
for(let t=0;t<90;t++){tick();for(const c of S.chickens){c.x=c.tx;c.y=c.ty}}assert.equal(S.chickens.length,4);assert.equal(S.chickens[3].level,4);
S=fresh();S.volume=0;S.chickens[0].sick=true;S.chickens[0].hp=20;heal(S.chickens[0]);assert.equal(S.meds,1);assert.equal(S.chickens[0].hp,100);assert.equal(S.chickens[0].sick,false);
S.chickens[0].sick=true;S.chickens[0].hp=.1;tick();assert.equal(S.chickens.length,2);
S.dirt=[{x:300,y:400,type:'poop'},{x:900,y:400,type:'weed'}];view='farm';mode='clean';interact({x:300,y:400});assert.equal(S.dirt.length,1);
S.coins=1000;buy('storage');assert.equal(capacity(),100);buy('farm');assert.equal(chickenCap(),16);
console.log('PASS: egg tiers, laying, capacity, miss/hit, reward, incubation, healing, death, cleaning, upgrades');
`,sandbox);
