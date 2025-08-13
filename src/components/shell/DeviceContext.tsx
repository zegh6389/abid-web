"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Device = { isMobile: boolean };

const Ctx = createContext<Device>({ isMobile: false });

export function DeviceProvider({ initialIsMobile, children }: { initialIsMobile: boolean; children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(initialIsMobile);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse), (max-width: 768px)");
    const on = () => setIsMobile(mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);

  return <Ctx.Provider value={{ isMobile }}>{children}</Ctx.Provider>;
}

export const useDevice = () => useContext(Ctx);
