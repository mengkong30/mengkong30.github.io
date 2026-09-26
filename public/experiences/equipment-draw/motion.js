// Values are sampled from the actual AE controllers at 120 Hz.
export const WIDTH=1080,HEIGHT=1920,DURATION=6.6;
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const mix=(a,b,t)=>a+(b-a)*t;
export function sample(timeline,time){const f=clamp(time,0,timeline.duration)*timeline.fps;const i=Math.floor(f),a=timeline.frames[i],b=timeline.frames[Math.min(i+1,timeline.frames.length-1)];return a.map((v,j)=>mix(v,b[j],f-i));}
export function equipmentState(index,phase,bounce,reveal,start=0,target=0){
 const offset=(target-start+10)%10,q=start+phase+offset*clamp(phase/20);
 const d=((index-q+5)%10+10)%10-5,a=Math.abs(d),focus=Math.exp(-2*d*d);
 const edgeU=clamp((a-1.5)/.6),edge=1-edgeU*edgeU*(3-2*edgeU);
 return {index,d,a,x:540+d*430,y:900+35*Math.min(a,2),scale:(.5+.5*focus)*(1+(a<.4?bounce*.0011:0)),alpha:edge*(.72+.28*focus)*(1-reveal/100*.35*(1-focus))};
}
export function randomEquipment(cryptoSource=globalThis.crypto){const n=new Uint32Array(1);do{cryptoSource.getRandomValues(n);}while(n[0]>=4294967290);return n[0]%10;}
