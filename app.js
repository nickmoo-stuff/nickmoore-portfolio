(() => {
'use strict';
const data=window.PORTFOLIO||{},site=data.site||{},root=document.getElementById('sections'),nav=document.getElementById('nav'),dialog=document.getElementById('detail');
const el=(tag,cls,text)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=String(text);return x};
const add=(parent,...nodes)=>{nodes.filter(Boolean).forEach(n=>parent.append(n));return parent};
const p=(txt,cls='')=>el('p',cls,txt);
const validUrl=url=>{if(/^((assets|downloads)\/|#)/.test(url))return true;try{let u=new URL(url,location.href);return ['http:','https:','mailto:'].includes(u.protocol)}catch{return false}};
const link=(label,url,cls='')=>{if(!url||!validUrl(url))return null;let a=el('a',cls,label);a.href=url;if(/^https?:/i.test(url)){a.target='_blank';a.rel='noopener noreferrer'}return a};
// References are opt-in: only valid sources actually cited in the visible text are shown.
function referencedSources(item,body){
 const sources=Array.isArray(item.sources)?item.sources:[];
 const ids=[...String(body).matchAll(/\[(\d+)\]/g)].map(m=>Number(m[1]));
 return [...new Set(ids)].map(id=>sources.find(x=>Number(x.id)===id&&x.label&&x.url&&/^https?:\/\//i.test(x.url)&&validUrl(x.url))).filter(Boolean);
}
// Safe inline formatting: ***bold italic***, **bold**, *italic*, and numbered citations.
// All user-authored content remains text nodes; no HTML is interpreted.
function citedText(body,item,cls=''){
 const node=el('p',cls),available=referencedSources(item,body),byId=new Map(available.map(x=>[Number(x.id),x]));
 const value=String(body);const pattern=/(\*\*\*([^*\n]+)\*\*\*|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|\[(\d+)\])/g;
 let offset=0,match;
 while((match=pattern.exec(value))!==null){
  node.append(document.createTextNode(value.slice(offset,match.index)));
  if(match[2]!==undefined){const strong=el('strong');strong.append(el('em','',match[2]));node.append(strong)}
  else if(match[3]!==undefined)node.append(el('strong','',match[3]));
  else if(match[4]!==undefined)node.append(el('em','',match[4]));
  else {
   const id=Number(match[5]);
   if(byId.has(id)){
    const sup=el('sup','citation-marker'),a=el('a','',`[${id}]`);
    a.href=`#source-${item.id}-${id}`;a.setAttribute('aria-label',`Reference ${id}: ${byId.get(id).label}`);
    a.addEventListener('click',e=>{e.preventDefault();const target=document.getElementById(`source-${item.id}-${id}`);target?.scrollIntoView({block:'nearest',behavior:'smooth'});target?.focus()});
    sup.append(a);node.append(sup);
   }else node.append(document.createTextNode(match[0]));
  }
  offset=pattern.lastIndex;
 }
 node.append(document.createTextNode(value.slice(offset)));return node;
}
function sourcePanel(item,body){
 const sources=referencedSources(item,body);if(!sources.length)return null;
 const panel=el('details','sources-panel'),summary=el('summary','',`Sources & references (${sources.length})`),list=el('ol','sources-list');
 for(const source of sources){const li=el('li');li.id=`source-${item.id}-${source.id}`;li.tabIndex=-1;li.append(el('span','source-number',`[${source.id}] `));li.append(link(source.label,source.url));list.append(li)}
 panel.append(summary,list);return panel;
}
function section(id){let s=el('section','section'+(id==='welcome'?' hero':''));s.id=id;const title=site.sectionNames?.[id]||id;if(id!=='welcome')add(s,el('div','eyebrow','./'+title.replace(/[^a-z0-9]+/gi,'_')),el('h2','',title));return s}
function card(item){let c=el('article','card');if(item.image&&/^assets\//.test(item.image)){let im=el('img','card-image');im.src=item.image;im.alt=item.imageAlt||item.title;im.loading='lazy';c.append(im)}else c.append(el('div','icon',item.icon||'◇'));add(c,el('h3','',item.title),citedText(item.summary||'',item,'small'));(item.tags||[]).forEach(t=>c.append(el('span','tag',t)));let b=el('button','','View details →');b.type='button';b.addEventListener('click',()=>openDetail(item));c.append(el('div','actions',undefined));c.lastChild.append(b);return c}
function openDetail(item){
 let d=document.getElementById('detail-content');const body=item.detail||item.summary||'More information coming soon.';
 d.replaceChildren(el('div','eyebrow','./Details'),el('h2','',item.title),citedText(body,item));
 if(item.status)d.append(el('span','tag',item.status));
 if(item.draft)d.append(p('Draft summary — details awaiting confirmation.','notice'));
 const sources=sourcePanel(item,body);if(sources)d.append(sources);
 let row=el('div','link-row');(item.links||[]).forEach(x=>{let a=link(x.label,x.url);if(a)row.append(a)});
 if(row.children.length)d.append(row);dialog.showModal();history.replaceState(null,'','#'+item.id)
}
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
function grid(items){let g=el('div','grid');items.filter(x=>x.visible!==false).forEach(x=>g.append(card(x)));return g}
function intro(s,text){s.append(p(text,'intro'));return s}
function renderSpotlight(){
 const items=(Array.isArray(data.spotlight)?data.spotlight:[])
  .filter(x=>x.enabled===true&&x.title&&x.image&&/^assets\/[a-z0-9/_-]+\.(svg|png|jpg|jpeg|webp)$/i.test(x.image)&&/^#[a-z0-9-]+$/i.test(x.href||''))
  .sort((a,b)=>(Number(a.order)||0)-(Number(b.order)||0)).slice(0,4);
 if(!items.length)return null;
 const aside=el('aside','spotlight');aside.setAttribute('aria-label','Current spotlight');
 aside.append(el('h2','spotlight-heading','Current spotlight'));
 const tiles=el('div','spotlight-grid');
 items.forEach(item=>{
  const a=link(item.title,item.href,'spotlight-tile');if(!a)return;
  a.textContent='';a.setAttribute('aria-label',item.title+' — '+(item.description||''));
  const img=el('img','spotlight-image');img.src=item.image;img.alt='';img.loading='eager';
  const overlay=el('span','spotlight-caption');overlay.append(el('strong','',item.title));
  if(item.description)overlay.append(el('span','spotlight-description',item.description));
  a.append(img,overlay);tiles.append(a);
 });
 aside.append(tiles);return aside;
}
function renderWelcome(){
 let s=section('welcome'),layout=el('div','hero-layout'),copy=el('div','hero-copy');
 add(copy,el('div','eyebrow','> HELLO, I’M'));
 let name=el('h1','typewriter');name.dataset.text=site.name||'Nick Moore';name.textContent=site.name||'Nick Moore';
 copy.append(name,el('div','eyebrow',site.headline||''),p(site.tagline||'','lead'));
 let row=el('div','actions');row.append(link('Explore my work ↓','#projects','btn'));
 let cv=link('View CV ↓','#cv','btn alt');if(cv)row.append(cv);copy.append(row);
 layout.append(copy);let spotlight=renderSpotlight();if(spotlight)layout.append(spotlight);
 s.append(layout);return s;
}
function renderAbout(){let s=section('about');let layout=el('div','about-layout');let copy=el('div','about-copy');add(copy,p(site.introduction||''),p(site.about||''));if(site.portrait&&/^assets\//.test(site.portrait)){let frame=el('div','portrait-frame');let image=el('img','about-portrait');image.src=site.portrait;image.alt='Portrait of Nick Moore';image.loading='lazy';frame.append(image);layout.append(frame)}layout.append(copy);s.append(layout);let row=el('div','social-links');[['✉ Get in Touch','#contact'],['in LinkedIn',site.links?.linkedin],['▤ View CV','#cv']].forEach(([name,url])=>{let a=link(name,url,'btn alt');if(a)row.append(a)});s.append(row);return s}
function renderProfiles(){return intro(section('profiles'),'Explore my areas of experience and interest. Select a profile to learn more.').appendChild(grid(data.profiles||[])).parentElement}
function renderExperience(){let s=intro(section('experience-qualifications'),'A career built across different industries, alongside ongoing learning and professional development.');s.append(el('h3','subheading','Experience'),grid(data.experience||[]),el('h3','subheading','Qualifications & Training'),grid(data.qualifications||[]));return s}
function renderProjects(){let s=intro(section('projects'),'A mixture of technical projects, businesses, campaigns and creative work. Search or filter to explore.');let search=el('input','search');search.type='search';search.placeholder='Search projects, descriptions and skills…';search.setAttribute('aria-label','Search projects');let filters=el('div','filter'),out=el('div');let cats=[{id:'all',label:'All projects'},...(site.projectCategories||[])];let active='all';function draw(){out.replaceChildren();let q=search.value.trim().toLowerCase();let items=(data.projects||[]).filter(x=>x.visible!==false&&(active==='all'||x.category===active)&&[x.title,x.summary,x.detail,...(x.tags||[])].join(' ').toLowerCase().includes(q));out.append(items.length?grid(items):p('No matching projects found.','empty'));filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===active)))}cats.forEach(cat=>{let b=el('button','',cat.label);b.dataset.category=cat.id;b.type='button';b.addEventListener('click',()=>{active=cat.id;draw()});filters.append(b)});search.addEventListener('input',draw);add(s,search,filters,out);draw();return s}
function renderAchievements(){return intro(section('achievements'),'Television, world records, campaigns and the occasional unexpected adventure.').appendChild(grid(data.achievements||[])).parentElement}
function renderJourney(){let s=intro(section('journey'),'Three places I have called home, each with its own chapter.');let t=el('div','timeline');(data.journey||[]).forEach(x=>{let c=el('article','card');add(c,el('strong','',x.years),el('h3','',x.title),p(x.summary));if(x.id==='leeds'){let a=link('Explore my Professional Profiles →','#profiles','btn alt');if(a)c.append(a)}t.append(c)});s.append(t);return s}
function gallery(id,description){let s=intro(section(id),description);if(id==='music'){let row=el('div','social-links');[['▶ YouTube',site.links?.youtube],['♫ Spotify',site.links?.spotify]].forEach(([name,url])=>{let a=link(name,url,'btn alt');if(a)row.append(a)});s.append(row)}s.append(grid(data[id]||[]));return s}
function renderCV(){
 let s=intro(section('cv'),'Choose a tailored CV, preview it in an A4 layout, then print or save it as a PDF. All versions share the same editable career records.');
 let select=el('div','cv-options'),preview=el('div','cv-preview'),tools=el('div','cv-tools');
 let photoLabel=el('label','cv-photo-toggle');let photoCheck=el('input');photoCheck.type='checkbox';photoCheck.checked=false;photoLabel.append(photoCheck,document.createTextNode(' Include portrait on CV'));photoCheck.addEventListener('change',()=>{preview.querySelector('.cv-paper')?.classList.toggle('with-photo',photoCheck.checked)});
 let versions=data.cvVersions||{},shared=data.cvShared||{};let ids=Object.keys(versions);
 let print=el('button','btn','Print / Save as PDF ↗');print.type='button';print.addEventListener('click',()=>window.print());
 let hint=p('Public CV preview: no telephone number or email address is included. Contact via the website form or LinkedIn.','small muted');tools.append(print,photoLabel,hint);
 function show(id,updateHash=true){let v=versions[id];if(!v)return;select.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.version===id)));
 let page=el('article','cv-paper');page.classList.toggle('with-photo',photoCheck.checked);
 let head=el('div','cv-header');let heading=el('div','cv-heading-content');heading.append(el('h2','cv-name',shared.name||'Nick Moore'),p(v.title,'cv-subtitle'));
 let contact=el('div','cv-contact');if(shared.location)contact.append(el('span','',shared.location));
 const contactLinks=[['Website',shared.website],['LinkedIn',shared.linkedin],['Email',shared.email?'mailto:'+shared.email:'']];contactLinks.forEach(([label,url])=>{let a=link(label,url);if(a){a.textContent=label==='Email'?shared.email:label==='Website'?url.replace(/^https?:\/\//,'').replace(/\/$/,''): 'LinkedIn';contact.append(a)}});
 if(!shared.website)contact.append(el('span','cv-placeholder','Website: add URL'));if(!shared.linkedin)contact.append(el('span','cv-placeholder','LinkedIn: add URL'));
 heading.append(contact);head.append(heading);if(shared.portrait&&/^assets\//.test(shared.portrait)){let img=el('img','cv-photo');img.src=shared.portrait;img.alt='Nick Moore portrait';head.append(img)}page.append(head);
 function block(title){let h=el('h3','cv-heading',title);page.append(h)}
 block('Professional Profile');page.append(p(v.summary));block('Key Skills');page.append(p((v.skills||[]).join('  •  ')));
 block('Experience');(v.roleIds||[]).forEach(rid=>{let r=(shared.roles||[]).find(x=>x.id===rid);if(!r)return;let e=el('div','cv-entry');e.append(el('h4','',r.title),p([r.employer,r.dates].filter(Boolean).join(' | '),'cv-meta'));let ul=el('ul');(r.bullets||[]).forEach(t=>ul.append(el('li','',t)));e.append(ul);page.append(e)});
 block('Qualifications & Development');(v.qualificationIds||[]).forEach(qid=>{let q=(shared.qualifications||[]).find(x=>x.id===qid);if(q)page.append(p(q.title+' — '+q.status,'cv-qualification'))});
 preview.replaceChildren(page);if(updateHash)history.replaceState(null,'','#cv-'+id);
 }
 ids.forEach(id=>{let b=el('button','cv-choice',versions[id].title);b.type='button';b.dataset.version=id;b.addEventListener('click',()=>show(id));select.append(b)});
 s.append(select,tools,preview);show(ids.includes(location.hash.replace('#cv-',''))?location.hash.replace('#cv-',''):ids[0],false);return s
}
function renderContact(){let s=intro(section('contact'),'Have a professional opportunity, project idea or question? Send me a message using the Google-hosted contact form.');let row=el('div','actions');let links=[['✉ Send me a message','https://forms.gle/6cGcyHdDuyjLGbBf7'],['LinkedIn',site.links?.linkedin],['View CV','#cv']];links.forEach(([name,url])=>{let a=link(name,url,'btn alt');if(a)row.append(a)});s.append(row,p('The contact form opens in a new tab. Google handles submissions; no personal telephone number or public email address is displayed here.','small muted'));return s}
const renderers={welcome:renderWelcome,about:renderAbout,profiles:renderProfiles,'experience-qualifications':renderExperience,projects:renderProjects,achievements:renderAchievements,journey:renderJourney,cv:renderCV,music:()=>gallery('music','Albums, singles and other musical adventures.'),books:()=>gallery('books','Published writing and books.'),hobbies:()=>gallery('hobbies','Electronics, gadgets, repairs and whatever else catches my curiosity.'),contact:renderContact};
(site.sectionOrder||[]).forEach(id=>{if(!renderers[id])return;root.append(renderers[id]());if(!['welcome','about','contact'].includes(id)){let a=link(site.sectionNames?.[id]||id,'#'+id);if(a)nav.append(a)}});document.getElementById('year').textContent=new Date().getFullYear();let toggle=document.querySelector('.menu-toggle');toggle.addEventListener('click',()=>{let open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}});
function hash(){let id=decodeURIComponent(location.hash.slice(1));if(!id)return;if(id.startsWith('cv-')){document.querySelector('#cv')?.scrollIntoView();let b=document.querySelector('.cv-choice[data-version="'+CSS.escape(id.slice(3))+'"]');b?.click();return}let item=['profiles','experience','qualifications','projects','achievements','music','books','hobbies'].flatMap(k=>data[k]||[]).find(x=>x.id===id);if(item&&!dialog.open)openDetail(item)}window.addEventListener('hashchange',hash);setTimeout(hash,0);
// Type the hero heading once; keep an animated cursor after the text.
const heading=document.querySelector('.typewriter');if(heading&&!matchMedia('(prefers-reduced-motion: reduce)').matches){let value=heading.dataset.text;heading.textContent='';let i=0;let tick=()=>{heading.textContent=value.slice(0,++i);if(i<value.length)setTimeout(tick,195)};setTimeout(tick,450)}
// Reveal each section only once, and keep content accessible without observer support.
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){let observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:.08});document.querySelectorAll('.section:not(.hero)').forEach(x=>{x.classList.add('reveal-ready');observer.observe(x)})}
// Give bookmarked section headings a short highlight on arrival.
document.addEventListener('click',e=>{let a=e.target.closest('a[href^="#"]');if(!a)return;let target=document.querySelector(a.getAttribute('href'));if(target){target.classList.remove('arrived');void target.offsetWidth;target.classList.add('arrived')}});

})();
