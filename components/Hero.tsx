"use client";
import { PortraitDepth } from "./PortraitDepth";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, MotionValue } from "framer-motion";
function NameLetter({letter,index,progress}:{letter:string;index:number;progress:MotionValue<number>}) {
 const reduced=useReducedMotion();
 const y=useTransform(progress,[0,.75],[0,(index%2===0?-1:1)*(100+index*24)]);
 const x=useTransform(progress,[0,.75],[0,(index-2)*48]);
 const rotate=useTransform(progress,[0,.75],[0,(index-2)*12]);
 return <motion.span className={letter==="."?"letter name-dot":"letter"} aria-hidden="true" style={reduced?{}:{x,y,rotate}}>{letter}</motion.span>;
}
export function Hero() {
 const ref=useRef<HTMLElement>(null); const reduced=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:["start start","end start"]});
 const imageY=useTransform(scrollYProgress,[0,1],[0,-160]);
 const copyY=useTransform(scrollYProgress,[0,1],[0,-220]);
 const rotate=useTransform(scrollYProgress,[0,1],[0,-12]);
 const rotateY=useTransform(scrollYProgress,[0,1],[0,28]);
 const imageScale=useTransform(scrollYProgress,[0,1],[1,1.35]);
 const fade=useTransform(scrollYProgress,[0,.8],[1,.1]);
 return <section ref={ref} id="home" className="hero container"><div className="hero-top caption-4"><span>Systems & full stack developer</span><span>Portfolio / 2026</span></div><div className="hero-layout"><motion.div className="hero-copy" style={reduced?{}:{y:copyY,opacity:fade}}><motion.p className="eyebrow caption-4" initial={reduced?false:{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.8}}>Aury / @willube</motion.p><h1 className="hero-name scattered-name" aria-label="Aury">{"Aury.".split("").map((letter,i)=><NameLetter key={i} letter={letter} index={i} progress={scrollYProgress}/>)}</h1><motion.div initial={reduced?false:{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.9,delay:.2,ease:[.22,1,.36,1]}}><p className="heading-3 hero-role">Native software.<br/>Connected experiences.</p><p className="body-3 hero-description">Founder & lead developer of DeadSense.<br/>C++, web platforms and the systems behind them.</p><a className="button button-md" href="#deadsense">View my work <span aria-hidden="true">↘</span></a><a className="hero-github caption-2" href="https://github.com/willube" target="_blank" rel="noreferrer">GitHub ↗</a></motion.div></motion.div><motion.figure className="portrait" initial={reduced?false:{opacity:0,y:48}} animate={{opacity:1,y:0}} transition={{duration:1.2,delay:.1,ease:[.22,1,.36,1]}} style={reduced?{}:{y:imageY,rotate,rotateY}}><PortraitDepth><motion.img src="/aury-profile.jpg" width="735" height="490" alt="Aury’s black and white profile image: a figure wearing a metallic mask" fetchPriority="high" style={reduced?{}:{scale:imageScale}}/></PortraitDepth><motion.div className="portrait-shutter" aria-hidden="true" initial={reduced?false:{scaleY:1}} animate={{scaleY:0}} transition={{duration:1.4,delay:.2,ease:[.22,1,.36,1]}}/><figcaption className="caption-4"><span>Aury</span><span>Developer & founder</span></figcaption></motion.figure></div><div className="hero-bottom caption-4"><a href="https://deadsense.cc" target="_blank" rel="noreferrer">Currently building DeadSense ↗</a><a href="#deadsense" className="scroll-cue">Scroll to explore <span>↓</span></a></div></section>;
}
