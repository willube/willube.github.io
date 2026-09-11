"use client";

import React from "react";

export const BackgroundMesh: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Razor-sharp 1px grid lines mimicking an architectural editor canvas */}
      <div className="absolute inset-0 bg-grid-editor opacity-40" />

      {/* Subtle vignette focusing attention toward the central content */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_15%,transparent_0%,#191919_100%)]" />

      {/* Very faint top warm ambient reflection */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#E05A47]/[0.025] blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};
