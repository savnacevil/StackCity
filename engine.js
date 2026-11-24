// StackCity life engine: stats, cast, stories, events, jobs, tabs, screen drawing. Shared by online and solo.

const C=window.STACKCITY,$=s=>document.querySelector(s),LS=localStorage;
const EM=['😎','🤠','🦊','🐸','👽','🤖','🧙','🦄'],COL=['#6c5ce7','#e17055','#00b894','#0984e3','#fd79a8','#fdcb6e','#d63031','#00cec9'];
let MODE='online',realSb,meReal,pendChal,sb,me,party,players=[],st,ch,ev,dq,tab,lastY=-1,flipping=false,rdyY=-1,emoji=+LS.emoji||0,seenC=new Set(),lastC=0,lastFlip=-1,claiming=0,hist=[],lastAdv=0,was=false;
const r=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),rnd=a=>a[Math.floor(Math.random()*a.length)],clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v)),money=n=>(n<0?'-$':'$')+Math.abs(Math.round(n)).toLocaleString();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const show=id=>document.querySelectorAll('section').forEach(s=>s.hidden=s.id!==id),warn=m=>{$('#banner').textContent=m;$('#banner').hidden=!m};
const run=q=>q.then(x=>{if(x&&x.error)warn(x.error.message);return x}),mine=()=>players.find(p=>p.user_id===me),key=()=>({party_id:party.id,user_id:me}),nm=()=>$('#name').value.trim().slice(0,20);
const jobList=()=>MODE==='solo'?[...JOBS,...COOL.filter(j=>META.un[j.id])]:JOBS;
const NN=()=>rnd([...NAMES.f,...NAMES.m]);
function tok(k){const c=st.cast;return c[k]&&c[k].n}
function fill(t){let ok=1;const o=t.replace(/\{(\w+)\}/g,(m,k)=>{const v=tok(k);if(!v)ok=0;return v||''});return ok?o:null}
const say2=t=>fill(t)||t.replace(/\{(\w+)\}/g,'a friend');
function fx(o){for(const k in o){const v=o[k];if(k==='job'){st.job=v;if(v&&v!=='Student')st.hadJob=true;if(!v||v==='Student'||v==='Retired')delete st.cast.boss}else if(k==='edu')st.edu=v;else if(k==='inc')st.inc=v;else if(k==='incd')st.inc+=v;else if(k==='m')st.m+=v;else st[k]=clamp(st[k]+v)}}
function birth(){const tier=(x=>x<20?0:x<50?1:x<80?2:x<95?3:4)(r(0,99)),tr=[];while(tr.length<2){const t=rnd(TALENTS);if(!tr.includes(t))tr.push(t)}
 st={age:-1,m:0,h:r(55,80),p:r(50,80),s:r(40,65),l:r(40,80),inc:0,job:null,edu:'',lic:false,car:false,tier,traits:tr.map(t=>t[0]),used:{},log:[],seen:[],cast:{mom:{n:rnd(NAMES.f),rel:'Mom',c:70}}};
 tr.forEach(t=>fx(t[1]));if(r(1,10)<=7)st.cast.dad={n:rnd(NAMES.m),rel:'Dad',c:60};for(let i=1,n=r(0,2);i<=n;i++)st.cast['sib'+i]={n:NN(),rel:'Sibling',c:50}}
const ensure=()=>{if(!st){const raw=LS['st'+party.id];if(raw){st=JSON.parse(raw);if(st.l===undefined)st.l=60}else birth()}};
const save=()=>{if(party&&st){LS['st'+party.id]=JSON.stringify(st);run(sb.from('player_private').upsert({...key(),state:st}))}};
const addLine=t=>{if(!st.log[0]||st.log[0].y!==st.age)st.log.unshift({y:st.age,lines:[]});st.log[0].lines.push(t);st.log.length=Math.min(st.log.length,40)};
function pub(){const w=st.m*(.7+Math.random()*.6),t=w<0?'in debt':w<5e3?'broke':w<5e4?'$':w<3e5?'$$':w<2e6?'$$$':'$$$$';run(sb.from('players').update({pub:{age:st.age,job:st.job||'Unemployed',wealth:t}}).match(key()))}
let tm;const commit=()=>{if(MODE==='solo')soloCheck();drawGame();clearTimeout(tm);tm=setTimeout(()=>{pub();save()},700)};
function pick(y){const ok=e=>y>=e.a[0]&&y<=e.a[1]&&!st.seen.includes(e.id)&&(!e.if||e.if(st));const must=EVENTS.filter(e=>e.must&&ok(e));if(must.length)return must[0];
 const pool=EVENTS.filter(e=>!e.must&&ok(e));return pool.length&&Math.random()<.8?rnd(pool):null}
function newYear(y){st.age=y;st.used={};dq=null;st.log.unshift({y,lines:[]});
 if(y===0){addLine(`👶 You were born to ${st.cast.mom.n}${st.cast.dad?' and '+st.cast.dad.n:' (a single-parent home)'}.`);addLine(`🏠 Family: ${TIERS[st.tier]}. Traits: ${st.traits.join(', ')}.`)}
 else{const kid=y<18,col=!kid&&st.job!=='Student'?12000:0;st.m+=st.inc-col;
  if(st.inc)addLine(`💼 Your ${st.job} gig paid ${money(st.inc)}.`);if(col)addLine(st.inc?`🏠 Living costs took ${money(col)}.`:`😬 Rent is due and you have no job. Try the Job tab.`);
  if(y>35)st.l=clamp(st.l-(y>55?2:1));if(y>45)st.h=clamp(st.h-Math.ceil((y-45)/12));const al=y>=8&&y<18?[0,100,300,800,3000][st.tier]:0;if(al){st.m+=al;if(y===8)addLine(`💵 ${st.cast.mom.n} started giving you an allowance.`)}}
 if(y>=5&&y<=17){st.cast.teacher={n:rnd(NAMES.t),rel:'Teacher',c:30};if(y===5){st.cast.bff={n:NN(),rel:'Best friend',c:60};addLine(`🏫 School starts! ${st.cast.teacher.n} is your teacher and you met ${st.cast.bff.n}.`)}}
 if(y===14)addLine("💼 You can get a part-time job now (Job tab).");if(y===16)addLine("🚗 You turned 16! Time for the driver's test (Do tab).");
 if(y===18){delete st.cast.teacher;addLine("🎓 You're an adult. Rent, taxes, and regret begin.");const g=[0,0,0,20000,150000][st.tier];if(g){st.m+=g;st.gift=1;addLine(`🎁 Your family gifted you ${money(g)}.`)}}
 if(y===21)addLine("🍸 Gambling is now legal for you. Poor decisions are now legal.");if(y===65)addLine("🧓 Retirement age. Your knees have opinions.");
 const w=party.world;if(w&&w.y===y&&WORLD[w.i]){const wf={...WORLD[w.i].fx};if(y<18)delete wf.m;fx(wf);addLine((WORLD[w.i].abs?'🛸 ':'🌍 ')+WORLD[w.i].t)}
 const pool=LINES.filter(l=>y>=l[0]&&y<=l[1]).map(l=>fill(l[2])).filter(Boolean);for(let i=r(2,3);i>0&&pool.length;i--)addLine(pool.splice(r(0,pool.length-1),1)[0]);
 ev=pick(y);st.ev=ev&&ev.id;if(ev)st.seen.push(ev.id);if(st.h<=0)die('poor health');commit()}
function pickChoice(i){const c=ev.c[i];let f=c[1],t=c[2];if(c[3]&&Math.random()<c[3][0]){f=c[3][1];t=c[3][2]}fx(f);addLine('🎲 '+say2(ev.t));addLine('→ '+c[0]+': '+say2(t));ev=null;st.ev=null;if(st.evq){ev=EVENTS.find(e=>e.id===st.evq)||null;st.evq=null;st.ev=ev&&ev.id}if(st.h<=0)die('poor health');commit()}
const news=t=>{if(party)run(sb.from('chat').insert({party_id:party.id,user_id:me,name:'📰',body:(LS.name||'Someone')+' '+t}))};
function die(c){if(st.dead)return;st.dead=true;st.cause=c;ev=null;st.ev=null;news('died ('+c+'). 💀');addLine('💀 You died ('+c+'). You are now a ghost.');run(sb.from('players').update({alive:false,ready:true}).match(key()))}
function apply(i){const x=jobList()[i];if(x.edu&&st.edu!==x.edu)addLine(`❌ ${x.t} needs ${x.edu==='college'?'a college degree':'trade school'}.`);
 else if((x.h&&st.h<x.h)||(x.l&&st.l<x.l))addLine(`❌ ${x.t} needs ${x.h?'Health '+x.h:'Looks '+x.l}+.`);else if(Math.random()*100<clamp(45+(st.s-x.s)*1.2+(st.l-50)*.2+(st.traits.some(t=>t.startsWith('Charming'))?10:0),5,90)){st.job=x.t;st.inc=x.inc;st.hadJob=true;st.cast.boss={n:NN(),rel:'Boss',c:40};addLine(`🎉 You got hired as a ${x.t}! Your boss is ${st.cast.boss.n}.`);news('got hired as a '+x.t+'. 💼')}
 else addLine(`😔 Your ${x.t} application was rejected. They "went with someone else."`);commit()}
const cst=x=>st.age<18&&x.id==='doc'?0:x.cost;
function doAct(id){const x=ACTS.find(a=>a.id===id);if(st.m<cst(x)||(x.once&&st.used[id]))return;st.m-=cst(x);st.used[id]=1;st.did=st.did||{};st.did[id]=(st.did[id]||0)+1;fx(x.fx||{});addLine(say2(x.say));
 if(x.win&&Math.random()<x.win[0]){st.m+=x.win[1];st.big=Math.max(st.big||0,x.win[1]);addLine('🎉 '+x.win[2]);if(x.win[1]>=1000)news('won '+money(x.win[1])+'! 🎰')}else if(x.win)fx({p:-2});if(x.risk&&Math.random()<x.risk[0]){fx(x.risk[1]);addLine('💥 '+x.risk[2])}commit()}
function startTest(){const c=st.age<18?0:50;if(st.m<c)return;st.m-=c;st.dtY=st.age;const q=rnd(DRIVE);dq={q:q[0],o:q[1].map((t,i)=>({t,ok:i===0})).sort(()=>Math.random()-.5)};renderSheet()}
function answer(i){const ok=dq.o[i].ok;dq=null;if(ok){st.lic=true;fx({p:10});news("passed the driver's test! 🪪");addLine(`🪪 You passed the driver's test! ${st.cast.dad?st.cast.dad.n:st.cast.mom.n} is "totally not nervous" about you driving.`)}else{fx({p:-3});news("failed the driver's test. 🚫");addLine("🚫 You failed the driver's test. The examiner sighed. Retry next year.")}commit()}
function renderSheet(){if($('#sheet').hidden)return;const b=$('#shb'),T={job:'💼 Job',assets:'🏠 Assets',rel:'❤️ People',act:'🎯 Do something'};$('#sht').textContent=T[tab];let h='';
 if(tab==='job'){const work=st.job&&!['Student','Retired'].includes(st.job);h=`<div class="card"><b>${st.job?esc(st.job):'Unemployed'}</b><div class="mut">${st.job?money(st.inc)+'/yr'+(st.cast.boss?' · Boss: '+esc(st.cast.boss.n):''):'No job, no income.'}</div>${work?'<button class="btn sm" data-q="1">Quit</button>':''}</div>`;
  if(!['Student','Retired'].includes(st.job))h+=jobList().map((x,i)=>st.age>=x.min?`<div class="card pl"><div><b>${x.t}</b><div class="mut">${money(x.inc)}/yr${x.edu?' · needs '+x.edu:''}${x.s?' · Smarts '+x.s+'+':''}</div></div><button class="btn sm" data-ap="${i}">Apply</button></div>`:'').join('')||'<p class="mut">Nobody is hiring kids under 14.</p>'}
 else if(tab==='assets')h=`<div class="card"><b>🪪 Driver's license</b><div class="mut">${st.lic?'Yes':'Not yet'}</div></div><div class="card pl"><div><b>🚗 Car</b><div class="mut">${st.car?'Owned':'None'}</div></div>${st.car?'<button class="btn sm" data-car="s">Sell (+$3,000)</button>':st.lic?'<button class="btn sm" data-car="b">Buy used ($6,000)</button>':'<span class="mut">Need a license</span>'}</div><div class="card"><b>🏦 Net worth: ${money(st.m+(st.car?3000:0))}</b><div class="mut">Family: ${TIERS[st.tier]}</div></div><div class="card"><b>🎯 Life goals</b>${[['🪪 Get your license',st.lic],['💼 Land a job',st.hadJob],['🎓 Finish school',st.edu&&st.job!=='Student'],['🚗 Own a car',st.car],['💰 Save $100,000',st.m>=1e5]].map(g=>`<div>${g[1]?'✅':'⬜'} ${g[0]}</div>`).join('')}</div>`;
 else if(tab==='rel')h=Object.entries(st.cast).map(([k,c])=>`<div class="card pl"><div><b>${esc(c.n)}</b><div class="mut">${c.rel}</div><div class="rb"><i style="width:${c.c}%"></i></div></div><button class="btn sm" data-sp="${k}" ${st.used['r'+k]?'disabled':''}>Spend time</button></div>`).join('');
 else if(dq)h=`<div class="card"><b>🚗 Driver's test</b><p>${esc(dq.q)}</p>${dq.o.map((o,i)=>`<button class="btn ch c${i}" data-an="${i}">${esc(o.t)}</button>`).join('')}</div>`;
 else{if(st.age>=16&&!st.lic)h+=`<div class="card pl"><div><b>🚗 Driver's test</b><div class="mut">${st.age<18?'Parents pay':'$50'} · one question</div></div><button class="btn sm" data-dt="1" ${st.dtY===st.age||st.m<(st.age<18?0:50)?'disabled':''}>Take it</button></div>`;
  h+=ACTS.filter(a=>st.age>=a.min).map(a=>`<div class="card pl"><div><b>${a.e} ${a.t}</b><div class="mut">${cst(a)?money(cst(a)):'Free'}${a.once?' · once a year':''}</div></div><button class="btn sm" data-a="${a.id}" ${st.m<cst(a)||(a.once&&st.used[a.id])?'disabled':''}>Go</button></div>`).join('')}
 b.innerHTML=h}
const open=t=>{tab=t;$('#sheet').hidden=false;renderSheet()},closeSheet=()=>{$('#sheet').hidden=true};
function drawGame(){if(!st)return;const m=mine();$('#hav').textContent=m?m.emoji:'🙂';$('#hname').textContent=st.dead?'👻 '+LS.name:LS.name;$('#hjob').textContent=st.age<0?'':(st.job||(st.age<5?'Baby':st.age<18?'Student':'Unemployed'));
 $('#agel').textContent='Age '+Math.max(0,st.age);$('#cash').textContent=money(st.m);$('#cash').style.color=st.m<0?'#ffd0d0':'#fff';
 $('#bars').innerHTML=[['❤️','h'],['😊','p'],['🧠','s'],['✨','l']].map(([l,k])=>`<div class="sb"><b>${l} ${st[k]}</b><div><i style="width:${st[k]}%;background:var(--${k})"></i></div></div>`).join('');
 $('#feed').innerHTML=st.log.map(x=>`<div class="yr"><h4>Age ${x.y}</h4>${x.lines.map(l=>`<p>${esc(l).replace(/\n/g,'<br>')}</p>`).join('')}</div>`).join('');
 const e=$('#evc');e.hidden=!ev;if(ev)e.innerHTML=`<p>${esc(say2(ev.t))}</p>`+ev.c.map((c,i)=>`<button class="btn ch c${i}" data-i="${i}">${esc(c[0])}</button>`).join('');renderSheet();draw()}
function tickYear(){if(st.dead)lastY=party.year;else{if(!ev&&st.ev)ev=EVENTS.find(e=>e.id===st.ev);if(party.year!==lastY){lastY=party.year;closeSheet();{for(let y=st.age+1;y<party.year&&!st.dead;y++){newYear(y);if(ev)pickChoice(0)}if(!st.dead&&(st.age!==party.year||!st.log.length))newYear(party.year)}}}save();drawGame()}
