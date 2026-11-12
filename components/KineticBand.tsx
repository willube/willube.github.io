"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

export function KineticBand({top,bottom,variant=""}:{top:string;bottom:string;variant?:string}) {
  const ref=useRef<HTMLDivElement>(null);const reduced=useReducedMotion();
  const {scrollYProgress,scrollY}=useScroll({target:ref,offset:["start end","end start"]});
  const x=useTransform(scrollYProgress,[0,1],["4%","-24%"]);
  const reverse=useTransform(scrollYProgress,[0,1],["-24%","4%"]);
  const velocity=useVelocity(scrollY);
  const smooth=useSpring(velocity,{stiffness:70,damping:30});
  const skewX=useTransform(smooth,[-1800,0,1800],[-5,0,5]);
  return <div ref={ref} className={`kinetic-band ${variant}`} aria-label={`${top}. ${bottom}.`}><motion.div className="kinetic-track" aria-hidden="true" style={reduced?{}:{x,skewX}}>{top} / {top} / {top} / {top}</motion.div><motion.div className="kinetic-track kinetic-outline" aria-hidden="true" style={reduced?{}:{x:reverse,skewX}}>{bottom} / {bottom} / {bottom} / {bottom}</motion.div></div>;
}
