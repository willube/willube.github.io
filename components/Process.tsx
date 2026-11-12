"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Reveal, SplitHeading } from "./Reveal";
import { KineticBand } from "./KineticBand";

const steps=[
 {word:"Understand.",label:"The problem first",text:"What should the software do, and where will it run? Define the boundaries before deciding what belongs in the client, the web application or a connected service.",detail:"Purpose / constraints / environment"},
 {word:"Build.",label:"Make the core work",text:"Start with the interaction or system the rest depends on. Build a working path through it, then give the surrounding pieces a clear structure.",detail:"Prototype / architecture / implementation"},
 {word:"Connect.",label:"Bring the layers together",text:"A client and a website are more useful when their accounts, access and configuration fit together. Treat those connections as part of the experience.",detail:"Identity / services / integration"},
 {word:"Refine.",label:"Care about the last detail",text:"Return to the things people notice: layout on a small screen, keyboard navigation, clear feedback and how an interaction feels. Build, inspect and adjust.",detail:"Performance / interaction / release"},
];
function Step({step,index}:{step:typeof steps[number];index:number}) {
 const ref=useRef<HTMLElement>(null);const reduced=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:["start .95","start .72"]});
 const x=useTransform(scrollYProgress,[0,1],[index%2?32:-32,0]);
 const opacity=useTransform(scrollYProgress,[0,.8],[.15,1]);
 const scaleX=useTransform(scrollYProgress,[0,1],[0,1]);
 return <motion.article ref={ref} className="process-step" style={reduced?{}:{x,opacity}}><div className="process-step-top"><span className="process-index caption-4">0{index+1}</span><span className="caption-4 muted">{step.label}</span></div><h3 className="process-word">{step.word}</h3><p className="body-3 muted">{step.text}</p><p className="caption-4 process-detail">{step.detail}</p><motion.div className="process-line" style={reduced?{}:{scaleX}}/></motion.article>;
}
export function Process(){return <><KineticBand top="Think / Build / Connect" bottom="Inspect / Refine / Release" variant="band-process"/><section id="approach" className="section container process-section"><div className="process-intro"><Reveal><p className="eyebrow caption-3">The approach</p><SplitHeading className="heading-1">From an idea to something you can use.</SplitHeading><p className="body-3 muted">A way of thinking across the whole project, from the system underneath to the screen in front of you.</p></Reveal></div><div className="process-steps">{steps.map((step,i)=><Step key={step.word} step={step} index={i}/>)}</div></section><KineticBand top="Have an idea?" bottom="Let’s talk / Get in touch" variant="band-contact"/></>;}
