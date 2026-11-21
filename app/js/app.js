(function(){
"use strict";
/* ================= icons ================= */
const I = {
  today:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  week:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4M8 13h2M14 13h2M8 17h2"/></svg>',
  work:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2.5zM19 19v3H6.5"/><path d="M9 8h6M9 12h4"/></svg>',
  bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10.3 21a1.9 1.9 0 0 0 3.4 0"/></svg>',
  link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  warn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/></svg>',
  bag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 8h12l1 13H5zM9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/></svg>',
  chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h7M8.5 14.5h4"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
};

/* ================= reference data ================= */
const SUBJ = {
  maths:{n:'Mathématiques',c:'var(--m-maths)',mat:'Calculatrice'},
  fr:{n:'Français',c:'var(--m-fr)',mat:'« Les Fleurs du mal »'},
  hist:{n:'Histoire-géo',c:'var(--m-hist)',mat:'Manuel + atlas'},
  svt:{n:'SVT',c:'var(--m-svt)',mat:'Blouse'},
  ang:{n:'Anglais',c:'var(--m-ang)',mat:'Workbook'},
  pc:{n:'Physique-chimie',c:'var(--m-pc)',mat:'Blouse + calculatrice'},
  esp:{n:'Espagnol',c:'var(--m-esp)',mat:'Cahier d\'espagnol'},
  eps:{n:'EPS',c:'var(--m-eps)',mat:'Tenue de sport'}
};
const KIND = {sport:{n:'Sport',c:'var(--k-sport)'},rdv:{n:'Rendez-vous',c:'var(--k-rdv)'},famille:{n:'Famille',c:'var(--k-famille)'},perso:{n:'Perso',c:'var(--k-perso)'}};
const SRC = {pronote:'PRONOTE',google:'Google Agenda',outlook:'Outlook',ics:'Fichier ICS',manual:'Ajout manuel'};
const TYPE = {devoir:'Devoir',examen:'Contrôle',lecon:'Leçon'};
const TPL = {
  1:[['08:00','10:00','maths','B204'],['10:15','12:15','fr','A102'],['13:30','15:30','hist','C011'],['15:30','16:30','ang','B110']],
  2:[['08:00','09:00','svt','Labo 2'],['09:00','11:00','pc','Labo 1'],['11:00','12:00','esp','A207'],['14:00','16:00','eps','Gymnase']],
  3:[['08:00','10:00','fr','A102'],['10:15','12:15','maths','B204']],
  4:[['08:00','09:00','ang','B110'],['09:00','11:00','hist','C011'],['13:30','15:30','svt','Labo 2'],['15:30','17:30','pc','Labo 1']],
  5:[['08:00','10:00','maths','B204'],['10:15','11:15','esp','A207'],['11:15','12:15','fr','A102'],['13:30','15:30','ang','B110']]
};
const JOURS = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
const MOIS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];

/* ================= date helpers ================= */
const day0 = d => { const x=new Date(d); x.setHours(0,0,0,0); return x; };
const addDays = (d,n) => { const x=new Date(d); x.setDate(x.getDate()+n); return x; };
const key = d => d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const parseKey = k => { const [y,m,dd]=k.split('-').map(Number); return new Date(y,m-1,dd); };
const TODAY = day0(new Date());
const daysUntil = k => Math.round((parseKey(k)-TODAY)/864e5);
const toMin = s => { const [h,m]=s.split(':').map(Number); return h*60+m; };
const hm = m => Math.floor(m/60)+'h'+String(m%60).padStart(2,'0');
const hhmm = m => String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
const dur = m => m<60 ? m+' min' : (Math.floor(m/60)+' h'+(m%60?' '+String(m%60).padStart(2,'0'):''));
const longDate = d => JOURS[d.getDay()]+' '+d.getDate()+' '+MOIS[d.getMonth()];
const cap = s => s.charAt(0).toUpperCase()+s.slice(1);
const relDay = k => { const n=daysUntil(k); return n===0?'aujourd\'hui':n===1?'demain':n===-1?'hier':n<0?'il y a '+(-n)+' j':longDate(parseKey(k)); };
const schoolDay = d => { const w=d.getDay(); return w===6?addDays(d,2):w===0?addDays(d,1):d; };
const nextDow = (dow,from=TODAY) => addDays(from,(dow-from.getDay()+7)%7);
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = () => Math.random().toString(36).slice(2,9);

/* ================= state ================= */
function sample(){
  const sd = n => key(schoolDay(addDays(TODAY,n)));
  const thu = key(nextDow(4));
  return {
    v:3, chat:[], aiFallback:true, pronoteUser:'', pronoteUrl:'',
    mods:[{date:thu,start:'15:30',note:'Professeur absent'}],
    events:[
      {id:'e1',title:'Entraînement basket',kind:'sport',dow:3,start:'14:30',end:'16:30',travel:20,src:'google'},
      {id:'e2',title:'Match basket (U17)',kind:'sport',dow:6,start:'10:00',end:'11:30',travel:25,src:'google'},
      {id:'e3',title:'Cours de piano',kind:'perso',dow:4,start:'18:00',end:'19:00',travel:15,src:'manual'},
      {id:'e4',title:'Orthodontiste',kind:'rdv',date:thu,start:'18:30',end:'19:15',travel:20,src:'outlook'},
      {id:'e5',title:'Déjeuner chez mamie',kind:'famille',date:key(nextDow(0)),start:'12:00',end:'16:00',travel:30,src:'google'}
    ],
    tasks:[
      {id:'t1',type:'devoir',subj:'maths',title:'Exercices 12 à 15 p. 84 (fonctions affines)',due:sd(1),est:40,imp:2,src:'pronote',doneMin:0,done:false},
      {id:'t2',type:'examen',subj:'pc',title:'Contrôle : ondes et signaux',due:sd(2),est:120,imp:3,coef:2,src:'pronote',doneMin:30,done:false},
      {id:'t3',type:'lecon',subj:'hist',title:'Apprendre : la guerre froide (1947-1962)',due:sd(3),est:35,imp:1,src:'pronote',doneMin:0,done:false},
      {id:'t4',type:'devoir',subj:'fr',title:'Plan détaillé du commentaire, poème « L\'Albatros »',due:sd(4),est:90,imp:3,src:'pronote',doneMin:0,done:false},
      {id:'t5',type:'devoir',subj:'svt',title:'DM : la cellule, schéma légendé',due:sd(5),est:60,imp:2,src:'pronote',doneMin:0,done:false},
      {id:'t6',type:'examen',subj:'ang',title:'Oral : présenter un fait d\'actualité',due:sd(7),est:90,imp:2,coef:1,src:'manual',doneMin:0,done:false},
      {id:'t7',type:'lecon',subj:'esp',title:'Vocabulaire : la ciudad',due:sd(0),est:20,imp:1,src:'pronote',doneMin:20,done:true}
    ],
    log:[],
    grades:[{subj:'maths',v:14.5},{subj:'fr',v:12},{subj:'pc',v:11},{subj:'hist',v:15},{subj:'ang',v:16},{subj:'svt',v:13.5}],
    sources:{pronote:false,google:true,outlook:true,ics:false}, pronoteReal:false,
    syncLog:['Google Agenda : 3 événements, 1 doublon ignoré','PRONOTE (export iCal) : 21 cours, 1 cours annulé','Outlook : 1 rendez-vous ajouté'],
    set:{
      channel:{urgent:'push',important:'push',normal:'digest'},
      revOffsets:[7,3,1],
      digest:'07:15', evening:'19:00', bag:'20:30',
      quietStart:'22:00', quietEnd:'07:00',
      sessionAlert:true, sound:true, maxDaily:120, chunk:40
    }
  };
}
let S;
try{ const raw=localStorage.getItem('mlp-state'); S = raw?JSON.parse(raw):null; if(!S||S.v!==3) S=null; }catch(e){ S=null; }
if(!S) S = sample();
S.sources.pronote=!!S.pronoteReal;
if(S.extraSubj) Object.assign(SUBJ,S.extraSubj);
function save(){ try{ localStorage.setItem('mlp-state',JSON.stringify(S)); }catch(e){} }

/* ================= domain ================= */
function coursesFor(d){
  const k=key(d), w=d.getDay();
  if(S.pronoteReal&&Array.isArray(S.lessons)) return S.lessons.filter(l=>l.date===k).sort((a,b)=>a.start.localeCompare(b.start)).map(l=>{ const sj=SUBJ[l.subj]||{n:'Cours',c:'var(--k-work)'}; return {kind:'cours',s:toMin(l.start),e:toMin(l.end),subj:l.subj,room:l.room,cancel:!!l.cancel,note:l.note,c:sj.c,title:sj.n}; });
  return (TPL[w]||[]).map(([s,e,subj,room])=>{
    const mod=S.mods.find(m=>m.date===k&&m.start===s);
    return {kind:'cours',s:toMin(s),e:toMin(e),subj,room,cancel:!!mod,note:mod&&mod.note,c:SUBJ[subj].c,title:SUBJ[subj].n};
  });
}
function eventsFor(d){
  const k=key(d), w=d.getDay();
  return S.events.filter(ev=>ev.date===k||(ev.dow!==undefined&&ev.dow===w&&!ev.date)).map(ev=>({kind:'event',id:ev.id,s:toMin(ev.start),e:toMin(ev.end),travel:ev.travel||0,title:ev.title,k:ev.kind,src:ev.src,c:(KIND[ev.kind]||KIND.perso).c}));
}
function conflictsFor(d){
  const items=[...coursesFor(d).filter(c=>!c.cancel),...eventsFor(d)].sort((a,b)=>a.s-b.s);
  const out=[];
  for(let i=0;i<items.length;i++) for(let j=i+1;j<items.length;j++){
    if(items[j].s<items[i].e) out.push([items[i],items[j]]);
  }
  return out;
}
function prio(t){
  const d=daysUntil(t.due);
  let s=t.imp*12+(t.type==='examen'?8:0)+Math.max(0,30-d*5);
  if(d<=1) s+=20;
  const level = (d<=1||s>=55)?'urgent':s>=38?'important':'normal';
  return {score:s,level,d};
}
const PLABEL={urgent:'Urgent',important:'Important',normal:'Normal'};
function windowsFor(d){
  const w=d.getDay();
  if(w===0||w===6) return [[toMin('09:30'),toMin('12:00')],[toMin('14:00'),toMin('19:00')]];
  const cs=coursesFor(d).filter(c=>!c.cancel);
  const last=cs.length?Math.max(...cs.map(c=>c.e)):toMin('08:00');
  const start=Math.max(last+45, last<=toMin('12:30')?toMin('13:45'):toMin('16:45'));
  return [[start,toMin('19:30')],[toMin('20:15'),toMin('21:30')]];
}
function freeSlots(d,extraBusy){
  const busy=[...coursesFor(d).filter(c=>!c.cancel).map(c=>[c.s,c.e]),...eventsFor(d).map(e=>[e.s-e.travel,e.e+e.travel]),...(extraBusy||[])].sort((a,b)=>a[0]-b[0]);
  const out=[];
  for(const [ws,we] of windowsFor(d)){
    let cur=ws;
    for(const [bs,be] of busy){ if(be<=cur||bs>=we) continue; if(bs>cur) out.push([cur,Math.min(bs,we)]); cur=Math.max(cur,be); }
    if(cur<we) out.push([cur,we]);
  }
  return out.filter(([a,b])=>b-a>=15);
}
const HORIZON=9;
let PLAN={}, SHORT=[];
function buildPlan(){
  PLAN={}; SHORT=[];
  const days=[...Array(HORIZON)].map((_,i)=>addDays(TODAY,i));
  const free={}, load={};
  for(const d of days){
    const k=key(d);
    const logBusy=S.log.filter(l=>l.date===k).map(l=>[l.s,l.e]);
    free[k]=freeSlots(d,logBusy); load[k]=logBusy.reduce((a,[s,e])=>a+e-s,0); PLAN[k]=[];
  }
  const capFor=d=>{const w=d.getDay(); return Math.round(S.set.maxDaily*((w===0||w===6)?1.4:1));};
  const pending=S.tasks.filter(t=>!t.done).map(t=>({t,p:prio(t)})).sort((a,b)=>b.p.score-a.p.score);
  for(const {t,p} of pending){
    let remaining=Math.max(0,t.est-t.doneMin);
    if(!remaining) continue;
    const due=parseKey(t.due);
    let cand=days.filter(d=>d<due);
    if(t.type==='examen'){
      const pref=S.set.revOffsets.map(o=>key(addDays(due,-o)));
      cand=[...cand.filter(d=>pref.includes(key(d))).sort((a,b)=>b-a),...cand.filter(d=>!pref.includes(key(d))).sort((a,b)=>b-a)];
    }
    const chunk=S.set.chunk;
    let guard=0;
    while(remaining>0&&guard++<40){
      let placed=false;
      for(const d of cand){
        const k=key(d);
        const room=capFor(d)-load[k];
        if(room<20) continue;
        const slots=free[k];
        const idx=slots.findIndex(([a,b])=>b-a>=20);
        if(idx<0) continue;
        const [a,b]=slots[idx];
        const len=Math.min(chunk,remaining,b-a,room);
        if(len<15) continue;
        PLAN[k].push({kind:'session',taskId:t.id,s:a,e:a+len,c:SUBJ[t.subj].c,title:(t.type==='examen'?'Révision · ':'')+SUBJ[t.subj].n,sub:t.title,level:p.level});
        remaining-=len; load[k]+=len;
        const ns=a+len+10; if(ns<b) slots[idx]=[ns,b]; else slots.splice(idx,1);
        placed=true;
        if(t.type==='examen'){ cand=[...cand.filter(x=>x!==d),d]; } // spread revisions over several days
        break;
      }
      if(!placed) break;
    }
    if(remaining>15) SHORT.push({t,remaining});
  }
  for(const k in PLAN) PLAN[k].sort((a,b)=>a.s-b.s);
}
function dayItems(d){
  const k=key(d);
  const done=S.log.filter(l=>l.date===k).map(l=>{const t=S.tasks.find(x=>x.id===l.taskId);return {kind:'session',done:true,taskId:l.taskId,s:l.s,e:l.e,c:t?SUBJ[t.subj].c:'var(--k-work)',title:t?SUBJ[t.subj].n:'Séance',sub:t?t.title:'',logId:l.id};});
  return [...coursesFor(d),...eventsFor(d),...(PLAN[k]||[]),...done].sort((a,b)=>a.s-b.s);
}
function freeMinutes(d){ return freeSlots(d).reduce((a,[s,e])=>a+e-s,0); }

/* ================= reminders ================= */
function inQuiet(m){ const qs=toMin(S.set.quietStart), qe=toMin(S.set.quietEnd); return qs>qe ? (m>=qs||m<qe) : (m>=qs&&m<qe); }
function reminders(){
  const out=[];
  const add=(dateK,min,level,icon,c,title,body)=>{
    if(daysUntil(dateK)<0) return;
    const ch=S.set.channel[level];
    if(ch==='off') return;
    let shifted=false;
    if(inQuiet(min)){ min=toMin(S.set.quietEnd); shifted=true; }
    out.push({dateK,min,level,icon,c,title,body,ch,shifted});
  };
  for(const t of S.tasks.filter(t=>!t.done)){
    const p=prio(t), due=parseKey(t.due), subj=SUBJ[t.subj];
    if(t.type==='examen'){
      for(const o of S.set.revOffsets){ if(daysUntil(t.due)>=o) add(key(addDays(due,-o)),toMin(S.set.digest),o<=1?'urgent':p.level,'book',subj.c,`Révision J-${o} · ${subj.n}`,`${t.title}. ${o===1?'Dernière révision : refais les exercices types.':'Séance prévue dans ton planning.'}`); }
    } else {
      add(key(addDays(due,-1)),toMin(S.set.evening),p.level,'work',subj.c,`Pour ${relDay(t.due)==='demain'?'demain':longDate(due)} · ${subj.n}`,t.title);
    }
  }
  for(let i=0;i<4;i++){
    const d=schoolDay(addDays(TODAY,i+1)); const prev=addDays(d,-1);
    if(i>0&&key(d)===key(schoolDay(addDays(TODAY,i)))) continue;
    const mats=[...new Set(coursesFor(d).filter(c=>!c.cancel).map(c=>SUBJ[c.subj].mat).filter(Boolean))];
    if(mats.length) add(key(prev),toMin(S.set.bag),'normal','bag','var(--k-work)','Prépare ton sac pour '+JOURS[d.getDay()],mats.join(', '));
  }
  if(S.set.sessionAlert){
    for(const s of (PLAN[key(TODAY)]||[])) add(key(TODAY),s.s-10,s.level,'clock',s.c,'Dans 10 min : '+s.title,s.sub);
  }
  const seen=new Set();
  return out.filter(r=>{const k=r.dateK+r.title; if(seen.has(k))return false; seen.add(k); return true;}).sort((a,b)=>a.dateK.localeCompare(b.dateK)||a.min-b.min);
}

/* ================= rendering ================= */
const V = document.getElementById('view');
const VIEWS=[['aujourdhui','Aujourd\'hui','today'],['assistant','Discuter','chat'],['semaine','Semaine','week'],['travail','Devoirs','work'],['rappels','Rappels','bell'],['sources','Sources','link']];
let route='aujourdhui';
function nav(){
  const urgent=S.tasks.filter(t=>!t.done&&prio(t).level==='urgent').length;
  document.getElementById('nav').innerHTML=VIEWS.map(([id,n,ic])=>`<a href="#${id}" ${route===id?'aria-current="page"':''}>${I[ic]}<span>${n}</span>${id==='travail'&&urgent?`<span class="badge">${urgent}</span>`:''}</a>`).join('');
}
function tagP(level){ return `<span class="tag p-${level}">${PLABEL[level]}</span>`; }

function renderToday(){
  const d=TODAY, k=key(d), items=dayItems(d);
  const free=freeMinutes(d), planned=(PLAN[k]||[]).reduce((a,s)=>a+s.e-s.s,0);
  const pending=S.tasks.filter(t=>!t.done).map(t=>({t,p:prio(t)})).sort((a,b)=>b.p.score-a.p.score);
  const exams=pending.filter(x=>x.t.type==='examen').sort((a,b)=>a.p.d-b.p.d);
  const tomorrow=schoolDay(addDays(d,1));
  const tc=coursesFor(tomorrow);
  const mats=[...new Map(tc.filter(c=>!c.cancel).map(c=>[c.subj,c])).values()].filter(c=>SUBJ[c.subj]&&SUBJ[c.subj].mat);
  const dueTomorrow=pending.filter(x=>x.t.due===key(tomorrow));
  const now=new Date(), nowM=now.getHours()*60+now.getMinutes();
  const conf=conflictsFor(d);
  const avg=S.grades.length?(S.grades.reduce((a,g)=>a+g.v,0)/S.grades.length).toFixed(1).replace('.',','):'–';
  const weekDone=S.tasks.filter(t=>t.done).length+S.log.length;

  let tl='', nowShown=false, prevEnd=null;
  for(const it of items){
    if(!nowShown&&it.s>nowM&&nowM>=toMin('07:00')&&nowM<=toMin('22:30')){ tl+=`<div class="now-line"><span>${hm(nowM)}</span><i></i></div>`; nowShown=true; }
    if(prevEnd!==null&&it.s-prevEnd>=45&&it.kind!=='session'){
      tl+=`<div class="slot" style="--c:var(--line)"><div class="t">${hm(prevEnd)}</div><div class="rule"></div><div class="item free"><div class="txt">Temps libre · ${dur(it.s-prevEnd)}</div></div></div>`;
    }
    let cls='item', inner='';
    if(it.kind==='cours'){
      cls+=it.cancel?' cancel':'';
      inner=`<div class="txt"><div class="ttl">${it.title}</div><div class="sub">${hm(it.s)} – ${hm(it.e)} · salle ${it.room}</div></div>${it.cancel?`<span class="tag mod">Annulé · ${esc(it.note)}</span>`:'<span class="tag src">PRONOTE</span>'}`;
    } else if(it.kind==='event'){
      const isC=conf.some(p=>p.some(x=>x.id&&x.id===it.id));
      inner=`<div class="txt"><div class="ttl">${esc(it.title)}</div><div class="sub">${hm(it.s)} – ${hm(it.e)}${it.travel?` · trajet ${it.travel} min`:''}</div></div>${isC?'<span class="tag p-urgent">Conflit</span>':''}<span class="tag src">${SRC[it.src]}</span>`;
    } else {
      cls+=' session'+(it.done?' done':'');
      inner=`<button class="check" type="button" aria-pressed="${it.done?'true':'false'}" aria-label="Marquer la séance comme faite" data-act="${it.done?'undo':'done'}" data-task="${it.taskId}" data-s="${it.s}" data-e="${it.e}" data-log="${it.logId||''}">${I.check}</button><div class="txt"><div class="ttl">${esc(it.title)}</div><div class="sub">${hm(it.s)} – ${hm(it.e)} · ${esc(it.sub)}</div></div>${it.done?'<span class="tag src">Fait</span>':tagP(it.level)}`;
    }
    tl+=`<div class="slot" style="--c:${it.c}"><div class="t">${hm(it.s)}</div><div class="rule"></div><div class="${cls}">${inner}</div></div>`;
    prevEnd=Math.max(prevEnd||0,it.e+(it.travel||0));
  }
  if(!items.length) tl='<div class="empty">Rien de prévu aujourd\'hui. Profite de ta journée.</div>';

  const w=d.getDay();
  const intro = ((w===0||w===6)&&!coursesFor(d).length)
    ? `Pas de cours aujourd'hui. Tu as ${dur(free)} de temps libre ; ${planned?`${dur(planned)} de travail sont prévues, en séances de ${S.set.chunk} min.`:'rien n\'est planifié.'}`
    : `${coursesFor(d).filter(c=>!c.cancel).length} cours, puis ${dur(free)} de temps libre. ${planned?`${dur(planned)} de travail planifiées.`:''}`;

  V.innerHTML=`
  <div class="head"><div><span class="label">${cap(longDate(d))}</span><h1>Bonjour Lydia</h1><p>${intro}</p></div>
    <button class="btn primary" type="button" data-go="travail" data-add="1">${I.plus} Ajouter un devoir</button></div>
  <div class="strip">
    <div class="stat hl"><span class="label">Temps libre</span><b>${dur(free)}</b><span>aujourd'hui</span></div>
    <div class="stat"><span class="label">Travail prévu</span><b>${dur(planned)}</b><span class="muted">sur ${dur(S.set.maxDaily*((w===0||w===6)?1.4:1)|0)} max</span></div>
    <div class="stat"><span class="label">À rendre</span><b>${pending.filter(x=>x.p.d<=7).length}</b><span class="muted">dans les 7 jours</span></div>
    <div class="stat"><span class="label">Moyenne</span><b>${avg}</b><span class="muted">${S.pronoteReal?'moyenne de tes matières':'générale · exemple'}</span></div>
  </div>
  ${SHORT.length?`<div class="warnbox">${I.warn}<div><b>Planning trop serré.</b> Il manque ${SHORT.map(x=>`${dur(x.remaining)} pour « ${esc(x.t.title)} »`).join(' et ')}. Augmente la charge maximale par jour dans Rappels, ou commence ce week-end.</div></div>`:''}
  ${conf.length?`<div class="warnbox">${I.warn}<div><b>Conflit d'horaire :</b> ${conf.map(([a,b])=>`${esc(a.title)} et ${esc(b.title)} se chevauchent`).join(' ; ')}.</div></div>`:''}
  <div class="cols">
    <section class="panel"><div class="panel-h"><h2>Ma journée</h2><span class="muted mono">${items.length} éléments</span></div><div class="timeline">${tl}</div></section>
    <div class="stack">
      <section class="panel"><div class="panel-h"><h2>Priorités</h2><a class="btn small" href="#travail">Tout voir</a></div>
        <div class="list">${pending.slice(0,4).map(({t,p})=>`<div class="row" style="--c:${SUBJ[t.subj].c}"><span class="dot"></span><div class="txt"><div class="ttl">${esc(t.title)}</div><div class="meta"><span>${SUBJ[t.subj].n}</span><span>${TYPE[t.type]} · ${relDay(t.due)}</span></div></div>${tagP(p.level)}</div>`).join('')}</div>
      </section>
      <section class="panel"><div class="panel-h"><h2>Prochains contrôles</h2></div>
        <div class="list">${exams.length?exams.map(({t,p})=>{const pct=Math.round(100*t.doneMin/t.est);return `<div class="row" style="--c:${SUBJ[t.subj].c}"><div class="countdown">J-${p.d}<small>${JOURS[parseKey(t.due).getDay()].slice(0,3)}.</small></div><div class="txt"><div class="ttl">${SUBJ[t.subj].n}</div><div class="meta"><span>${esc(t.title)}</span></div><div class="bar" style="margin-top:6px"><i style="width:${pct}%"></i></div><div class="meta"><span>${pct} % révisé · ${dur(t.doneMin)} sur ${dur(t.est)}</span></div></div></div>`}).join(''):'<div class="empty">Aucun contrôle à venir.</div>'}</div>
      </section>
      <section class="panel"><div class="panel-h"><h2>Pour ${daysUntil(key(tomorrow))===1?'demain':JOURS[tomorrow.getDay()]}</h2>${I.bag.replace('<svg','<svg width="20" height="20" style="color:var(--muted)"')}</div>
        ${dueTomorrow.length?`<p><b>À rendre :</b> ${dueTomorrow.map(x=>esc(x.t.title)).join(', ')}</p>`:''}
        <span class="label">Dans le sac</span>
        <div class="bag">${mats.map(c=>`<span style="--c:${c.c}">${SUBJ[c.subj].mat}</span>`).join('')}</div>
        <p class="muted" style="font-size:.85rem">${tc.length} cours de ${hm(tc[0]?tc[0].s:480)} à ${hm(tc.length?Math.max(...tc.filter(c=>!c.cancel).map(c=>c.e)):480)}${tc.some(c=>c.cancel)?' · un cours annulé':''}</p>
      </section>
      <section class="panel"><div class="panel-h"><h2>Cette semaine</h2></div>
        <p><b class="mono" style="font-size:1.4rem">${weekDone}</b> <span class="muted">${weekDone>1?'tâches et séances terminées':'tâche ou séance terminée'}</span></p>
        <div class="list">${S.grades.map(g=>`<div style="display:grid;grid-template-columns:110px minmax(0,1fr) 40px;gap:10px;align-items:center;font-size:.85rem;--c:${SUBJ[g.subj].c}"><span>${SUBJ[g.subj].n}</span><div class="bar"><i style="width:${g.v*5}%"></i></div><span class="mono">${String(g.v).replace('.',',')}</span></div>`).join('')}</div>
        <p class="muted" style="font-size:.8rem">Notes sur 20${S.pronoteReal?', importées de PRONOTE':' (exemple)'}.</p>
      </section>
    </div>
  </div>`;
}

function renderWeek(){
  const days=[...Array(7)].map((_,i)=>addDays(TODAY,i));
  const H0=8, H1=22, hours=H1-H0, ppm=46/60;
  const y=m=>((m-H0*60)*ppm);
  let html=`<div class="wk-h"></div>`+days.map(d=>`<div class="wk-h ${key(d)===key(TODAY)?'today':''}">${cap(JOURS[d.getDay()]).slice(0,3)}. ${d.getDate()}<small>${dur(freeMinutes(d))} libre</small></div>`).join('');
  html+=`<div class="wk-hours">${[...Array(hours)].map((_,i)=>`<span style="top:${i?i*46:8}px">${H0+i}h</span>`).join('')}</div>`;
  let totalPlan=0; const perSubj={};
  for(const d of days){
    const conf=conflictsFor(d).flat();
    const items=dayItems(d);
    html+=`<div class="wk-col ${key(d)===key(TODAY)?'today':''}">${[...Array(hours)].map((_,i)=>`<div class="hl-line" style="top:${i*46}px"></div>`).join('')}`+items.map(it=>{
      if(it.kind==='session'){ totalPlan+=it.e-it.s; const t=S.tasks.find(x=>x.id===it.taskId); if(t) perSubj[t.subj]=(perSubj[t.subj]||0)+it.e-it.s; }
      const top=Math.max(0,y(it.s)), h=Math.max(18,(it.e-it.s)*ppm-2);
      const cls='blk'+(it.kind==='session'?' session':'')+(it.cancel?' cancel':'')+(conf.includes(it)?' conflict':'');
      return `<div class="${cls}" style="top:${top}px;height:${h}px;--c:${it.c}" title="${esc(it.title)} ${hm(it.s)}–${hm(it.e)}"><b>${esc(it.title)}</b>${h>30?`<span class="mono">${hm(it.s)}</span>`:''}</div>`;
    }).join('')+`</div>`;
  }
  const subjRows=Object.entries(perSubj).sort((a,b)=>b[1]-a[1]);
  const maxS=Math.max(1,...subjRows.map(r=>r[1]));
  V.innerHTML=`
  <div class="head"><div><span class="label">Du ${longDate(days[0])} au ${longDate(days[6])}</span><h1>Ma semaine</h1><p>Cours PRONOTE, agendas et séances de travail placées automatiquement dans tes créneaux libres. Les blocs hachurés sont les séances proposées.</p></div>
  <button class="btn" type="button" id="replan">${I.clock} Réorganiser</button></div>
  <div class="legend"><span><i class="sw" style="background:color-mix(in srgb,var(--m-maths) 30%,var(--surface))"></i>Cours (couleur de la matière)</span><span><i class="sw" style="background:repeating-linear-gradient(135deg,color-mix(in srgb,var(--m-fr) 30%,var(--surface)) 0 4px,var(--surface) 4px 8px)"></i>Séance de travail</span><span><i class="sw" style="background:color-mix(in srgb,var(--k-sport) 30%,var(--surface))"></i>Sport</span><span><i class="sw" style="background:color-mix(in srgb,var(--k-rdv) 30%,var(--surface))"></i>Rendez-vous</span><span><i class="sw" style="outline:2px solid var(--urgent);outline-offset:-2px"></i>Conflit</span></div>
  <div class="week-scroll"><div class="week" style="--hours:${hours}">${html}</div></div>
  <div class="cols">
    <section class="panel"><h2>Répartition du travail planifié</h2>
      <div class="list">${subjRows.length?subjRows.map(([s,m])=>`<div style="display:grid;grid-template-columns:130px minmax(0,1fr) 64px;gap:10px;align-items:center;--c:${SUBJ[s].c}"><span>${SUBJ[s].n}</span><div class="bar" style="height:10px"><i style="width:${100*m/maxS}%"></i></div><span class="mono">${dur(m)}</span></div>`).join(''):'<div class="empty">Aucune séance planifiée.</div>'}</div>
      <p class="muted">${dur(totalPlan)} de travail sur 7 jours, avec ${S.set.chunk} min par séance et 10 min de pause entre deux séances.</p>
    </section>
    <section class="panel"><h2>Comment le planning est calculé</h2>
      <div class="list" style="font-size:.9rem">
        <p><b>1. Temps réellement libre.</b> On retire les cours, les activités et les trajets, puis le dîner (19h30 – 20h15). On ne travaille pas avant la fin des cours + 45 min.</p>
        <p><b>2. Priorité.</b> Échéance proche, importance et contrôles comptent plus.</p>
        <p><b>3. Révisions espacées.</b> Les contrôles sont révisés à J-${S.set.revOffsets.join(', J-')}.</p>
        <p><b>4. Charge réaliste.</b> Pas plus de ${dur(S.set.maxDaily)} par jour de cours.</p>
      </div>
    </section>
  </div>`;
}

let filter='tous', showAdd=false;
function renderWork(){
  const all=S.tasks.map(t=>({t,p:prio(t)})).filter(x=>filter==='tous'||x.t.type===filter);
  const groups=[['Urgent',x=>!x.t.done&&x.p.level==='urgent'],['À anticiper',x=>!x.t.done&&x.p.level!=='urgent'&&x.p.d<=7],['Plus tard',x=>!x.t.done&&x.p.d>7],['Terminé',x=>x.t.done]];
  const sessCount={}; for(const k in PLAN) for(const s of PLAN[k]) sessCount[s.taskId]=(sessCount[s.taskId]||[]).concat(k);
  const row=({t,p})=>{const pct=Math.min(100,Math.round(100*t.doneMin/t.est)); const ss=sessCount[t.id]||[];
    return `<div class="row ${t.done?'is-done':''}" style="--c:${SUBJ[t.subj].c}"><button class="check" type="button" aria-pressed="${t.done}" aria-label="Terminé" data-act="toggle" data-task="${t.id}">${I.check}</button>
    <div class="txt"><div class="ttl">${esc(t.title)}</div><div class="meta"><span style="color:${SUBJ[t.subj].c};font-weight:700">${SUBJ[t.subj].n}</span><span>${TYPE[t.type]}${t.coef?' · coef. '+t.coef:''}</span><span>pour ${relDay(t.due)}</span><span>${dur(t.est)} estimées</span><span class="tag src">${SRC[t.src]}</span></div>
    ${!t.done?`<div class="meta" style="margin-top:6px"><div class="bar" style="max-width:160px"><i style="width:${pct}%"></i></div><span>${pct} %</span><span>${ss.length?ss.length+' séance'+(ss.length>1?'s':'')+' prévue'+(ss.length>1?'s':'')+' ('+[...new Set(ss)].map(k=>JOURS[parseKey(k).getDay()].slice(0,3)+'.').join(' ')+')':'aucune séance prévue'}</span></div>`:''}</div>
    ${t.done?'':tagP(p.level)}</div>`;};
  V.innerHTML=`
  <div class="head"><div><span class="label">${S.tasks.filter(t=>!t.done).length} en cours</span><h1>Devoirs et contrôles</h1><p>Récupérés depuis PRONOTE ou ajoutés à la main. Chaque élément est découpé en séances dans ton planning.</p></div>
    <button class="btn primary" type="button" id="toggleAdd">${I.plus} Ajouter</button></div>
  <section class="panel" id="addPanel" ${showAdd?'':'hidden'}>
    <div class="panel-h"><h2>Nouveau devoir ou contrôle</h2></div>
    <form id="addForm" class="form">
      <div class="field full"><label for="f-title">Intitulé</label><input id="f-title" required placeholder="Ex. : Exercices 3 et 4 p. 112"></div>
      <div class="field"><label for="f-subj">Matière</label><select id="f-subj">${Object.entries(SUBJ).map(([k,s])=>`<option value="${k}">${s.n}</option>`).join('')}</select></div>
      <div class="field"><label for="f-type">Type</label><select id="f-type"><option value="devoir">Devoir</option><option value="examen">Contrôle</option><option value="lecon">Leçon à apprendre</option></select></div>
      <div class="field"><label for="f-due">Pour le</label><input id="f-due" type="date" required value="${key(schoolDay(addDays(TODAY,3)))}"></div>
      <div class="field"><label for="f-est">Temps estimé (min)</label><input id="f-est" type="number" min="10" max="600" step="5" value="45"></div>
      <div class="field full"><label>Importance</label><div class="seg" id="f-imp"><button type="button" data-v="1" aria-pressed="false">Faible</button><button type="button" data-v="2" aria-pressed="true">Moyenne</button><button type="button" data-v="3" aria-pressed="false">Forte</button></div></div>
      <div class="full" style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn" id="cancelAdd">Annuler</button><button class="btn primary" type="submit">Ajouter au planning</button></div>
    </form>
  </section>
  <div class="seg" id="filter">${[['tous','Tout'],['devoir','Devoirs'],['examen','Contrôles'],['lecon','Leçons']].map(([v,n])=>`<button type="button" data-v="${v}" aria-pressed="${filter===v}">${n}</button>`).join('')}</div>
  ${groups.map(([n,f])=>{const g=all.filter(f).sort((a,b)=>b.p.score-a.p.score); return g.length?`<section class="stack"><h2>${n} <span class="muted mono">${g.length}</span></h2><div class="list">${g.map(row).join('')}</div></section>`:'';}).join('')}`;
}

function renderReminders(){
  const R=reminders();
  const icon={book:I.book,work:I.work,bag:I.bag,clock:I.clock};
  const chName={push:'Notification',digest:'Résumé du matin',off:'Désactivé'};
  const pr=lvl=>`<div class="setting"><div class="txt"><b>${tagP(lvl)} Priorité ${PLABEL[lvl].toLowerCase()}</b><span>${{urgent:'Échéance demain ou contrôle dans moins de 2 jours.',important:'Devoirs importants de la semaine.',normal:'Leçons et tâches sans urgence.'}[lvl]}</span></div><div class="seg" data-chan="${lvl}">${['push','digest','off'].map(c=>`<button type="button" data-v="${c}" aria-pressed="${S.set.channel[lvl]===c}">${chName[c]}</button>`).join('')}</div></div>`;
  const time=(id,label,hint)=>`<div class="setting"><div class="txt"><b>${label}</b><span>${hint}</span></div><input type="time" id="${id}" value="${S.set[id]}" aria-label="${label}"></div>`;
  V.innerHTML=`
  <div class="head"><div><span class="label">Notifications</span><h1>Rappels et réglages</h1><p>Choisis comment chaque niveau de priorité te prévient, quand réviser et à quelle heure préparer ton sac. L'aperçu se met à jour tout de suite.</p></div>
  <button class="btn" type="button" id="testNotif">${I.bell} Tester une notification</button></div>
  <div class="cols">
    <div class="stack">
      <section class="panel"><h2>Par niveau de priorité</h2><div>${pr('urgent')}${pr('important')}${pr('normal')}</div></section>
      <section class="panel"><h2>Révisions et préparation</h2><div>
        <div class="setting"><div class="txt"><b>Rappels de révision avant un contrôle</b><span>Une séance est aussi placée ces jours-là dans le planning.</span></div><div class="chips" id="offsets">${[14,7,5,3,2,1].map(o=>`<button type="button" class="chip" data-v="${o}" aria-pressed="${S.set.revOffsets.includes(o)}">J-${o}</button>`).join('')}</div></div>
        ${time('digest','Résumé du matin','Ta journée, tes priorités et les révisions du jour.')}
        ${time('evening','Rappel des devoirs pour le lendemain','La veille de chaque échéance.')}
        ${time('bag','Préparer le sac','Liste du matériel selon les cours du lendemain.')}
        <div class="setting"><div class="txt"><b>Prévenir 10 min avant une séance</b><span>Pour démarrer à l'heure.</span></div><button type="button" class="switch" role="switch" id="sessionAlert" aria-checked="${S.set.sessionAlert}" aria-label="Prévenir avant une séance"></button></div>
      </div></section>
      <section class="panel"><h2>Rythme de travail</h2><div>
        <div class="setting"><div class="txt"><b>Charge maximale par jour de cours</b><span>Le week-end, jusqu'à 40 % de plus.</span></div><div style="display:flex;gap:10px;align-items:center"><input type="range" id="maxDaily" min="45" max="240" step="15" value="${S.set.maxDaily}"><span class="mono" id="maxDailyV">${dur(S.set.maxDaily)}</span></div></div>
        <div class="setting"><div class="txt"><b>Durée d'une séance</b><span>Suivie de 10 min de pause.</span></div><div class="seg" id="chunk">${[25,40,50].map(c=>`<button type="button" data-v="${c}" aria-pressed="${S.set.chunk===c}">${c} min</button>`).join('')}</div></div>
        <div class="setting"><div class="txt"><b>Heures calmes</b><span>Aucune notification ; les rappels sont décalés à la fin.</span></div><div style="display:flex;gap:6px;align-items:center"><input type="time" id="quietStart" value="${S.set.quietStart}" aria-label="Début des heures calmes"><span class="muted">à</span><input type="time" id="quietEnd" value="${S.set.quietEnd}" aria-label="Fin des heures calmes"></div></div>
      </div></section>
    </div>
    <section class="panel"><div class="panel-h"><h2>Prochains rappels</h2><span class="muted mono">${R.length}</span></div>
      <div>${R.slice(0,12).map(r=>`<div class="notif" style="--c:${r.c}"><div class="when">${cap(relDay(r.dateK))} · ${hm(r.min)} ${r.ch==='digest'?'<span class="tag src">Dans le résumé</span>':''}${r.shifted?'<span class="tag mod">Décalé (heures calmes)</span>':''}</div><div class="ico">${icon[r.icon]}</div><div><b>${esc(r.title)}</b><div class="muted" style="font-size:.85rem">${esc(r.body)}</div></div></div>`).join('')||'<div class="empty">Aucun rappel prévu.</div>'}</div>
    </section>
  </div>`;
}

function renderSources(){
  const card=(id,name,bg,letter,desc,how)=>`<section class="panel src"><div class="src-top"><span class="logo" style="background:${bg}">${letter}</span><div style="flex:1;min-width:0"><h3>${name}</h3><span class="status ${S.sources[id]?'on':'off'}">${S.sources[id]?'● Connecté':'○ Non connecté'}</span></div><button class="btn small" type="button" data-src="${id}">${S.sources[id]?'Déconnecter':'Connecter'}</button></div><p class="muted" style="font-size:.9rem">${desc}</p><p style="font-size:.85rem"><b>Méthode :</b> ${how}</p></section>`;
  V.innerHTML=`
  <div class="head"><div><span class="label">Synchronisation</span><h1>Sources</h1><p>Tout ce que tu connectes alimente le même planning. Les doublons sont fusionnés et les conflits d'horaire signalés.</p></div><span class="demo-flag">Google et Outlook : utilise leur export .ics</span></div>
  <div class="src-grid">
    ${pronoteCard()}
    ${card('google','Google Agenda','#3B6FE0','G','Activités, sport et événements familiaux.','connexion officielle Google, en lecture seule.')}
    ${card('outlook','Outlook','#0E6AB8','O','Rendez-vous médicaux et administratifs.','connexion officielle Microsoft, en lecture seule.')}
    <section class="panel src"><div class="src-top"><span class="logo" style="background:#6A5ACD">ics</span><div style="flex:1;min-width:0"><h3>Fichier ICS / iCal</h3><span class="status ${S.sources.ics?'on':'off'}">${S.sources.ics?'● Importé':'○ Aucun fichier'}</span></div></div>
      <label class="drop" id="drop" for="icsFile">Dépose un fichier <b>.ics</b> ici ou <u>choisis-le</u><br><span style="font-size:.8rem">Fonctionne vraiment : les événements sont ajoutés à ton planning.</span></label>
      <input type="file" id="icsFile" accept=".ics,text/calendar" hidden>
    </section>
  </div>
  ${capStatus()}
  <section class="panel"><h2>Journal de synchronisation</h2><div class="log">${S.syncLog.slice(-8).reverse().map(l=>`<span>${esc(l)}</span>`).join('')}</div></section>`;
  const drop=document.getElementById('drop'), file=document.getElementById('icsFile');
  file.addEventListener('change',()=>file.files[0]&&importICS(file.files[0]));
  drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('over');});
  drop.addEventListener('dragleave',()=>drop.classList.remove('over'));
  drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('over');const f=e.dataTransfer.files[0];if(f)importICS(f);});
}

function importICS(f){
  const r=new FileReader();
  r.onload=()=>{
    const txt=String(r.result).replace(/\r?\n[ \t]/g,'');
    const blocks=txt.split('BEGIN:VEVENT').slice(1);
    let added=0,dups=0,skipped=0;
    for(const b of blocks){
      const get=n=>{const m=b.match(new RegExp('^'+n+'(?:;[^:\\n]*)?:(.*)$','m'));return m?m[1].trim():'';};
      const sum=get('SUMMARY').replace(/\\,/g,',').replace(/\\n/g,' ')||'Événement';
      const ds=get('DTSTART'), de=get('DTEND');
      const parse=v=>{const m=v.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?/); if(!m) return null; if(!m[4]) return null;
        return m[7]?new Date(Date.UTC(+m[1],m[2]-1,+m[3],+m[4],+m[5])):new Date(+m[1],m[2]-1,+m[3],+m[4],+m[5]);};
      const a=parse(ds), z=parse(de)||(a&&new Date(a.getTime()+3600e3));
      if(!a){skipped++;continue;}
      const k=key(a); const n=daysUntil(k); if(n<-1||n>60){skipped++;continue;}
      const start=hhmm(a.getHours()*60+a.getMinutes()), end=hhmm(Math.min(1439,z.getHours()*60+z.getMinutes()));
      if(S.events.some(e=>e.date===k&&e.start===start&&e.title.toLowerCase()===sum.toLowerCase())){dups++;continue;}
      S.events.push({id:uid(),title:sum.slice(0,80),kind:'perso',date:k,start,end,travel:0,src:'ics'}); added++;
    }
    S.sources.ics=true;
    S.syncLog.push(`Fichier ICS « ${f.name.slice(0,40)} » : ${added} ajouté(s), ${dups} doublon(s) ignoré(s), ${skipped} hors période ou journée entière`);
    save(); refresh();
    toast('Import terminé',`${added} événement(s) ajouté(s) à ton planning.`);
  };
  r.readAsText(f);
}

/* ================= assistant (chat) ================= */

let DICT=null, dictState='idle', chatDraft='';
const dictPromise=Promise.resolve(window.MLP?MLP.dictation():null);
dictPromise.then(d=>{ DICT=d||null; if(!DICT) return;
  DICT.onState(({state,reason})=>{ dictState=state; updateMic();
    if(state==='idle'){ const pe=document.getElementById('dictPartial'); if(pe){pe.hidden=true;pe.textContent='';}
      if(reason==='unavailable'){ DICT=null; if(route==='assistant') refresh(); toast('Micro indisponible','La dictée n\'est pas proposée ici. Écris ton message.'); }
      else if(reason==='upstream_error') toast('Micro','Le micro ou la reconnaissance vocale a échoué. Réessaie.');
      else if(reason==='rate_limited') toast('Micro occupé','Réessaie dans quelques secondes.');
      else if((reason==='stopped'||reason==='viewer_stopped')&&chatDraft.trim()&&route==='assistant'){ const v=chatDraft; chatDraft=''; sendChat(v); }
    } });
  DICT.onPartial(({text})=>{ const pe=document.getElementById('dictPartial'); if(pe){ pe.textContent=text; pe.hidden=!text; } });
  DICT.onFinal(({text})=>{ chatDraft=chatDraft?chatDraft+text:text.trimStart(); const i=document.getElementById('chatInput'); if(i) i.value=chatDraft; });
  if(route==='assistant') refresh(); });
function updateMic(){ const m=document.getElementById('micBtn'); if(!m) return; const on=dictState!=='idle'; m.setAttribute('aria-pressed',on); m.setAttribute('aria-label',on?'Arrêter et envoyer':'Parler'); m.title=on?'Arrêter et envoyer':'Parler'; }
let SAMPLE=null;
function syncAI(){ SAMPLE=S.aiKey?((prompt,opts)=>MLP.loadAI().then(ai=>ai.ask(prompt,Object.assign({},opts,{apiKey:S.aiKey,model:S.aiModel||'claude-opus-5-5'})))):null; }
syncAI();
if(!Array.isArray(S.chat)) S.chat=[];
if(S.aiFallback===undefined) S.aiFallback=true;
if(S.aiModel===undefined) S.aiModel='claude-opus-5-5';
const undoStack={}; let busy=false, pendingRaw=null;
const snap=()=>JSON.stringify({tasks:S.tasks,events:S.events,log:S.log});
const restore=j=>{ const o=JSON.parse(j); S.tasks=o.tasks; S.events=o.events; S.log=o.log; };
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[’']/g,' ').replace(/\s+/g,' ').trim();
const dayLabel=d=>{ const n=daysUntil(key(d)); return n===0?'aujourd\'hui':n===1?'demain':n===2?'après-demain':JOURS[d.getDay()]+' '+d.getDate()+' '+MOIS[d.getMonth()]; };
const SUBJ_KW={maths:['math','maths','mathematiques'],fr:['francais','dissertation','redaction'],hist:['histoire','geo','geographie','hg'],svt:['svt','biologie','sciences vie','vie et de la terre','vie & terre'],ang:['anglais'],pc:['physique','chimie','pc'],esp:['espagnol'],eps:['eps']};
function findSubj(t){ for(const [k,ws] of Object.entries(SUBJ_KW)) if(ws.some(w=>new RegExp('\\b'+w+'\\b').test(t))) return k; return null; }
function findDate(t){
  if(/apres[- ]demain/.test(t)) return addDays(TODAY,2);
  if(/\bdemain\b/.test(t)) return addDays(TODAY,1);
  if(/aujourd ?hui|ce soir|ce matin|cet apres[- ]midi/.test(t)) return TODAY;
  let m=t.match(/dans (\d+) jours?/); if(m) return addDays(TODAY,+m[1]);
  m=t.match(/\b(\d{1,2})\/(\d{1,2})\b/); if(m){ let d=new Date(TODAY.getFullYear(),m[2]-1,+m[1]); if(d<TODAY) d.setFullYear(d.getFullYear()+1); return d; }
  for(let i=0;i<7;i++) if(new RegExp('\\b'+JOURS[i]+'\\b').test(t)){ let d=nextDow(i); if((/prochain/.test(t)||/semaine prochaine/.test(t))&&key(d)===key(TODAY)) d=addDays(d,7); return d; }
  m=t.match(/\ble (\d{1,2})(?:er)?\b(?!\s?(?:h|:|\/))/); if(m){ const n=+m[1]; if(n>=1&&n<=31){ let d=new Date(TODAY.getFullYear(),TODAY.getMonth(),n); if(d<TODAY) d=new Date(TODAY.getFullYear(),TODAY.getMonth()+1,n); return d; } }
  return null;
}
function findTime(t){
  let m=t.match(/(\d{1,2})\s?(?:h|:)\s?(\d{2})?\s*(?:-|a|jusqu a)\s*(\d{1,2})\s?(?:h|:)\s?(\d{2})?/);
  if(m&&+m[1]<24&&+m[3]<24) return {s:+m[1]*60+(+m[2]||0),e:+m[3]*60+(+m[4]||0)};
  m=t.match(/\b(\d{1,2})\s?(?:h|:)\s?(\d{2})?/);
  if(m&&+m[1]<24) return {s:+m[1]*60+(+m[2]||0),e:null};
  return null;
}
function findDuration(t){
  let m=t.match(/(?:pendant|duree|dure|environ|prend|en)\s+(\d{1,2})\s?h\s?(\d{2})?/); if(m) return {m:+m[1]*60+(+m[2]||0),txt:m[0]};
  m=t.match(/(\d{1,3})\s?(?:min|mn|minutes)\b/); if(m) return {m:+m[1],txt:m[0]};
  return null;
}
const STOP=new Set(['ajoute','ajouter','deplace','deplacer','decale','decaler','supprime','supprimer','annule','annuler','enleve','retire','avec','pour','dans','demain','aujourd','lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche','heure','heures','mon','mes','les','des','une','cette','semaine','prochain','prochaine','fini','termine','fait','apres','avant','plutot','vers','bouge','repousse','reporte','avance','change','marque','comme','est','que','j','ai','rendu','efface','chez','rdv','rendez','vous','faire','avoir','tout','mets','met']);
function matchItem(t,only){
  const ws=t.split(/[^a-z0-9]+/).filter(w=>w.length>=3&&!STOP.has(w)&&!/^\d/.test(w)), subj=findSubj(t);
  let best=null,bs=0;
  if(only!=='task') for(const ev of S.events){ const n=norm(ev.title); const s=ws.filter(w=>n.includes(w)).length*2; if(s>bs){bs=s;best={kind:'event',o:ev};} }
  if(only!=='event') for(const tk of S.tasks){ const n=norm(tk.title+' '+SUBJ[tk.subj].n+' '+TYPE[tk.type]); const s=ws.filter(w=>n.includes(w)).length*2+(subj===tk.subj?3:0)-(tk.done?1:0); if(s>bs){bs=s;best={kind:'task',o:tk};} }
  return bs>=2?best:null;
}
const SW=/^(un|une|de|d'|d’|du|des|le|la|les|l'|l’|à|a|au|aux|en|sur|pour|et|mon|ma|mes|moi|stp)$/i;
function trimWords(s){ const w=s.split(/\s+/).filter(Boolean); while(w.length&&SW.test(w[0])) w.shift(); while(w.length&&SW.test(w[w.length-1])) w.pop(); return w.join(' '); }
function cleanTitle(raw){
  let s=' '+raw+' ';
  [/\b(ajoute[rz]?|rajoute[rz]?|note[rz]?|cr[ée]e[rz]?|planifie[rz]?|programme[rz]?|pr[ée]vois|inscris|mets?|peux[- ]tu|s'il te pla[iî]t|j['’]ai|nouveau|nouvelle)\b/gi,
   /\b(un|une)\s+(rendez[- ]vous|rdv|[ée]v[ée]nement|activit[ée])\b/gi,/\b(apr[èe]s[- ])?demain\b/gi,/aujourd['’ ]?hui/gi,/\b(ce|cette|cet)\s+(soir|semaine|matin|apr[èe]s[- ]midi)\b/gi,
   /\b(le\s+)?(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)(\s+prochain)?\b/gi,/\d{1,2}\s?(h|:)\s?\d{0,2}(\s*(-|à|a|jusqu'à)\s*\d{1,2}\s?(h|:)\s?\d{0,2})?/gi,
   /\ble\s+\d{1,2}(\/\d{1,2})?\b/gi,/\b\d{1,2}\/\d{1,2}\b/g,/\bdans\s+\d+\s+jours?\b/gi,/\b(pendant|environ)\s+\S+/gi,/\b\d+\s?(min|minutes)\b/gi,/\b(urgent|important)\b/gi
  ].forEach(p=>{ s=s.replace(p,' '); });
  s=trimWords(s.replace(/[,.;:!?]+/g,' ').replace(/\s+/g,' ').trim());
  return s?cap(s):'';
}
const SUBJ_RX=/math[ée]matiques|maths?|fran[çc]ais|histoire[- ]g[ée]o(graphie)?|histoire|g[ée]o(graphie)?|svt|anglais|physique[- ]chimie|physique|chimie|espagnol|\beps\b/gi;
const TYPE_RX=/\b(devoirs?|dm|contr[ôo]le|interro(gation)?|exam(en)?|[ée]valuation|ds|le[çc]on|oral|expos[ée])\b/gi;
function taskTitle(raw,type,subj){
  const rest=trimWords(cleanTitle(raw).replace(TYPE_RX,' ').replace(SUBJ_RX,' ').replace(/\s+/g,' ').trim());
  if(rest.replace(/[^a-zA-Zà-ü0-9]/g,'').length>=4) return (type==='examen'?'Contrôle : ':type==='lecon'?'Apprendre : ':'')+(type==='devoir'?cap(rest):rest);
  const n=SUBJ[subj].n; const el=/^[aeiouhéè]/i.test(n)?'d\'':'de ';
  return {devoir:'Devoir ',examen:'Contrôle ',lecon:'Leçon '}[type]+el+n;
}
function kindOf(t){ return /dentist|medecin|orthodont|docteur|rdv|rendez|kine|ophtal|prefecture|mairie|banque|coiffeu/.test(t)?'rdv':/sport|foot|basket|danse|natation|piscine|tennis|judo|match|entrainement|muscu|velo|course|hand|volley|gym/.test(t)?'sport':/mamie|papi|famille|anniv|cousin|tante|oncle|maman|papa|frere|soeur|grand/.test(t)?'famille':'perso'; }
function describeDay(d){
  const items=dayItems(d).filter(i=>!i.cancel);
  if(!items.length) return `Rien de prévu ${dayLabel(d)}.`;
  return `<b>${cap(dayLabel(d))}</b><ul>${items.map(i=>`<li><span class="mono">${hm(i.s)}–${hm(i.e)}</span> ${esc(i.title)}${i.kind==='session'?' <span class="muted">(séance proposée)</span>':''}</li>`).join('')}</ul>`;
}
function conflictNote(d,id){ const c=conflictsFor(d).find(p=>p.some(x=>x.id===id)); if(!c) return ''; const o=c.find(x=>x.id!==id)||c[1]; return ` <br><b>Attention :</b> ça chevauche « ${esc(o.title)} » (${hm(o.s)}–${hm(o.e)}).`; }
function sessionsOf(id){ const out=[]; for(const k in PLAN) for(const s of PLAN[k]) if(s.taskId===id) out.push(k+'|'+s.s); return out.sort(); }
const HELP_SHORT='Essaie par exemple : « ajoute un devoir de SVT pour jeudi », « déplace le piano à 17h30 » ou « qu\'est-ce que j\'ai demain ? ».';
const HELP_FULL=`Je comprends directement, sans IA :<ul><li><b>Ajouter</b> : « ajoute un contrôle de maths vendredi », « dentiste mardi à 17h »</li><li><b>Déplacer</b> : « décale le piano à 17h30 », « repousse le DM de SVT à lundi »</li><li><b>Supprimer</b> : « annule l'orthodontiste »</li><li><b>Terminer</b> : « j'ai fini les exercices de maths »</li><li><b>Demander</b> : « qu'est-ce que j'ai demain ? », « quand suis-je libre mercredi ? », « mes priorités », « mes contrôles »</li></ul>Si une phrase n'est pas reconnue, l'IA peut prendre le relais si tu l'as activée.`;

function localAnswer(raw){
  let t=norm(raw);
  if(pendingRaw&&findSubj(t)&&t.split(' ').length<=4){ raw=pendingRaw+' '+raw; t=norm(raw); }
  pendingRaw=null;
  const dura=findDuration(t); if(dura) t=t.replace(dura.txt,' ');
  const date=findDate(t), time=findTime(t), subj=findSubj(t);
  const isTask=/\b(devoirs?|dm|exercices?|exos?|controle|interro|interrogation|exam|examen|evaluation|ds|lecon|apprendre|reviser|revision|oral|expose|dissertation|redaction)\b/.test(t);
  if(/^(aide|help|\?)$|que (peux|sais)[- ]tu|comment (ca|tu) (marche|fonctionne)|tu sais faire/.test(t)) return {html:HELP_FULL};
  if(/(j ai (fini|termine|rendu)|c est fait|est fait|marque .*(fait|termine))/.test(t)){
    const m=matchItem(t,'task'); if(!m) return {html:'De quel devoir parles-tu ? Donne la matière ou un mot du titre.'};
    m.o.done=true; m.o.doneMin=m.o.est;
    return {html:`Bravo ! « ${esc(m.o.title)} » est terminé. J'ai libéré les séances prévues pour ce travail.`,changed:true};
  }
  if(/\b(supprime|supprimer|efface|annule|annuler|enleve|retire)\b/.test(t)){
    const m=matchItem(t); if(!m) return {html:'Je ne trouve pas cet élément. Donne un mot de son titre.'};
    if(m.kind==='event'){ S.events=S.events.filter(e=>e!==m.o); return {html:`J'ai supprimé « ${esc(m.o.title)} »${m.o.dow!==undefined&&!m.o.date?' (toutes les semaines)':''}.`,changed:true}; }
    S.tasks=S.tasks.filter(x=>x!==m.o); return {html:`J'ai supprimé « ${esc(m.o.title)} ».`,changed:true};
  }
  if(/\b(deplace|deplacer|decale|decaler|bouge|repousse|reporte|avance|change|mets|met)\b/.test(t)&&!/\bajoute/.test(t)&&!/\b(mets|met) (un|une)\b/.test(t)){
    const m=matchItem(t);
    if(!m&&(isTask||time)&&/\b(mets|met)\b/.test(t)){ /* « mets un rdv… » = ajout : on continue plus bas */ }
    else if(!m) return {html:'Que veux-tu déplacer ? Donne le nom de l\'activité ou du devoir.'};
    if(m){
    if(!date&&!time) return {html:`À quel jour ou à quelle heure veux-tu mettre « ${esc(m.o.title)} » ?`};
    if(m.kind==='task'){ if(!date) return {html:'Pour un devoir, indique le nouveau jour.'}; m.o.due=key(date); buildPlan(); const n=sessionsOf(m.o.id).length;
      return {html:`« ${esc(m.o.title)} » est maintenant pour ${dayLabel(date)}. ${n?n+' séance'+(n>1?'s':'')+' de travail recalculée'+(n>1?'s':'')+'.':''}`,changed:true}; }
    const ev=m.o, len=toMin(ev.end)-toMin(ev.start);
    if(time){ ev.start=hhmm(time.s); ev.end=hhmm(Math.min(1439,time.e||time.s+len)); }
    if(date){ if(ev.date||ev.dow===undefined) ev.date=key(date); else ev.dow=date.getDay(); }
    const d=ev.date?parseKey(ev.date):nextDow(ev.dow);
    return {html:`C'est fait : « ${esc(ev.title)} » ${ev.date?dayLabel(d):'chaque '+JOURS[ev.dow]}, de ${hm(toMin(ev.start))} à ${hm(toMin(ev.end))}.${conflictNote(d,ev.id)}`,changed:true};
    }
  }
  if(/\b(ajoute|ajouter|rajoute|note|noter|nouveau|nouvelle|cree|planifie|programme|prevois|inscris|mets|met|j ai (un|une))\b/.test(t)||(isTask&&date)||(time&&date&&!/\?/.test(raw))){
    if(isTask){
      const type=/controle|interro|exam|evaluation|\bds\b|oral|expose/.test(t)?'examen':/lecon|apprendre|reciter|vocabulaire/.test(t)?'lecon':'devoir';
      if(!subj){ pendingRaw=raw; return {html:'Pour quelle matière ? (maths, français, histoire-géo, SVT, anglais, physique-chimie, espagnol, EPS)'}; }
      const due=date||schoolDay(addDays(TODAY,3));
      const task={id:uid(),type,subj,title:taskTitle(raw,type,subj),due:key(due),est:dura?dura.m:(type==='examen'?120:type==='lecon'?30:45),imp:/important|urgent|coef/.test(t)||type==='examen'?3:2,src:'manual',doneMin:0,done:false};
      S.tasks.push(task); buildPlan();
      const ss=sessionsOf(task.id).map(x=>x.split('|')); const days=[...new Set(ss.map(x=>{const d=parseKey(x[0]);return JOURS[d.getDay()].slice(0,3)+'. '+d.getDate();}))];
      return {html:`Ajouté : <b>${esc(task.title)}</b>${task.title.includes(SUBJ[subj].n)?'':' ('+SUBJ[subj].n+')'} pour ${dayLabel(due)}${date?'':' <span class="muted">(date par défaut, dis-moi si c\'est un autre jour)</span>'}, ${dur(task.est)} estimées.<br>${ss.length?`${ss.length} séance${ss.length>1?'s':''} placée${ss.length>1?'s':''} : ${days.join(', ')}.`:'Aucun créneau libre avant l\'échéance : pense à augmenter ta charge maximale.'}`,changed:true};
    }
    if(!time){ pendingRaw=null; return {html:'À quelle heure ? Par exemple : « ajoute dentiste mardi à 17h ».'}; }
    const nowM=new Date().getHours()*60+new Date().getMinutes();
    const d=date||(time.s>nowM?TODAY:addDays(TODAY,1));
    const kind=kindOf(t); let title=cleanTitle(raw)||'Événement';
    if(kind==='rdv'&&/^chez\b/i.test(title)) title='Rendez-vous '+title.toLowerCase();
    const ev={id:uid(),title:title.slice(0,80),kind,date:key(d),start:hhmm(time.s),end:hhmm(Math.min(1439,time.e||time.s+(dura?dura.m:60))),travel:0,src:'manual'};
    S.events.push(ev); buildPlan();
    return {html:`Ajouté : <b>${esc(ev.title)}</b> ${dayLabel(d)} de ${hm(toMin(ev.start))} à ${hm(toMin(ev.end))} (${KIND[kind].n.toLowerCase()}). Les séances de travail autour ont été réorganisées.${conflictNote(d,ev.id)}`,changed:true};
  }
  if(/\b(resume|bilan|recap|recapitulatif)\b/.test(t)){
    const p=S.tasks.filter(x=>!x.done).map(x=>({x,p:prio(x)})).sort((a,b)=>b.p.score-a.p.score).slice(0,3);
    return {html:describeDay(date||TODAY)+(p.length?`<b>À ne pas oublier</b><ul>${p.map(({x,p})=>`<li>${tagP(p.level)} ${esc(x.title)} <span class="muted">· pour ${dayLabel(parseKey(x.due))}</span></li>`).join('')}</ul>`:'')};
  }
  if(/\b(libre|dispo|disponible|creneau|creneaux|temps)\b/.test(t)){
    const d=date||TODAY; const f=freeSlots(d);
    return {html:f.length?`Créneaux libres ${dayLabel(d)} :<ul>${f.map(([a,b])=>`<li><span class="mono">${hm(a)}–${hm(b)}</span> · ${dur(b-a)}</li>`).join('')}</ul>Total : ${dur(freeMinutes(d))}, déjà sans les cours, activités et trajets.`:`Aucun créneau libre ${dayLabel(d)}.`};
  }
  if(/(controle|exam|interro|evaluation)/.test(t)){
    const ex=S.tasks.filter(x=>!x.done&&x.type==='examen').sort((a,b)=>a.due.localeCompare(b.due));
    return {html:ex.length?`Tes prochains contrôles :<ul>${ex.map(x=>`<li><b>${SUBJ[x.subj].n}</b> ${dayLabel(parseKey(x.due))} (J-${daysUntil(x.due)}) · ${Math.round(100*x.doneMin/x.est)} % révisé</li>`).join('')}</ul>`:'Aucun contrôle à venir.'};
  }
  if(/(priorit|urgent|quoi faire|a faire|devoirs|travail)/.test(t)){
    const p=S.tasks.filter(x=>!x.done).map(x=>({x,p:prio(x)})).sort((a,b)=>b.p.score-a.p.score).slice(0,5);
    return {html:p.length?`Par ordre de priorité :<ul>${p.map(({x,p})=>`<li>${tagP(p.level)} ${esc(x.title)} <span class="muted">· ${SUBJ[x.subj].n}, pour ${dayLabel(parseKey(x.due))}</span></li>`).join('')}</ul>`:'Tout est fait, rien en attente.'};
  }
  if(/(qu est[- ]ce que|j ai quoi|programme|planning|agenda|emploi du temps|journee|cours|prevu)/.test(t)||date) return {html:describeDay(date||TODAY)};
  return null;
}

async function askAI(text){
  let changed=false;
  const ctx={aujourdhui:key(TODAY)+' ('+JOURS[TODAY.getDay()]+')',matieres:Object.fromEntries(Object.entries(SUBJ).map(([k,v])=>[k,v.n])),
    devoirs:S.tasks.map(t=>({id:t.id,type:t.type,matiere:t.subj,titre:t.title,pour:t.due,minutes:t.est,fait:t.done})),
    evenements:S.events.map(e=>({id:e.id,titre:e.title,date:e.date||null,chaque_jour_semaine:e.date?null:(e.dow===undefined?null:JOURS[e.dow]),debut:e.start,fin:e.end,type:e.kind}))};
  const hist=S.chat.filter(m=>!m.pending).slice(-7,-1).map(m=>(m.me?'Élève : '+m.text:'Assistant : '+String(m.html).replace(/<[^>]+>/g,' ').replace(/\s+/g,' '))).join('\n');
  const isDate=v=>/^\d{4}-\d{2}-\d{2}$/.test(v||''), isTime=v=>/^\d{2}:\d{2}$/.test(v||'');
  const tools=[
    {name:'ajouter_devoir',description:'Ajoute un devoir, un contrôle ou une leçon.',inputSchema:{type:'object',properties:{type:{type:'string',enum:['devoir','examen','lecon']},matiere:{type:'string',enum:Object.keys(SUBJ)},titre:{type:'string'},pour:{type:'string',description:'AAAA-MM-JJ'},minutes:{type:'number'},importance:{type:'number',enum:[1,2,3]}},required:['type','matiere','titre','pour']},
      execute:i=>{ if(!SUBJ[i.matiere]||!TYPE[i.type]||!isDate(i.pour)) throw new Error('paramètres invalides'); const t={id:uid(),type:i.type,subj:i.matiere,title:String(i.titre).slice(0,120),due:i.pour,est:Math.max(10,Math.min(600,+i.minutes||45)),imp:[1,2,3].includes(+i.importance)?+i.importance:2,src:'manual',doneMin:0,done:false}; S.tasks.push(t); changed=true; return 'ajouté, id '+t.id; }},
    {name:'ajouter_evenement',description:'Ajoute un rendez-vous ou une activité ponctuelle.',inputSchema:{type:'object',properties:{titre:{type:'string'},date:{type:'string'},debut:{type:'string',description:'HH:MM'},fin:{type:'string',description:'HH:MM'},type:{type:'string',enum:Object.keys(KIND)}},required:['titre','date','debut','fin']},
      execute:i=>{ if(!isDate(i.date)||!isTime(i.debut)||!isTime(i.fin)) throw new Error('paramètres invalides'); const e={id:uid(),title:String(i.titre).slice(0,80),kind:KIND[i.type]?i.type:'perso',date:i.date,start:i.debut,end:i.fin,travel:0,src:'manual'}; S.events.push(e); changed=true; return 'ajouté, id '+e.id; }},
    {name:'modifier',description:'Change la date, l\'heure ou l\'échéance d\'un devoir ou d\'un événement existant.',inputSchema:{type:'object',properties:{id:{type:'string'},date:{type:'string'},debut:{type:'string'},fin:{type:'string'}},required:['id']},
      execute:i=>{ const t=S.tasks.find(x=>x.id===i.id); if(t){ if(isDate(i.date)) t.due=i.date; changed=true; return 'ok'; } const e=S.events.find(x=>x.id===i.id); if(!e) throw new Error('id inconnu'); if(isDate(i.date)){ if(e.date) e.date=i.date; else e.dow=parseKey(i.date).getDay(); } if(isTime(i.debut)) e.start=i.debut; if(isTime(i.fin)) e.end=i.fin; changed=true; return 'ok'; }},
    {name:'supprimer',description:'Supprime un devoir ou un événement.',inputSchema:{type:'object',properties:{id:{type:'string'}},required:['id']},
      execute:i=>{ const n=S.tasks.length+S.events.length; S.tasks=S.tasks.filter(x=>x.id!==i.id); S.events=S.events.filter(x=>x.id!==i.id); if(S.tasks.length+S.events.length===n) throw new Error('id inconnu'); changed=true; return 'supprimé'; }},
    {name:'terminer',description:'Marque un devoir comme terminé.',inputSchema:{type:'object',properties:{id:{type:'string'}},required:['id']},
      execute:i=>{ const t=S.tasks.find(x=>x.id===i.id); if(!t) throw new Error('id inconnu'); t.done=true; t.doneMin=t.est; changed=true; return 'ok'; }}
  ];
  const prompt=`Tu es l'assistant de planning de l'application MyLife Planner, pour une lycéenne. Réponds en français, en 1 à 4 phrases courtes, sans markdown. Pour toute modification, utilise les outils ; n'invente jamais d'identifiant. Dates au format AAAA-MM-JJ, heures HH:MM. Si la demande est ambiguë, pose une seule question.\n\nDonnées actuelles : ${JSON.stringify(ctx)}\n\nÉchanges récents :\n${hist||'(aucun)'}\n\nNouveau message de l'élève : ${text}`;
  const r=await SAMPLE(prompt,{tools,cache:false});
  return {html:esc((r&&r.text)||'C\'est noté.').replace(/\n/g,'<br>'),via:'ia',changed};
}

async function sendChat(text){
  text=(text||'').trim(); if(!text||busy) return;
  S.chat.push({id:uid(),me:true,text:text.slice(0,500)});
  const before=snap();
  let r=null;
  try{ r=localAnswer(text); }catch(e){ r=null; }
  if(!r){
    if(S.aiFallback&&SAMPLE){
      busy=true; S.chat.push({id:'pending',pending:true,html:'<span class="typing">L\'IA réfléchit…</span>',via:'ia'}); refresh();
      try{ r=await askAI(text); }
      catch(e){ r={html:(e&&e.code==='not_granted')?'Ajoute ta clé API dans les réglages ci-dessous pour utiliser l\'IA. Je reste en mode local. '+HELP_SHORT:'L\'IA n\'a pas pu répondre. '+HELP_SHORT,via:'local',changed:snap()!==before}; }
      S.chat=S.chat.filter(m=>!m.pending); busy=false;
    } else r={html:'Je n\'ai pas compris cette demande. '+HELP_SHORT,via:'local'};
  }
  const id=uid(); if(r.changed) undoStack[id]=before;
  S.chat.push({id,html:r.html,via:r.via||'local'}); S.chat=S.chat.slice(-60);
  save(); refresh();
  const inp=document.getElementById('chatInput'); if(inp) inp.focus();
}

const SUGG=['Qu\'est-ce que j\'ai demain ?','Quand suis-je libre mercredi ?','Ajoute un contrôle d\'histoire vendredi','Décale le piano à 17h30','J\'ai fini les exercices de maths','Mes priorités','Aide'];
function renderChat(){
  const msgs=[{id:'w',html:'Salut Lydia ! Dis-moi ce que tu veux ajouter, déplacer ou savoir. '+HELP_SHORT,via:'local'},...S.chat];
  V.innerHTML=`
  <div class="head"><div><span class="label">Assistant</span><h1>Discuter avec mon planning</h1><p>Écris comme tu parles. Les demandes courantes sont comprises directement par l'application, sans IA ; l'IA ne sert qu'en secours, si tu l'actives.</p></div>
  ${S.chat.length?'<button class="btn small" type="button" id="clearChat">Effacer la discussion</button>':''}</div>
  <section class="panel chat">
    <div class="msgs" id="msgs" aria-live="polite">${msgs.map(m=>m.me?`<div class="msg me">${esc(m.text)}</div>`:`<div class="msg bot">${m.html}${m.pending?'':`<div class="foot"><span class="via">${m.via==='ia'?'Réponse IA':'Mode local, sans IA'}</span>${undoStack[m.id]?`<button class="btn small" type="button" data-undo="${m.id}">Annuler</button>`:''}</div>`}</div>`).join('')}</div>
    <div class="sugg">${SUGG.map(s=>`<button class="chip" type="button" data-say="${esc(s)}">${esc(s)}</button>`).join('')}</div>
    <form id="chatForm" class="chat-in"><input id="chatInput" autocomplete="off" maxlength="500" value="${esc(chatDraft)}" placeholder="${DICT?'Écris ou appuie sur le micro':'Ex. : ajoute un contrôle de maths jeudi'}" aria-label="Ton message" ${busy?'disabled':''}>${DICT?`<button class="btn mic" type="button" id="micBtn" aria-pressed="${dictState!=='idle'}" aria-label="${dictState!=='idle'?'Arrêter et envoyer':'Parler'}" title="Parler">${I.mic}</button>`:''}<button class="btn primary" type="submit" ${busy?'disabled':''}>Envoyer</button></form>
    <div class="partial" id="dictPartial" hidden></div>
    ${capStatus()}
    <div class="setting"><div class="txt"><b>Utiliser l'IA si l'appli ne comprend pas</b><span>${SAMPLE?'Seulement pour les phrases que le mode local ne reconnaît pas. Chaque modification peut être annulée.':'Facultatif : ajoute ta propre clé API Anthropic pour l\'activer. Sans clé, le mode local fonctionne seul.'}</span></div><button type="button" class="switch" role="switch" id="aiToggle" aria-checked="${!!(S.aiFallback&&SAMPLE)}" ${SAMPLE?'':'disabled'} aria-label="Utiliser l'IA en secours"></button></div>
    <details class="ai-cfg"${S.aiKey?'':' open'}><summary>Réglages de l'IA (facultatif)</summary>
      <div class="field"><label for="aiKey">Clé API Anthropic</label><input id="aiKey" type="password" autocomplete="off" spellcheck="false" placeholder="sk-ant-…" value="${esc(S.aiKey||'')}"></div>
      <div class="field"><label for="aiModel">Modèle</label><input id="aiModel" type="text" spellcheck="false" value="${esc(S.aiModel||'claude-opus-5-5')}"></div>
      <p class="muted" style="font-size:.82rem">La clé reste enregistrée sur cet appareil et n'est envoyée qu'à Anthropic. Les appels sont facturés sur ton compte Anthropic.</p>
    </details>
  </section>`;
  const box=document.getElementById('msgs'); box.scrollTop=box.scrollHeight;
}

/* ================= PRONOTE (connexion réelle, via pawnote) ================= */
let pronoteTab='login', showPronote=false, pronoteMsg='', pronoteFound=[], pronoteBusy=false, pronotePwd='', qrText='';
const PMODE=()=>window.MLP?MLP.pronoteMode():'server';
function subjKey(name){
  const n=norm(String(name||'Cours'));
  if(/sport|\beps\b|ed\.? ?physique|education physique/.test(n)) return 'eps';
  const k=findSubj(n); if(k) return k;
  S.extraSubj=S.extraSubj||{};
  const id='p_'+(n.replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,24)||'cours');
  if(!SUBJ[id]){ const pal=['#2F6FEB','#D2425A','#B97A0E','#2A9157','#8352D6','#128AA0','#DA5A22','#62718F']; S.extraSubj[id]={n:cap(String(name||'Cours').toLowerCase()).slice(0,32),c:pal[Object.keys(S.extraSubj).length%pal.length],mat:''}; SUBJ[id]=S.extraSubj[id]; }
  return id;
}
function guessType(n){ return /devoir surveille|\bds\b|controle|evaluation|interro|examen|bac blanc/.test(n)?'examen':/apprendre|lecon|reviser|revoir|memoriser/.test(n)?'lecon':'devoir'; }
function applyPronote(res){
  S.pronoteAuth=res.auth;
  S.pronoteUser=[res.user&&res.user.name,res.user&&res.user.className].filter(Boolean).join(' · ');
  if(!S.pronoteReal){ S.tasks=S.tasks.filter(t=>!(t.src==='pronote'&&!t.pid)); S.mods=[]; S.grades=[]; }
  let added=0, updated=0;
  for(const a of res.assignments||[]){
    const due=key(new Date(a.deadline)); const text=String(a.description||'').trim()||'Travail à faire';
    const ex=S.tasks.find(t=>t.pid===a.id);
    if(ex){ ex.due=due; if(a.done&&!ex.done){ ex.done=true; ex.doneMin=ex.est; } updated++; continue; }
    const type=guessType(norm(text)); const est=Math.max(10,Math.min(600,a.length||(type==='examen'?120:type==='lecon'?30:45)));
    S.tasks.push({id:uid(),pid:a.id,type,subj:subjKey(a.subject),title:text.split('\n')[0].slice(0,120),note:text.slice(0,1000),due,est,imp:type==='examen'?3:2,src:'pronote',doneMin:a.done?est:0,done:!!a.done}); added++;
  }
  S.lessons=(res.lessons||[]).map(l=>{ const s=new Date(l.start), e=new Date(l.end); return {date:key(s),start:hhmm(s.getHours()*60+s.getMinutes()),end:hhmm(Math.min(1439,e.getHours()*60+e.getMinutes())),subj:subjKey(l.subject),room:l.room||'',cancel:!!l.canceled,note:l.status||(l.canceled?'Cours annulé':'')}; });
  for(const l of (res.lessons||[]).filter(l=>l.test&&!l.canceled)){
    const due=key(new Date(l.start)), subj=subjKey(l.subject);
    if(!S.tasks.some(t=>t.pid==='test-'+l.id||(t.type==='examen'&&t.subj===subj&&t.due===due))){ S.tasks.push({id:uid(),pid:'test-'+l.id,type:'examen',subj,title:'Contrôle de '+SUBJ[subj].n,due,est:120,imp:3,src:'pronote',doneMin:0,done:false}); added++; }
  }
  if(res.grades&&res.grades.length) S.grades=res.grades.map(g=>({subj:subjKey(g.subject),v:g.value}));
  S.pronoteReal=true; S.sources.pronote=true; S.lastSync=Date.now();
  S.syncLog.push(`PRONOTE : ${(res.lessons||[]).length} cours, ${added} nouveau(x) devoir(s), ${updated} mis à jour, ${(res.grades||[]).length} moyenne(s)`+((res.warnings||[]).length?' · '+res.warnings.join(' ; '):''));
  save();
  return {added,updated};
}
async function pronoteRun(req,quiet){
  if(pronoteBusy||!window.MLP) return; pronoteBusy=true; pronoteMsg='Connexion à PRONOTE…'; if(!quiet) refresh();
  try{
    const res=await MLP.pronote(Object.assign({kind:S.pronoteKind||'eleve',days:21},req),S.serverUrl);
    const r=applyPronote(res); pronotePwd=''; qrText=''; showPronote=false; pronoteMsg='';
    toast('PRONOTE synchronisé',`${(res.lessons||[]).length} cours et ${r.added} nouveau${r.added>1?'x':''} devoir${r.added>1?'s':''}.`);
  }catch(e){
    pronoteMsg=(e&&e.message)||'Connexion à PRONOTE impossible.';
    if(req.mode==='token'&&e&&['bad_credentials','expired','denied'].includes(e.code)){ S.pronoteAuth=null; pronoteMsg+=' Reconnecte-toi une fois avec ton identifiant ou le QR code.'; showPronote=true; }
    S.syncLog.push('PRONOTE : échec · '+pronoteMsg); save();
    if(quiet) toast('PRONOTE',pronoteMsg);
  }
  pronoteBusy=false; refresh();
}
async function readQrImage(file){
  const bmp=await createImageBitmap(file);
  if('BarcodeDetector' in window){ try{ const r=await new BarcodeDetector({formats:['qr_code']}).detect(bmp); if(r[0]) return r[0].rawValue; }catch(e){} }
  if(!window.jsQR) await new Promise((res,rej)=>{ const s=document.createElement('script'); s.src='vendor/jsQR.js'; s.onload=res; s.onerror=rej; document.head.appendChild(s); });
  const c=document.createElement('canvas'), sc=Math.min(1,1600/Math.max(bmp.width,bmp.height)); c.width=Math.round(bmp.width*sc); c.height=Math.round(bmp.height*sc);
  const g=c.getContext('2d'); g.drawImage(bmp,0,0,c.width,c.height); const d=g.getImageData(0,0,c.width,c.height);
  const r=window.jsQR(d.data,c.width,c.height); return r?r.data:null;
}
function pronoteCard(){
  const on=!!S.pronoteReal, auth=S.pronoteAuth, direct=PMODE()==='direct';
  const tabs=[['login','Identifiant'],['qr','QR code / ENT'],['coller','Copier-coller']];
  const server=direct?'':`<div class="field"><label for="p-server">Adresse du serveur MyLife Planner</label><input id="p-server" type="url" value="${esc(S.serverUrl||'')}" placeholder="Laisse vide si l'appli est ouverte depuis le serveur"></div>`;
  const kind=`<div class="field"><label for="p-kind">Type de compte</label><select id="p-kind"><option value="eleve"${S.pronoteKind!=='parent'?' selected':''}>Élève</option><option value="parent"${S.pronoteKind==='parent'?' selected':''}>Parent</option></select></div>`;
  let body='';
  if(showPronote){
    body=`<div class="seg" id="pTabs">${tabs.map(([v,n])=>`<button type="button" data-v="${v}" aria-pressed="${pronoteTab===v}">${n}</button>`).join('')}</div>`;
    if(pronoteTab==='login') body+=`<p style="font-size:.9rem">Pour un compte PRONOTE avec identifiant et mot de passe propres à PRONOTE. Le mot de passe sert une seule fois à obtenir un jeton de connexion : il n'est jamais enregistré.</p>
      <form id="pLoginForm" class="stack" style="gap:10px">
      <div class="field"><label for="p-url2">Adresse de ton PRONOTE</label><input id="p-url2" type="url" required value="${esc(S.pronoteUrl||'')}" placeholder="https://0000000a.index-education.net/pronote/eleve.html"></div>
      <div class="field"><label for="p-user">Identifiant</label><input id="p-user" autocomplete="username" required value="${esc(S.pronoteLogin||'')}"></div>
      <div class="field"><label for="p-pwd">Mot de passe</label><input id="p-pwd" type="password" autocomplete="current-password" required></div>
      ${kind}${server}
      <div><button class="btn primary" type="submit" ${pronoteBusy?'disabled':''}>Se connecter et synchroniser</button></div></form>`;
    if(pronoteTab==='qr') body+=`<p style="font-size:.9rem">Si tu te connectes à PRONOTE par ton <b>ENT</b> ou ÉduConnect, c'est la méthode à utiliser.</p>
      <ol class="steps"><li>Ouvre PRONOTE sur un ordinateur et connecte-toi comme d'habitude.</li><li>Clique sur l'icône <b>QR code</b> en haut de la page, choisis un <b>code à 4 chiffres</b> et laisse le QR code affiché.</li><li>Ici, prends le QR code en photo (ou choisis une capture d'écran), tape le même code, puis valide. Le QR code n'est valable que quelques minutes.</li></ol>
      <div class="field"><label for="p-qrfile">Photo ou capture du QR code</label><input id="p-qrfile" type="file" accept="image/*" capture="environment"></div>
      <div class="field"><label for="p-qrtext">Ou contenu du QR code</label><textarea id="p-qrtext" rows="2" style="border:1px solid var(--line);background:var(--bg);border-radius:9px;padding:9px 10px;font:inherit;resize:vertical" placeholder='{"jeton":"…","login":"…","url":"…"}'>${esc(qrText)}</textarea></div>
      <div class="field"><label for="p-pin">Code à 4 chiffres choisi dans PRONOTE</label><input id="p-pin" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="off"></div>
      ${kind}${server}
      <div><button class="btn primary" type="button" id="pQr" ${pronoteBusy?'disabled':''}>Se connecter avec le QR code</button></div>`;
    if(pronoteTab==='coller') body+=`<p style="font-size:.9rem">Marche partout, sans connexion : tu copies la page des devoirs et l'appli les reconnaît.</p><ol class="steps"><li>Ouvre PRONOTE comme d'habitude et va dans <b>Cahier de textes › Travail à faire</b>.</li><li>Sélectionne tout (Ctrl+A, ou appui long puis « Tout sélectionner » sur téléphone) et copie.</li><li>Colle ci-dessous, puis clique sur <b>Trouver les devoirs</b>.</li></ol>
      <div class="field"><label for="p-paste">Texte copié depuis PRONOTE</label><textarea id="p-paste" rows="6" style="border:1px solid var(--line);background:var(--bg);border-radius:9px;padding:9px 10px;font:inherit;resize:vertical" placeholder="Pour lundi 23 novembre&#10;MATHÉMATIQUES&#10;Exercices 21 et 22 page 90"></textarea></div>
      <div><button class="btn primary" type="button" id="pPaste">Trouver les devoirs</button></div>`;
    if(!direct&&pronoteTab!=='coller') body+=`<p class="muted" style="font-size:.82rem">Dans la page web, la connexion passe par le serveur MyLife Planner (dossier <code>server/</code>), car le navigateur bloque les appels directs vers PRONOTE. L'extension et l'appli Android, elles, se connectent directement.</p>`;
  }
  const when=S.lastSync?new Date(S.lastSync):null;
  const status=on?'● Synchronisé'+(S.pronoteUser?' · '+esc(S.pronoteUser):'')+(when?' · '+when.toLocaleString('fr-FR',{weekday:'short',hour:'2-digit',minute:'2-digit'}):''):'○ Pas encore connecté : les devoirs affichés sont des exemples';
  const actions=auth&&!showPronote?`<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn small primary" type="button" id="pSync" ${pronoteBusy?'disabled':''}>Synchroniser maintenant</button><button class="btn small" type="button" id="pLogout">Se déconnecter</button></div>`:'';
  return `<section class="panel src"><div class="src-top"><span class="logo" style="background:#1D8A4E">P</span><div style="flex:1;min-width:0"><h3>PRONOTE</h3><span class="status ${on?'on':'off'}">${status}</span></div><button class="btn small ${showPronote?'':'primary'}" type="button" id="pronoteBtn">${showPronote?'Fermer':auth?'Changer de compte':'Connecter PRONOTE'}</button></div>
  <p class="muted" style="font-size:.9rem">Emploi du temps, cours modifiés ou annulés, devoirs, contrôles et moyennes. PRONOTE n'a pas d'API officielle : l'appli utilise la bibliothèque libre pawnote.</p>${actions}${body}
  ${pronoteMsg?`<div class="info" role="status">${esc(pronoteMsg)}</div>`:''}
  ${pronoteFound.length?`<div class="found"><b>Devoirs trouvés</b><div class="list">${pronoteFound.map((c,i)=>`<label class="row" style="--c:${SUBJ[c.subj].c}"><input type="checkbox" data-pick="${i}" ${c.pick?'checked':''}><div class="txt"><div class="ttl">${esc(c.title)}</div><div class="meta"><span style="color:${SUBJ[c.subj].c};font-weight:700">${SUBJ[c.subj].n}</span><span>${TYPE[c.type]} · pour ${relDay(c.due)}</span></div></div></label>`).join('')}</div><div><button class="btn primary" type="button" id="pImport">Importer ${pronoteFound.filter(c=>c.pick).length} devoir${pronoteFound.filter(c=>c.pick).length>1?'s':''}</button></div></div>`:''}</section>`;
}
function parsePronote(txt){
  const lines=String(txt).split(/\n+/).map(l=>l.replace(/\s+/g,' ').trim()).filter(Boolean);
  const MO=MOIS.map(m=>norm(m)); const out=[]; let due=null, subj=null;
  for(const line of lines){
    const n=norm(line);
    const m=n.match(/(?:(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche) )?(\d{1,2})(?:er)? (janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)/);
    if(m&&n.length<70&&/(^|\b)(pour|a faire|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\b/.test(n)){
      let d=new Date(TODAY.getFullYear(),MO.indexOf(m[3]),+m[2]); if(d<addDays(TODAY,-180)) d.setFullYear(d.getFullYear()+1); due=key(d); subj=null; continue; }
    if(n.length<50){ const sj=findSubj(n); if(sj){ subj=sj; continue; } }
    if(due&&subj&&line.length>=6&&!/^(fait|non fait|termine|voir le cours|ressources?|pieces? jointes?|donne le .*)$/.test(n)){
      const type=/devoir surveille|\bds\b|controle|evaluation|interro/.test(n)?'examen':/apprendre|lecon|reviser|revoir/.test(n)?'lecon':'devoir';
      const title=line.slice(0,120);
      if(!S.tasks.some(t=>norm(t.title)===n.slice(0,120))&&!out.some(o=>o.title===title)) out.push({id:uid(),type,subj,title,due,est:type==='examen'?120:type==='lecon'?30:45,imp:type==='examen'?3:2,src:'pronote',doneMin:0,done:false,pick:daysUntil(due)>=0});
      if(out.length>=40) break;
    }
  }
  return out;
}
function capStatus(){
  if(!window.MLP) return '';
  const plat={web:'page web / appli installée',extension:'extension du navigateur',android:'appli Android'}[MLP.platform];
  const ns=MLP.notify.state();
  const it=[['Micro (dictée)',!!DICT],['PRONOTE '+(PMODE()==='direct'?'en connexion directe':'via le serveur'),true],['IA en secours (clé perso)',!!SAMPLE],['Notifications',ns==='granted'||ns==='native'],['Chat sans IA, copier-coller PRONOTE, fichier ICS',true]];
  return `<div class="caps"><b>Sur cet appareil : ${plat}</b><div class="caps-list">${it.map(([n,ok])=>`<span class="${ok?'ok':'ko'}">${ok?'✓':'✕'} ${n}</span>`).join('')}</div>${DICT?'':'<p class="muted" style="font-size:.82rem">La dictée dépend du navigateur : elle marche dans Chrome, Edge, Safari et dans l\'appli Android.</p>'}${ns==='default'?'<p class="muted" style="font-size:.82rem">Autorise les notifications dans <a href="#rappels">Rappels</a> avec « Tester une notification ».</p>':''}</div>`;
}

let toastT;
function toast(t,b){ const el=document.getElementById('toast'); el.innerHTML=`<span style="color:var(--hl)">${I.bell.replace('<svg','<svg width="20" height="20"')}</span><div><b>${esc(t)}</b>${esc(b)}</div>`; el.hidden=false; clearTimeout(toastT); toastT=setTimeout(()=>el.hidden=true,4200); }

function refresh(){
  buildPlan();
  route=(location.hash||'').slice(1); if(!VIEWS.some(v=>v[0]===route)) route='aujourdhui';
  nav();
  ({aujourdhui:renderToday,assistant:renderChat,semaine:renderWeek,travail:renderWork,rappels:renderReminders,sources:renderSources})[route]();
  const sl=document.getElementById('syncLabel'); if(sl) sl.textContent=S.lastSync?'PRONOTE synchronisé '+new Date(S.lastSync).toLocaleString('fr-FR',{weekday:'short',hour:'2-digit',minute:'2-digit'}):'Données d\'exemple';
  scheduleNotifs();
}
/* Rappels réels : programmés dans Android (APK) ou affichés tant que l'appli est ouverte (web, extension). */
let notifKey='';
function scheduleNotifs(){
  if(!window.MLP) return; const st=MLP.notify.state(); if(st!=='granted'&&st!=='native') return;
  const R=reminders(), items=[], digest={};
  for(const r of R){ const at=parseKey(r.dateK); at.setHours(0,r.min,0,0);
    if(r.ch==='push') items.push({at,title:r.title,body:r.body});
    else if(r.ch==='digest'){ (digest[r.dateK]=digest[r.dateK]||[]).push(r.title); } }
  for(const [k,list] of Object.entries(digest)){ const at=parseKey(k); at.setHours(0,toMin(S.set.digest),0,0); items.push({at,title:'Ton résumé du matin',body:list.slice(0,4).join(' · ')+(list.length>4?' …':'')}); }
  const sig=JSON.stringify(items.map(x=>[x.at.getTime(),x.title]));
  if(sig===notifKey) return; notifKey=sig; MLP.notify.schedule(items);
}

/* ================= events ================= */
document.addEventListener('click',e=>{
  const b=e.target.closest('button,[data-go]'); if(!b) return;
  if(b.dataset.go){ showAdd=!!b.dataset.add; location.hash=b.dataset.go; if(route===b.dataset.go) refresh(); return; }
  if(b.id==='micBtn'){ if(!DICT) return;
    if(DICT.active()){ DICT.stop().catch(()=>{}); return; }
    DICT.start().catch(err=>{ const c=err&&err.code;
      if(c==='not_granted') toast('Micro refusé','Tu peux continuer à écrire. Pour l\'autoriser, autorise le micro dans les réglages du navigateur ou du téléphone.');
      else if(c==='unavailable'){ DICT=null; refresh(); toast('Micro indisponible','La dictée n\'est pas proposée ici. Écris ton message.'); }
      else if(c==='rate_limited') toast('Micro occupé','Réessaie dans quelques secondes.');
      else if(c!=='stopped'&&c!=='dismissed') toast('Micro','La dictée n\'a pas pu démarrer.'); });
    return; }
  if(b.dataset.say){ sendChat(b.dataset.say); return; }
  if(b.id==='pQr'){ const pin=((document.getElementById('p-pin')||{}).value||'').trim(); let qr=null; try{ qr=JSON.parse(qrText); }catch(e){}
    if(!qr||!qr.jeton||!qr.url){ pronoteMsg='Ajoute d\'abord une photo nette du QR code (ou colle son contenu).'; refresh(); return; }
    if(!/^\d{4}$/.test(pin)){ pronoteMsg='Tape le code à 4 chiffres choisi dans PRONOTE.'; refresh(); return; }
    pronoteRun({mode:'qr',qr,pin}); return; }
  if(b.id==='pSync'){ if(S.pronoteAuth) pronoteRun(S.pronoteAuth); return; }
  if(b.id==='pLogout'){ S.pronoteAuth=null; S.syncLog.push('PRONOTE : déconnecté sur cet appareil'); save(); refresh(); toast('PRONOTE','Déconnecté. Tes devoirs déjà importés restent dans ton planning.'); return; }
  if(b.id==='pImport'){ const picked=pronoteFound.filter(c=>c.pick); picked.forEach(c=>{ const t={...c}; delete t.pick; S.tasks.push(t); }); if(picked.length){ S.pronoteReal=true; S.sources.pronote=true; } showPronote=false; pronoteFound=[]; pronoteMsg=''; S.syncLog.push(`PRONOTE (navigateur) : ${picked.length} devoir(s) importé(s)`); save(); refresh(); toast('Import terminé',`${picked.length} devoir(s) ajouté(s) et planifié(s).`); return; }
  if(b.dataset.undo){ const j=undoStack[b.dataset.undo]; if(j){ restore(j); delete undoStack[b.dataset.undo]; S.chat.push({id:uid(),html:'J\'ai annulé cette modification.',via:'local'}); save(); refresh(); } return; }
  if(b.id==='aiToggle'){ S.aiFallback=!S.aiFallback; save(); refresh(); return; }
  if(b.id==='clearChat'){ S.chat=[]; save(); refresh(); return; }
  if(b.id==='pronoteBtn'){ showPronote=!showPronote; pronoteMsg=''; refresh(); return; }
  if(b.id==='pPaste'){ const v=(document.getElementById('p-paste')||{}).value||''; if(!v.trim()){ pronoteMsg='Colle d\'abord le texte de la page « Travail à faire ».'; refresh(); return; } pronoteFound=parsePronote(v); S.pronoteUser='copier-coller'; pronoteMsg=pronoteFound.length?`${pronoteFound.length} nouveau${pronoteFound.length>1?'x':''} devoir${pronoteFound.length>1?'s':''} trouvé${pronoteFound.length>1?'s':''}. Décoche ceux que tu ne veux pas, puis importe.`:'Aucun devoir reconnu. Vérifie que tu as copié la page « Travail à faire », avec les dates « Pour lundi… » et les noms des matières.'; refresh(); return; }
  if(b.parentElement&&b.parentElement.id==='pTabs'){ pronoteTab=b.dataset.v; refresh(); return; }
  const act=b.dataset.act;
  if(act==='done'){ const t=S.tasks.find(x=>x.id===b.dataset.task); const s=+b.dataset.s, en=+b.dataset.e; if(t){ t.doneMin=Math.min(t.est,t.doneMin+(en-s)); S.log.push({id:uid(),date:key(TODAY),s,e:en,taskId:t.id}); if(t.doneMin>=t.est) t.done=true; save(); refresh(); toast('Bien joué',`Séance de ${SUBJ[t.subj].n} terminée. Le reste du planning est réajusté.`);} return; }
  if(act==='undo'){ const l=S.log.find(x=>x.id===b.dataset.log); if(l){ const t=S.tasks.find(x=>x.id===l.taskId); if(t){t.doneMin=Math.max(0,t.doneMin-(l.e-l.s)); t.done=false;} S.log=S.log.filter(x=>x!==l); save(); refresh(); } return; }
  if(act==='toggle'){ const t=S.tasks.find(x=>x.id===b.dataset.task); if(t){ t.done=!t.done; if(t.done) t.doneMin=t.est; save(); refresh(); } return; }
  if(b.id==='reset'){ S=sample(); save(); refresh(); toast('Exemple réinitialisé','Les données d\'exemple ont été rechargées.'); return; }
  if(b.id==='replan'){ refresh(); toast('Planning réorganisé','Les séances ont été recalculées selon tes créneaux libres.'); return; }
  if(b.id==='toggleAdd'){ showAdd=!showAdd; refresh(); if(showAdd) document.getElementById('f-title').focus(); return; }
  if(b.id==='cancelAdd'){ showAdd=false; refresh(); return; }
  if(b.id==='testNotif'){ const top0=S.tasks.filter(t=>!t.done).sort((a,c)=>prio(c).score-prio(a).score)[0]; if(window.MLP) MLP.notify.permission().then(ok=>{ if(ok) MLP.notify.show(top0?`${PLABEL[prio(top0).level]} · ${SUBJ[top0.subj].n}`:'MyLife Planner',top0?`${top0.title}, pour ${relDay(top0.due)}.`:'Tout est à jour.'); else toast('Notifications bloquées','Autorise les notifications de MyLife Planner dans les réglages du navigateur ou du téléphone.'); scheduleNotifs(); }); const top=S.tasks.filter(t=>!t.done).sort((a,c)=>prio(c).score-prio(a).score)[0]; toast(top?`${PLABEL[prio(top).level]} · ${SUBJ[top.subj].n}`:'MyLife Planner', top?`${top.title}, pour ${relDay(top.due)}.`:'Tout est à jour.'); return; }
  if(b.dataset.src){ const id=b.dataset.src; S.sources[id]=!S.sources[id]; S.syncLog.push(`${SRC[id]} : ${S.sources[id]?'connecté (simulation)':'déconnecté'}`); save(); refresh(); return; }
  const seg=b.parentElement;
  if(seg&&seg.id==='f-imp'){ seg.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b)); return; }
  if(seg&&seg.id==='filter'){ filter=b.dataset.v; refresh(); return; }
  if(seg&&seg.dataset.chan){ S.set.channel[seg.dataset.chan]=b.dataset.v; save(); refresh(); return; }
  if(seg&&seg.id==='chunk'){ S.set.chunk=+b.dataset.v; save(); refresh(); return; }
  if(seg&&seg.id==='offsets'){ const v=+b.dataset.v; S.set.revOffsets=S.set.revOffsets.includes(v)?S.set.revOffsets.filter(x=>x!==v):[...S.set.revOffsets,v].sort((a,c)=>c-a); if(!S.set.revOffsets.length) S.set.revOffsets=[1]; save(); refresh(); return; }
  if(b.id==='sessionAlert'){ S.set.sessionAlert=!S.set.sessionAlert; save(); refresh(); return; }
});
document.addEventListener('submit',e=>{
  if(e.target.id==='chatForm'){ e.preventDefault(); const i=document.getElementById('chatInput'); const v=i.value; i.value=''; chatDraft=''; if(DICT&&DICT.active()) DICT.stop().catch(()=>{}); sendChat(v); return; }
  if(e.target.id==='pLoginForm'){ e.preventDefault(); const url=(document.getElementById('p-url2').value||'').trim(), user=(document.getElementById('p-user').value||'').trim(), pwd=document.getElementById('p-pwd').value||'';
    if(!/^https?:\/\/\S+$/.test(url)){ pronoteMsg='Colle l\'adresse complète de ton PRONOTE, qui commence par https://'; refresh(); return; }
    S.pronoteUrl=url; S.pronoteLogin=user; save(); pronoteRun({mode:'password',url,username:user,password:pwd}); return; }
  if(e.target.id!=='addForm') return; e.preventDefault();
  const imp=+(document.querySelector('#f-imp [aria-pressed="true"]')||{dataset:{v:2}}).dataset.v;
  const t={id:uid(),type:document.getElementById('f-type').value,subj:document.getElementById('f-subj').value,title:document.getElementById('f-title').value.trim().slice(0,120),due:document.getElementById('f-due').value,est:Math.max(10,+document.getElementById('f-est').value||45),imp,src:'manual',doneMin:0,done:false};
  if(!t.title||!t.due) return;
  S.tasks.push(t); save(); showAdd=false; refresh();
  const n=Object.values(PLAN).flat().filter(s=>s.taskId===t.id).length;
  toast('Ajouté au planning',n?`${n} séance(s) placée(s) avant le ${longDate(parseKey(t.due))}.`:'Pas de créneau libre avant l\'échéance : pense à ajuster ta charge maximale.');
});
document.addEventListener('change',e=>{
  const id=e.target.id;
  if(['digest','evening','bag','quietStart','quietEnd'].includes(id)&&e.target.value){ S.set[id]=e.target.value; save(); refresh(); }
  if(id==='maxDaily'){ S.set.maxDaily=+e.target.value; save(); refresh(); }
  if(id==='aiKey'||id==='aiModel'){ S[id]=e.target.value.trim(); if(id==='aiKey'&&S.aiKey) S.aiFallback=true; syncAI(); save(); refresh(); }
  if(id==='p-kind'){ S.pronoteKind=e.target.value; save(); }
  if(id==='p-server'){ S.serverUrl=e.target.value.trim(); save(); }
  if(id==='p-qrfile'&&e.target.files[0]){ pronoteMsg='Lecture du QR code…'; refresh(); readQrImage(e.target.files[0]).then(t=>{ if(t){ qrText=t; pronoteMsg='QR code lu. Tape ton code à 4 chiffres puis valide.'; } else pronoteMsg='Je n\'ai pas trouvé de QR code sur cette image. Reprends une photo plus nette, bien de face.'; refresh(); }).catch(()=>{ pronoteMsg='Impossible de lire cette image.'; refresh(); }); }
  if(e.target.dataset&&e.target.dataset.pick!==undefined){ const c=pronoteFound[+e.target.dataset.pick]; if(c){ c.pick=e.target.checked; const bt=document.getElementById('pImport'); const n=pronoteFound.filter(x=>x.pick).length; if(bt){ bt.textContent=`Importer ${n} devoir${n>1?'s':''}`; bt.disabled=!n; } } }
});
document.addEventListener('input',e=>{ if(e.target.id==='chatInput') chatDraft=e.target.value; if(e.target.id==='p-url2') S.pronoteUrl=e.target.value.trim(); if(e.target.id==='p-user') S.pronoteLogin=e.target.value.trim(); if(e.target.id==='p-qrtext') qrText=e.target.value.trim(); if(e.target.id==='maxDaily'){ const v=document.getElementById('maxDailyV'); if(v) v.textContent=dur(+e.target.value);} });
window.addEventListener('hashchange',()=>{ refresh(); window.scrollTo(0,0); });
refresh();
if(S.pronoteAuth&&(!S.lastSync||Date.now()-S.lastSync>3600e3)) setTimeout(()=>pronoteRun(S.pronoteAuth,true),1200);
})();
