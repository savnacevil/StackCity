// StackCity solo mode (works offline): menu, life flow, achievements, challenges, shop, life book.
const NOP=()=>{const o=new Proxy({},{get:(t,k)=>k==='then'?(f=>Promise.resolve({data:null,error:null}).then(f)):()=>o});return o};
const FAKE={from:NOP,rpc:NOP,channel:()=>({on(){return this},subscribe(){return this}}),removeChannel(){}},ME='solo-me';
const saveMeta=()=>{LS.meta=JSON.stringify(META)},avatars=()=>[...EM,...AVU.filter((e,i)=>META.un['av'+i])];
function toast(t){const e=$('#toast');e.textContent=t;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>{e.hidden=true},3200)}
function sub(t,h){show('s-sub');$('#subt').textContent=t;$('#subb').innerHTML=h}
function drawAv(){$('#semojis').innerHTML=avatars().map(e=>`<button class="em ${e===(LS.avatar||EM[0])?'on':''}" data-e="${e}">${e}</button>`).join('')}
function home(){if(MODE==='solo'&&st&&!st.ended)save();MODE='online';sb=realSb||null;me=meReal||null;party=st=ev=null;players=[];$('#gx').hidden=true;$('#chal').hidden=true;show('s-home')}
function startOnline(){MODE='online';sb=realSb||null;me=meReal||null;$('#gx').hidden=true;if(!realSb)init();else{show('s-lobby');lobby()}}
function soloMenu(){if(MODE==='solo'&&st&&!st.ended)save();MODE='solo';sb=FAKE;me=ME;party=st=ev=dq=null;$('#gx').hidden=true;$('#chal').hidden=true;$('#bub').hidden=true;$('#pan').hidden=true;
 const sv=LS.stsolo?JSON.parse(LS.stsolo):null;$('#s-cont').hidden=$('#s-ret').hidden=!(sv&&!sv.ended);$('#sname').value=LS.name||'';$('#lp').textContent=META.pts;drawAv();show('s-solo')}
function soloSetup(){MODE='solo';sb=FAKE;me=ME;party={id:'solo',host_id:ME,status:'playing',year:0,end_age:101,secs:0,world:{},deadline:null};
 players=[{user_id:ME,name:LS.name,emoji:LS.avatar||EM[0],color:'#0b8a80',alive:true,ready:false,pub:{}}];$('#bub').hidden=true;$('#gx').hidden=false;dq=null;closeSheet()}
function applyPerk(id){const P={p_genius:()=>fx({s:15}),p_looker:()=>fx({l:15}),p_iron:()=>fx({h:15}),p_lucky:()=>fx({p:10}),p_spoon:()=>{st.tier=Math.max(st.tier,3)},p_fund:()=>{st.tier=4}};if(P[id]){P[id]();st.perk=id}}
function startLife(chal,perk){LS.name=$('#sname').value.trim().slice(0,20)||LS.name||'You';soloSetup();birth();applyPerk(perk);st.chal=chal?{id:chal}:null;ev=null;show('s-game');newYear(0)}
function continueLife(){soloSetup();st=JSON.parse(LS.stsolo);if(st.l===undefined)st.l=60;party.year=st.age;ev=st.ev?EVENTS.find(e=>e.id===st.ev)||null:null;show('s-game');soloCheck();drawGame()}
function perkPick(chal){const have=SHOP.filter(i=>i.id[0]==='p'&&META.un[i.id]);pendChal=chal;if(!have.length)return startLife(chal,null);
 sub('Pick a perk',`<p class="mut">One perk per life.</p><button class="btn big ghost" data-pk="">No perk</button>`+have.map(i=>`<button class="btn big alt" data-pk="${i.id}">${i.n}<br><small>${i.d}</small></button>`).join(''))}
function soloAge(){if(!st||st.dead||st.ended||ev)return;const y=st.age+1;party.year=y;newYear(y);
 if(ev&&Math.random()<.5){const e2=pick(y);if(e2){st.evq=e2.id;st.seen.push(e2.id)}}if(y>=100&&!st.ended)soloEnd('old age')}
function soloCheck(){if(!st||st.ended)return;
 for(const a of ACH)if(!META.ach[a.id]&&a.t(st)){META.ach[a.id]=1;META.pts+=a.p;st.earned=(st.earned||0)+a.p;toast('🏆 '+a.n+' (+'+a.p+')');addLine('🏆 Achievement: '+a.n+' (+'+a.p+' Legacy Points)')}
 const c=st.chal&&CHAL.find(x=>x.id===st.chal.id);
 if(c&&!st.chal.done&&!st.chal.fail){if(c.w(st)){st.chal.done=1;META.pts+=c.p;st.earned=(st.earned||0)+c.p;META.cd[c.id]=1;toast('🎯 Challenge complete! +'+c.p);addLine('🎯 Challenge complete: '+c.n+' (+'+c.p+' Legacy Points)')}
  else if(st.age>c.by){st.chal.fail=1;addLine('💔 Challenge failed: '+c.n+'. Your life continues as free play.')}}
 $('#chal').hidden=!c;if(c)$('#chal').textContent='🎯 '+c.n+': '+c.d+(st.chal.done?' ✅':st.chal.fail?' ❌':' (by age '+c.by+')');
 saveMeta();if(st.dead)soloEnd(st.cause||'bad luck')}
function obitText(){const n=LS.name||'You',s2=st.m>2e5?'a very attentive tax lawyer':st.m>0?'a modest savings account and unresolved opinions':'creditors, who will attend';
 return `${n}, ${st.age}, ${st.dead?'died of '+st.cause:'walked into the sunset'}. Known as a ${(st.job||'free spirit').toLowerCase()} with ${st.h>70?'suspiciously good health':st.h>35?'average health':'a medical chart longer than a novel'}. Survived by ${s2}${st.cast.mom?', and a mother, '+st.cast.mom.n+', who "always knew"':''}.`}
function soloEnd(cause){if(st.ended)return;st.ended=1;clearTimeout(tm);const sc=score({m:st.m,h:st.h,p:st.p,s:st.s}),c=st.chal&&CHAL.find(x=>x.id===st.chal.id);META.lives++;
 const r={n:LS.name||'You',e:players[0].emoji,age:st.age,cause,job:st.job||'free spirit',m:Math.round(st.m),sc,earned:st.earned||0,ch:c?(st.chal.done?'✅ ':'❌ ')+c.n:'',obit:obitText()};
 BOOK.unshift(r);BOOK.length=Math.min(BOOK.length,30);LS.book=JSON.stringify(BOOK);saveMeta();delete LS.stsolo;$('#gx').hidden=true;$('#chal').hidden=true;
 sub('Life over',`<div class="card"><h3>🪦 ${esc(r.n)}, ${r.age}</h3><p>${esc(r.obit)}</p><b>Score ${r.sc}</b> · ${money(r.m)}<div class="mut">${r.ch?esc(r.ch)+' · ':''}Legacy Points earned this life: ${r.earned}</div></div><button class="btn big" data-go="new">New life</button><button class="btn big ghost" data-go="book">Life book</button><button class="btn big ghost" data-go="menu">Solo menu</button>`)}
function chalView(){sub('Challenges','<p class="mut">A goal on a random start. Fail and your life just continues as free play.</p>'+['Easy','Medium','Hard','Legendary'].map(t=>`<h3>${t}</h3>`+CHAL.filter(c=>c.tier===t).map(c=>c.lock?`<div class="card lock"><b>🔒 ${c.n}</b><div class="mut">Needs systems we haven't built yet</div></div>`:`<div class="card pl"><div><b>${META.cd[c.id]?'✅ ':''}${c.n}</b><div class="mut">${c.d} by age ${c.by} · ${c.p} pts</div></div><button class="btn sm" data-ch="${c.id}">Play</button></div>`).join('')).join(''))}
function shopView(){sub('Shop',`<div class="card"><b>⭐ ${META.pts} Legacy Points</b></div>`+['Avatar','Perk','Job'].map(k=>`<h3>${k}s</h3>`+SHOP.filter(i=>i.k===k).map(i=>`<div class="card pl"><div><b>${i.n}</b><div class="mut">${i.d||''}</div></div>${META.un[i.id]?'<span class="mut">Owned</span>':`<button class="btn sm" data-buy="${i.id}" ${META.pts<i.c?'disabled':''}>${i.c} pts</button>`}</div>`).join('')).join(''))}
function buy(id){const i=SHOP.find(x=>x.id===id);if(!i||META.un[id]||META.pts<i.c)return;META.pts-=i.c;META.un[id]=1;saveMeta();toast('Unlocked: '+i.n);shopView()}
function bookView(){sub('Life book',BOOK.length?BOOK.map(r=>`<div class="card"><b>${r.e} ${esc(r.n)}, ${r.age}</b> <span class="mut">· score ${r.sc} · ${money(r.m)} · ${esc(r.job)}</span><p>${esc(r.obit)}</p><div class="mut">${r.ch?esc(r.ch)+' · ':''}+${r.earned} pts</div></div>`).join(''):'<p class="mut">No lives yet. Go live one!</p>')}
function boot(){$('#go-online').onclick=startOnline;$('#go-solo').onclick=soloMenu;$('#l-home').onclick=home;$('#s-back').onclick=home;$('#subx').onclick=soloMenu;
 $('#s-new').onclick=()=>perkPick(null);$('#s-cont').onclick=continueLife;$('#s-ret').onclick=()=>{if(confirm('End your current life now?')){continueLife();soloEnd('retirement')}};
 $('#s-chal').onclick=chalView;$('#s-shop').onclick=shopView;$('#s-book').onclick=bookView;$('#gx').onclick=()=>{if(MODE==='solo'){save();soloMenu()}};
 $('#semojis').onclick=x=>{const e=x.target.dataset.e;if(e){LS.avatar=e;drawAv()}};
 $('#subb').onclick=e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.pk!==undefined)startLife(pendChal,d.pk||null);else if(d.ch)perkPick(d.ch);else if(d.buy)buy(d.buy);else if(d.go==='new')perkPick(null);else if(d.go==='menu')soloMenu();else if(d.go==='book')bookView()};
 if(LS.party)startOnline();else home()}
boot();
