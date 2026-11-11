"use client";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export function PortraitDepth({children}:{children:React.ReactNode}) {
  const reduced=useReducedMotion();
  const x=useMotionValue(0),y=useMotionValue(0);
  const rotateX=useSpring(y,{stiffness:110,damping:24});
  const rotateY=useSpring(x,{stiffness:110,damping:24});
  function tilt(e:React.PointerEvent<HTMLDivElement>) {
    if(reduced||e.pointerType!=="mouse")return;
    const r=e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX-r.left)/r.width-.5)*18);
    y.set(-((e.clientY-r.top)/r.height-.5)*14);
  }
  return <motion.div className="portrait-depth" onPointerMove={tilt} onPointerLeave={()=>{x.set(0);y.set(0);}} style={reduced?{}:{rotateX,rotateY}}>{children}</motion.div>;
}
