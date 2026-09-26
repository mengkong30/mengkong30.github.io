import {EquipmentRenderer} from './renderer.js';
import {clamp,randomEquipment,DURATION} from './motion.js';
const canvas=document.querySelector('#scene'),draw=document.querySelector('#draw'),reset=document.querySelector('#reset'),loading=document.querySelector('#loading'),announcement=document.querySelector('#announcement');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let renderer,mode='loading',frame=0,start=0,target=0,time=0,startedAt=0,tap=[540,1615],pausedAt=0;
function paint(){renderer?.render(time,{start,target,tap});draw.dataset.state=mode;draw.dataset.time=time.toFixed(3);draw.dataset.winner=String(target);}
function setMode(next){mode=next;draw.disabled=next==='loading'||next==='running';reset.disabled=next==='loading';draw.setAttribute('aria-busy',String(next==='running'));draw.setAttribute('aria-label',next==='result'?`获得${renderer.data[target].name}，点击继续抽取`:'点击抽取装备');paint();}
function tick(now){time=Math.min(DURATION,(now-startedAt)/1000+.66);paint();if(time<DURATION){frame=requestAnimationFrame(tick);}else{setMode('result');announcement.textContent=`获得装备：${renderer.data[target].name}。点击画面继续抽取。`;}}
function begin(event){if(mode==='error'){prepare();return;}if(!renderer||mode==='running'||mode==='loading')return;cancelAnimationFrame(frame);start=target;target=randomEquipment();const bounds=draw.getBoundingClientRect();tap=event.detail&&Number.isFinite(event.clientX)?[clamp((event.clientX-bounds.left)/bounds.width)*1080,clamp((event.clientY-bounds.top)/bounds.height)*1920]:[540,1615];announcement.textContent='正在抽取装备';if(reduced.matches){time=DURATION;setMode('result');announcement.textContent=`获得装备：${renderer.data[target].name}`;return;}time=.66;startedAt=performance.now();setMode('running');frame=requestAnimationFrame(tick);}
function restart(){cancelAnimationFrame(frame);start=0;target=0;time=0;pausedAt=0;setMode('idle');announcement.textContent='已重置，可以重新抽取。';}
draw.addEventListener('click',begin);reset.addEventListener('click',()=>mode==='error'?prepare():restart());
new ResizeObserver(()=>{if(renderer){renderer.resize();paint();}}).observe(draw);
document.addEventListener('visibilitychange',()=>{if(mode!=='running')return;if(document.hidden){pausedAt=performance.now();cancelAnimationFrame(frame);}else if(pausedAt){startedAt+=performance.now()-pausedAt;pausedAt=0;frame=requestAnimationFrame(tick);}});
async function prepare(){loading.hidden=false;loading.textContent='正在准备装备…';draw.disabled=true;reset.disabled=true;mode='loading';try{const results=await Promise.all(['shapes.json','timeline.json'].map(async file=>{const response=await fetch(new URL(file,import.meta.url));if(!response.ok)throw Error('素材未就绪');return response.json();}));if(results[0].length!==10||results[1].frames.length<2)throw Error('素材不完整');renderer=new EquipmentRenderer(canvas,...results);loading.hidden=true;reset.textContent='↻ 重新体验';restart();
 // Explicit inspection URLs let the source animation be compared at the same frame.
 const query=new URLSearchParams(location.search);if(query.get('mode')==='review'){const value=Number(query.get('time'));time=Number.isFinite(value)?clamp(value,0,DURATION):0;target=clamp(Number(query.get('winner'))||0,0,9);mode='review';draw.disabled=true;paint();}
 }catch(error){mode='error';loading.textContent='装备加载失败，请点击重试';draw.disabled=false;reset.disabled=false;reset.textContent='重试加载';announcement.textContent='装备加载失败，请重试。';draw.setAttribute('aria-label','重新加载装备');}}
prepare();
