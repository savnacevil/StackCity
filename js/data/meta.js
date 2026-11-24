// Solo progress data: achievements, challenges, shop, cool jobs. META (points, unlocks) and BOOK (past lives) live in localStorage.
window.META=JSON.parse(localStorage.meta||'null')||{pts:0,ach:{},un:{},cd:{},lives:0};
window.BOOK=JSON.parse(localStorage.book||'[]');
window.AVU=['🦁','🐙','🤡','👑','🧛','🐉'];
window.ACH=[
{id:'job',n:'First Paycheck',p:10,t:s=>!!s.hadJob},{id:'lic',n:'Licensed to Drive',p:10,t:s=>s.lic},{id:'car',n:'Wheels',p:10,t:s=>s.car},
{id:'grad',n:'Cap and Gown',p:15,t:s=>!!s.edu&&s.job!=='Student'&&s.age>=22},{id:'brain',n:'Big Brain',p:20,t:s=>s.s>=95},
{id:'fit',n:'Fit as a Fiddle',p:15,t:s=>s.age>=30&&s.h>=95},{id:'looks',n:'Head Turner',p:15,t:s=>s.l>=90},
{id:'saver',n:'Rainy Day Fund',p:20,t:s=>s.m>=1e5},{id:'mil',n:'Millionaire',p:50,t:s=>s.m>=1e6},
{id:'broke',n:'Broke at 40',p:10,t:s=>s.age>=40&&s.m<0},{id:'happy',n:'Happy Camper',p:20,t:s=>s.age>=40&&s.p>=90},
{id:'s80',n:'Survivor',p:30,t:s=>s.age>=80},{id:'c100',n:'Centenarian',p:100,t:s=>s.age>=100},
{id:'duck',n:'Lucky Duck',p:25,t:s=>(s.big||0)>=2000},{id:'roller',n:'High Roller',p:15,t:s=>((s.did||{}).cas||0)>=3},
{id:'rat',n:'Gym Rat',p:15,t:s=>((s.did||{}).gym||0)>=10},{id:'nip',n:'Nip and Tuck',p:10,t:s=>!!(s.did||{}).surg},
{id:'boss',n:'Boss Energy',p:20,t:s=>s.job==='Entrepreneur'},{id:'gold',n:'Golden Years',p:15,t:s=>s.job==='Retired'},
{id:'rags',n:'Rags to Riches',p:60,t:s=>s.tier===0&&s.m>=1e6},{id:'seen',n:'Seen It All',p:20,t:s=>s.seen.length>=25},{id:'rip',n:'Rest in Peace',p:5,t:s=>!!s.dead}];
// Challenges: a goal on a random start. w = win test, by = deadline age. lock = needs systems not built yet.
window.CHAL=[
{id:'grand',tier:'Easy',n:'First Grand',d:'Have $10,000',by:25,p:10,w:s=>s.m>=1e4},{id:'lic17',tier:'Easy',n:'Licensed Early',d:'Pass the driver test',by:17,p:10,w:s=>s.lic},
{id:'sa',tier:'Easy',n:"Straight A's",d:'Smarts 90+',by:18,p:10,w:s=>s.s>=90},
{id:'mil40',tier:'Medium',n:'Millionaire by 40',d:'Have $1,000,000',by:40,p:30,w:s=>s.m>=1e6},{id:'earner',tier:'Medium',n:'Big Earner',d:'Hold a $90,000+ job',by:30,p:30,w:s=>s.inc>=9e4&&s.job!=='Student'},
{id:'camper',tier:'Medium',n:'Happy Camper',d:'Happiness 80+ at 40',by:45,p:30,w:s=>s.age>=40&&s.p>=80},
{id:'made',tier:'Hard',n:'Self-Made',d:'$1M with no family gift',by:35,p:75,w:s=>s.m>=1e6&&!s.gift},{id:'x2',tier:'Hard',n:'Mayor of StackCity',lock:1},{id:'x4',tier:'Hard',n:'Movie Star',lock:1},{id:'x5',tier:'Hard',n:'Prison Break',lock:1},
{id:'cent',tier:'Legendary',n:'Centenarian',d:'Live to 100',by:100,p:200,w:s=>s.age>=100},{id:'x1',tier:'Legendary',n:'Billionaire by 50',lock:1},{id:'x3',tier:'Legendary',n:'President by 60',lock:1}];
window.SHOP=[...AVU.map((e,i)=>({id:'av'+i,k:'Avatar',n:e,c:10})),
{id:'p_genius',k:'Perk',n:'Genius Gene',d:'+15 Smarts at birth',c:40},{id:'p_looker',k:'Perk',n:'Looker',d:'+15 Looks at birth',c:40},{id:'p_iron',k:'Perk',n:'Iron Constitution',d:'+15 Health at birth',c:40},
{id:'p_lucky',k:'Perk',n:'Lucky Charm',d:'+10 Happiness at birth',c:30},{id:'p_spoon',k:'Perk',n:'Silver Spoon',d:'Born into an upper-class family',c:90},{id:'p_fund',k:'Perk',n:'Trust Fund',d:'Born filthy rich',c:200},
{id:'j_pilot',k:'Job',n:'Pilot',d:'$120k, needs college',c:60},{id:'j_stunt',k:'Job',n:'Stunt Double',d:'$70k, needs Health 70',c:60},{id:'j_pro',k:'Job',n:'Pro Athlete',d:'$200k, needs Health 80',c:80},{id:'j_rock',k:'Job',n:'Rockstar',d:'$150k, needs Looks 70',c:80},
{id:'j_spy',k:'Job',n:'Spy',d:'$110k, needs college',c:100},{id:'j_surgeon',k:'Job',n:'Surgeon',d:'$220k, needs college',c:100},{id:'j_judge',k:'Job',n:'Judge',d:'$180k, needs college',c:120},{id:'j_astro',k:'Job',n:'Astronaut',d:'$140k, needs college',c:150},{id:'j_ceo',k:'Job',n:'CEO',d:'$300k, needs college',c:150}];
window.COOL=[{id:'j_pilot',t:'Pilot',min:24,inc:120000,s:65,edu:'college'},{id:'j_stunt',t:'Stunt Double',min:18,inc:70000,s:0,h:70},{id:'j_pro',t:'Pro Athlete',min:18,inc:200000,s:0,h:80},{id:'j_rock',t:'Rockstar',min:18,inc:150000,s:0,l:70},
{id:'j_spy',t:'Spy',min:24,inc:110000,s:70,edu:'college'},{id:'j_surgeon',t:'Surgeon',min:28,inc:220000,s:85,edu:'college'},{id:'j_judge',t:'Judge',min:32,inc:180000,s:80,edu:'college'},{id:'j_astro',t:'Astronaut',min:28,inc:140000,s:85,edu:'college'},{id:'j_ceo',t:'CEO',min:30,inc:300000,s:80,edu:'college'}];
