"use client";
import { useState } from "react";
import { AnimatePresence, motion, MotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";

const chapters=[
  {title:"Native at the core.",detail:"C++ desktop software and Win32 integration.",label:"The client"},
  {title:"Connected on the web.",detail:"A responsive platform for accounts, access and configuration.",label:"The platform"},
  {title:"One complete ecosystem.",detail:"Client, web panel and community working together.",label:"The connection"},
];
export function ProjectCaption({progress}:{progress:MotionValue<number>}) {
  const [chapter,setChapter]=useState(0);const reduced=useReducedMotion();
  useMotionValueEvent(progress,"change",v=>setChapter(v<.44?0:v<.68?1:2));
  const data=chapters[chapter];
  return <div className="film-caption"><div className="film-counter caption-4"><span>0{chapter+1} / 03</span><span>{data.label}</span></div><div className="film-copy"><AnimatePresence mode="wait" initial={false}><motion.div key={chapter} initial={reduced?false:{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={reduced?{}:{opacity:0,y:-24}} transition={{duration:.35,ease:[.22,1,.36,1]}}><h3 className="heading-5">{data.title}</h3><p className="caption-2 muted">{data.detail}</p></motion.div></AnimatePresence></div><a className="film-visit caption-4" href="https://deadsense.cc" target="_blank" rel="noreferrer">Visit project ↗</a></div>;
}
