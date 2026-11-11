"use client";
import { ProjectCaption } from "./ProjectCaption";
import { createContext, useContext, useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, MotionValue } from "framer-motion";
const SceneProgress = createContext<MotionValue<number> | null>(null);
const curve = [.22, 1, .36, 1] as const;
export function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
 const ref=useRef<HTMLDivElement>(null); const reduced=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:["start .98","start .55"]});
 const y=useTransform(scrollYProgress,[0,1],[120,0]);
 const opacity=useTransform(scrollYProgress,[0,.8],[0,1]);
 const scale=useTransform(scrollYProgress,[0,1],[.94,1]);
 return <motion.div ref={ref} className={`reveal ${className}`} style={reduced?{}:{y,opacity,scale}}>{children}</motion.div>;
}
export function SideReveal({children,index}:{children:React.ReactNode;index:number}) {
 const ref=useRef<HTMLDivElement>(null); const reduced=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:["start end","end start"]});
 const progress=useSpring(scrollYProgress,{stiffness:130,damping:30});
 const direction=index%2===0?-1:1;
 const x=useTransform(progress,[0,.32,.7,1],[direction*300,0,0,-direction*160]);
 const rotate=useTransform(progress,[0,.32,.7,1],[direction*8,0,0,-direction*4]);
 const scale=useTransform(progress,[0,.32,.7,1],[.8,1,1,.9]);
 const opacity=useTransform(progress,[0,.28,.8,1],[0,1,1,0]);
 return <motion.div ref={ref} className="side-reveal" style={reduced?{}:{x,rotate,scale,opacity}}>{children}</motion.div>;
}
export function MotionRibbon() {
 const ref=useRef<HTMLDivElement>(null); const reduced=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:["start end","end start"]});
 const x=useTransform(scrollYProgress,[0,1],["8%","-28%"]);
 const reverse=useTransform(scrollYProgress,[0,1],["-28%","8%"]);
 return <div ref={ref} className="motion-ribbon" aria-label="C++, native systems, React, TypeScript and web platforms"><motion.div aria-hidden="true" className="ribbon-row" style={reduced?{}:{x}}>C++ / Native / Win32 / C++ / Native / Win32</motion.div><motion.div aria-hidden="true" className="ribbon-row ribbon-outline" style={reduced?{}:{x:reverse}}>React / Web / TypeScript / React / Web / TypeScript</motion.div></div>;
}
export function AnimatedPreview() {
 const progress=useContext(SceneProgress); const reduced=useReducedMotion();
 if(!progress) return <img src="/deadsense-current.jpg" width="1280" height="720" alt="Current DeadSense homepage" loading="lazy"/>;
 return <PreviewImage progress={progress} reduced={reduced}/>;
}
function PreviewImage({progress,reduced}:{progress:MotionValue<number>;reduced:boolean|null}) {
 const scale=useTransform(progress,[.3,.85],[1,1.18]);
 const x=useTransform(progress,[.3,.85],["0%","-4%"]);
 return <div className="preview-image-mask"><motion.img src="/deadsense-current.jpg" width="1280" height="720" alt="Current DeadSense homepage with its split layout and interactive client preview" loading="lazy" style={reduced?{}:{scale,x}}/></div>;
}
export function SplitHeading({children,className=""}:{children:string;className?:string}) {
 const reduced=useReducedMotion();
 return <motion.h2 className={`split-heading ${className}`} aria-label={children} initial="hidden" whileInView="visible" viewport={{once:true,amount:.5}} transition={{staggerChildren:.075}}>{children.split(" ").map((word,i)=><span className="word-mask" aria-hidden="true" key={i}><motion.span variants={{hidden:{y:reduced?0:"110%",opacity:reduced?1:0},visible:{y:0,opacity:1}}} transition={{duration:.85,ease:curve}}>{word}&nbsp;</motion.span></span>)}</motion.h2>;
}
export function ScrollScene({children}:{children:React.ReactNode}) {
 const ref=useRef<HTMLDivElement>(null); const reduced=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:["start .8","end .2"]});
 const progress=useSpring(scrollYProgress,{stiffness:120,damping:32});
 const rotateX=useTransform(progress,[0,.45,.8,1],[48,0,0,-16]);
 const rotateZ=useTransform(progress,[0,.45,.8,1],[-14,0,0,6]);
 const scale=useTransform(progress,[0,.45,.8,1],[.4,1,1,.85]);
 const y=useTransform(progress,[0,.45,1],[120,0,-32]);
 return <div ref={ref} className={`scroll-scene ${reduced?"scene-reduced":""}`}><div className="scene-pin"><motion.div className="scene-object" style={reduced?{}:{rotateX,rotateZ,scale,y}}><SceneProgress.Provider value={progress}>{children}</SceneProgress.Provider></motion.div><ProjectCaption progress={progress}/></div></div>;
}
const words=["I","build","the","client,","the","platform","and","everything","between."];
function ScrollWord({word,index,progress}:{word:string;index:number;progress:MotionValue<number>}) {
 const reduced=useReducedMotion(); const start=index/words.length*.75;
 const opacity=useTransform(progress,[start,start+.15],[.18,1]);
 const y=useTransform(progress,[start,start+.15],[64,0]);
 const rotateX=useTransform(progress,[start,start+.15],[75,0]);
 return <span className="statement-word-mask"><motion.span style={reduced?{}:{opacity,y,rotateX}}>{word}&nbsp;</motion.span></span>;
}
export function Tagline() {
 const ref=useRef<HTMLDivElement>(null);
 const {scrollYProgress}=useScroll({target:ref,offset:["start .5","end .8"]});
 return <div ref={ref} className="statement-track"><div className="statement-pin"><p className="heading-1 statement">{words.map((word,i)=><ScrollWord key={i} word={word} index={i} progress={scrollYProgress}/>)}</p></div></div>;
}
export function ScrollProgress() {
 const {scrollYProgress}=useScroll(); const scaleX=useSpring(scrollYProgress,{stiffness:120,damping:30});
 return <motion.div className="scroll-progress" style={{scaleX}} aria-hidden="true"/>;
}
