// Event library. a:[minAge,maxAge], must:1 = always fires, if:(state)=>bool.
// Choice = [label, effects, result text, optional twist [chance, effects, text]]. The FIRST choice is the safe auto-pick.
// Effects: m money, h health, p happiness, s smarts, inc yearly income, job title.
window.EVENTS=[
{id:"crayon",a:[1,4],t:"You eat a crayon in front of the whole daycare.",c:[["Spit it out",{p:-1},"Safe. The crayon was braver than you."],["Finish it",{p:4,h:-2},"Legend status. Teachers take notes."]]},
{id:"pudding",a:[5,9],t:"A second grader offers an 'investment opportunity': your pudding for 20% returns.",c:[["Eat the pudding",{p:3},"Delicious. Fiscally boring."],["Invest",{s:2,p:-2},"The market was cruel. So was he.",[0.3,{p:3,s:2},"He paid dividends. In stickers."]]]},
{id:"bee",a:[8,12],t:"Spelling bee finals. The word is 'embezzlement'.",c:[["Spell it phonetically",{s:1,p:1},"Close enough for a participation ribbon."],["Go for it",{s:4},"Nailed it. A future accountant is born.",[0.4,{p:-4},"You said 'embezzelment'. The crowd gasps."]]]},
{id:"candy",a:[10,14],t:"A friend dares you to swipe a candy bar.",c:[["Walk away",{p:-1,s:1},"Boring, but your record stays clean."],["Swipe it",{p:3},"Sweet victory.",[0.45,{p:-5,h:-1},"Caught. The cashier's stare ages you."]]]},
{id:"puberty",a:[13,16],t:"Puberty arrives like a folding chair to the face.",c:[["Hide in the library",{s:4,p:-2},"Smarter, but you now smell like old books."],["Embrace it",{p:3,s:-1},"Awkward. Confident. Mostly awkward."]]},
{id:"fries",a:[15,17],t:"The local burger joint offers you the fry station.",c:[["Decline",{p:2},"You keep your dignity and zero dollars."],["Take the job",{m:3000,inc:6000,h:-2,job:"Fry Cook"},"You smell like a deep fryer. You're rich-ish."]]},
{id:"path",must:1,a:[18,18],t:"Graduation! The real world asks: now what?",c:[["Straight to work",{inc:26000,job:"Retail Associate",p:2},"Paychecks begin. So do the sore feet."],["Trade school",{m:-5000,s:3,inc:30000,job:"Apprentice"},"Hands-on, debt-light, quietly smug."],["College",{m:-20000,s:10,inc:0,job:"Student"},"Student loans: the original subscription service."],["Start a hustle",{m:-8000,p:-5,inc:12000,job:"Failed Founder"},"Pitch deck: 40 slides. Customers: your mom.",[0.4,{inc:60000,job:"Entrepreneur",p:8},"It worked! Your parents tell everyone."]]]},
{id:"grad",must:1,a:[22,22],if:s=>s.job==="Student",t:"You graduate with a degree and an alarming amount of debt.",c:[["Take the corporate job",{inc:52000,job:"Analyst",s:2},"Business casual, forever."],["Backpack Europe first",{m:-6000,p:8,inc:38000,job:"Junior Associate"},"Zero regrets. Several blisters."]]},
{id:"rent",a:[19,30],t:"Your landlord raises the rent and also his voice.",c:[["Pay up",{m:-4000},"Money gone. Peace restored."],["Move home",{p:-4},"Free rent, plus commentary on your life."],["Argue",{p:-1},"You lose the argument.",[0.35,{p:4},"He backs down! Nobody is more shocked than you."]]]},
{id:"lunch",a:[22,45],t:"A coworker steals your lunch and your credit.",c:[["Let it go",{p:-3},"You are now the office pushover."],["Confront them",{p:2,s:1},"Awkward, but the lunch thefts stop."]]},
{id:"crypto",a:[20,45],t:"A 'friend' DMs you at 3am about a can't-miss coin.",c:[["Block them",{p:1},"Boring. Wise. Slightly smug."],["Invest $2,000",{m:-2000,p:-3},"The coin was named after a dog. The dog is fine. You're not.",[0.45,{m:4500,p:5},"To the moon! You tell everyone."]]]},
{id:"promo",a:[25,50],t:"The boss offers a promotion. The catch: more hours, fewer plants.",c:[["Decline",{p:2},"Plants thrive. Your bank account doesn't."],["Accept",{inc:9000,h:-4,p:-2},"Bigger title, bigger eye bags."]]},
{id:"car",a:[24,60],t:"Your car dies mid-commute. Dramatically.",c:[["Take the bus",{p:-3},"You meet three interesting people and one unforgettable smell."],["Repair it",{m:-3000},"The mechanic calls it 'a complicated relationship'."]]},
{id:"doc",a:[30,60],t:"Your doctor says 'we need to talk about your lifestyle'.",c:[["Change habits",{h:8,p:-3,m:-500},"Salad has entered your life. It's mixed."],["Ignore it",{h:-6,p:2},"Ignorance is bliss. And mild chest pain."]]},
{id:"midlife",a:[38,60],t:"Midlife crisis: convertible or therapy?",c:[["Therapy",{m:-3000,p:5,s:2},"You learn why you stress-buy. Useful."],["Convertible",{m:-20000,p:8},"Wind in your thinning hair."],["Neither",{p:-3},"You sigh heavily at a stoplight."]]},
{id:"audit",a:[35,80],t:"Surprise tax audit. They're very polite about it.",c:[["Cooperate",{m:-1500,p:-2},"Paperwork survived. Barely."],["Hire a lawyer",{m:-4000,s:1},"Billed in 6-minute increments. Worth it? Probably."]]},
{id:"retire",must:1,a:[62,90],t:"Retirement party! The cake is definitely not gluten-free.",c:[["Retire",{inc:24000,job:"Retired",p:6},"Golf. Naps. Opinions about the youth."],["Work till you drop",{p:-2,h:-3},"The office plants salute you."]]}
];
// Shared world events (host rolls these for the whole party). abs:1 = rare absurd tier.
window.WORLD=[
{t:"Recession! The economy trips over its own shoelaces.",fx:{m:-1500,p:-3}},
{t:"Tech boom: everyone suddenly 'works in AI'.",fx:{m:2500,p:2}},
{t:"Flu season hits everyone, including the vitamin guy.",fx:{h:-6}},
{t:"A UFO parks over downtown and asks for the manager.",fx:{p:4},abs:1},
{t:"Zombie outbreak! Gym memberships finally pay off.",fx:{h:-8,p:-4},abs:1}];
