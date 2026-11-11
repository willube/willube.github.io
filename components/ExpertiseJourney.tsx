"use client";
import { useRef, useState } from "react";
import { motion, MotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
type Area = { number:string; title:string; type:string; description:string; tags:string[] };
function ChapterArt({index,progress}:{index:number;progress:MotionValue<number>}) {
 const reduced=useReducedMotion();
 const angle=useTransform(progress,[0,1],[-24,40]);
 const y=useTransform(progress,[0,1],[40,-40]);
 const reverse=useTransform(progress,[0,1],[20,-30]);
 return <div className={`chapter-art art-${index}`} aria-hidden="true">
  {index===0 ? <motion.div className="native-assembly" style={reduced?{}:{rotateY:angle,rotateX:reverse}}><div className="chip-plane plane-back"/><div className="chip-plane plane-middle"/><div className="chip-plane plane-front"><span>C++</span><small>Native systems</small></div><div className="chip-axis axis-x"/><div className="chip-axis axis-y"/></motion.div> : index===1 ? <motion.div className="web-assembly" style={reduced?{}:{rotateY:reverse,y}}><div className="web-sheet sheet-back"><span>TypeScript</span></div><div className="web-sheet sheet-main"><div className="wire-toolbar"><i/><i/><i/></div><div className="wire-page"><div className="wire-navigation"/><div className="wire-heading"/><div className="wire-text"/><div className="wire-text short"/><div className="wire-button"/><div className="wire-cards"><i/><i/></div></div><span className="wire-label">React / Next.js</span></div></motion.div> : <motion.div className="cloud-assembly" style={reduced?{}:{y,rotateX:reverse}}><svg className="network-paths" viewBox="0 0 400 340"><path d="M200 80V170M200 170H60V260M200 170H340V260M200 170V280" fill="none" stroke="#51425f" strokeWidth="1"/><circle cx="200" cy="170" r="4" fill="#ad8aee"/></svg><div className="network-node node-top">Cloudflare<span>Edge</span></div><div className="network-node node-left">Discord<span>Identity</span></div><div className="network-node node-right">PostgreSQL<span>Data</span></div><motion.div className="network-signal" animate={reduced?{}:{opacity:[.25,1,.25],y:[0,72,0]}} transition={{duration:4,repeat:Infinity,ease:[.22,1,.36,1]}}/></motion.div>}
 </div>;
}
function Segment({index,progress}:{index:number;progress:MotionValue<number>}) {
 const scaleX=useTransform(progress,[index/3,(index+1)/3],[0,1]);
 return <span className="chapter-segment"><motion.i style={{scaleX}}/></span>;
}
export function ExpertiseJourney({areas}:{areas:Area[]}) {
 const ref=useRef<HTMLDivElement>(null); const reduced=useReducedMotion(); const [active,setActive]=useState(0);
 const {scrollYProgress}=useScroll({target:ref,offset:["start start","end end"]});
 const progress=useSpring(scrollYProgress,{stiffness:140,damping:34});
 const x=useTransform(progress,[0,.08,.46,.54,.92,1],["0%","0%","-33.333333%","-33.333333%","-66.666667%","-66.666667%"]);
 useMotionValueEvent(progress,"change",v=>setActive(v<.27?0:v<.73?1:2));
 function navigate(index:number) {const el=ref.current;if(!el)return;const start=el.getBoundingClientRect().top+window.scrollY;window.scrollTo({top:start+(el.offsetHeight-window.innerHeight)*[.04,.5,.96][index],behavior:reduced?"auto":"smooth"});}
 return <div ref={ref} className={`expertise-journey ${reduced?"journey-reduced":""}`}><div className="journey-pin"><div className="journey-header caption-4"><span>Inside my stack</span><div className="chapter-controls"><button onClick={()=>navigate(Math.max(0,active-1))} disabled={active===0} aria-label="Previous expertise">←</button><span>0{active+1} / 03</span><button onClick={()=>navigate(Math.min(2,active+1))} disabled={active===2} aria-label="Next expertise">→</button></div></div><div className="journey-window"><motion.div className="journey-track" style={reduced?{}:{x}}>{areas.map((area,i)=><article className="chapter" key={area.number}><div className="chapter-copy"><span className="chapter-number" aria-hidden="true">{area.number}</span><p className="eyebrow caption-4">{area.type}</p><h3 className="heading-1">{area.title}<span className="accent">.</span></h3><p className="body-3 muted">{area.description}</p><div className="tags caption-4">{area.tags.map(t=><span key={t}>{t}</span>)}</div></div><ChapterArt index={i} progress={progress}/></article>)}</motion.div></div><div className="journey-footer"><div className="chapter-progress">{areas.map((_,i)=><Segment index={i} progress={progress} key={i}/>)}</div><span className="caption-5 muted">{reduced?"Systems / Web / Infrastructure":"Keep scrolling to explore →"}</span></div></div></div>;
}
