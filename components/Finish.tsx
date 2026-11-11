"use client";
import { useRef } from "react";
import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";

function Letter({letter,index,progress}:{letter:string;index:number;progress:MotionValue<number>}) {
  const reduced=useReducedMotion();
  const y=useTransform(progress,[.05+index*.035,.7+index*.035],[180+index*24,0]);
  const rotateX=useTransform(progress,[.05+index*.035,.7+index*.035],[65,0]);
  return <motion.span className={letter==="."?"end-letter accent":"end-letter"} style={reduced?{}:{y,rotateX}}>{letter}</motion.span>;
}
export function Finish() {
  const ref=useRef<HTMLDivElement>(null);
  const {scrollYProgress}=useScroll({target:ref,offset:["start end","end end"]});
  return <div ref={ref} className="outro container"><div className="outro-top caption-4"><span>From the first line to the final detail.</span><a href="#home">Back to the start ↑</a></div><a href="mailto:privataury@gmail.com" className="end-signature" aria-label="Email Aury">{"aury.".split("").map((letter,i)=><Letter key={i} letter={letter} index={i} progress={scrollYProgress}/>)}</a></div>;
}
