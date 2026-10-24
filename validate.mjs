import fs from 'node:fs';import vm from 'node:vm';
const files=['site','profiles','experience','qualifications','projects','achievements','journey','music','books','hobbies'];const context={window:{PORTFOLIO:{}}};vm.createContext(context);let issues=[];
for(const f of files){try{vm.runInContext(fs.readFileSync(`content/${f}.js`,'utf8'),context,{filename:f+'.js'})}catch(e){issues.push(`${f}.js: ${e.message}`)}}
const data=context.window.PORTFOLIO,seen=new Set();for(const f of files.slice(1)){for(const item of data[f]||[]){if(!item.id||!item.title)issues.push(`${f}: entry missing id or title`);if(seen.has(item.id))issues.push(`Duplicate id: ${item.id}`);seen.add(item.id);for(const link of item.links||[]){if(!/^https?:\/\//.test(link.url||''))issues.push(`${item.id}: link must be an HTTP(S) URL`)}}}
for(const f of files.slice(1))for(const item of data[f]||[]){
 const sources=item.sources||[];const body=String(item.detail||item.summary||'');
 if(!Array.isArray(sources)){issues.push(`${item.id}: sources must be an array`);continue}
 const ids=new Set();for(const src of sources){
  if(!Number.isInteger(src.id)||src.id<1||ids.has(src.id))issues.push(`${item.id}: invalid or duplicate source id`);
  ids.add(src.id);
  if(!src.label||!/^https?:\/\//.test(src.url||''))issues.push(`${item.id}: source ${src.id} needs a label and HTTP(S) URL`);
 }
 for(const match of body.matchAll(/\[(\d+)\]/g))if(!ids.has(Number(match[1])))issues.push(`${item.id}: missing source [${match[1]}]`);
 for(const src of sources)if(!body.includes(`[${src.id}]`))issues.push(`${item.id}: unused source [${src.id}]`);
}
let sections=data.site?.sectionOrder||[];if(new Set(sections).size!==sections.length)issues.push('Duplicate section ID');const valid=['welcome','about','profiles','experience-qualifications','projects','achievements','journey','cv','music','books','hobbies','contact'];for(const id of sections)if(!valid.includes(id))issues.push(`Unknown section: ${id}`);let cats=new Set((data.site?.projectCategories||[]).map(c=>c.id));for(const p of data.projects||[])if(!cats.has(p.category))issues.push(`Unknown project category: ${p.category} on ${p.id}`);console.log(issues.length?'Validation issues:\n'+issues.join('\n'):'✓ All content checks passed.');process.exitCode=issues.length?1:0;
