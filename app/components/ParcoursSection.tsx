"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { homeStrings } from "@/app/lib/i18n";

interface ParcoursProps {
  isMobile: boolean;
}

export default function ParcoursSection({ isMobile }: ParcoursProps) {
  const { lang } = useLanguage();
  const h = homeStrings[lang];
  const parcoursRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: parcoursProgress } = useScroll({
    target: parcoursRef,
    offset: ["start 85%", "end 30%"],
  });

  return (
    <section id="parcours" className="px-4 pb-16 mt-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100 text-center mb-10">
          {h.parcours.heading}
        </h2>
        <div ref={parcoursRef} className="relative">
          <div
            className="absolute left-1/2 -translate-x-px w-px bg-slate-400/40 dark:bg-slate-600/30"
            style={{ top: "55px", bottom: "55px" }}
          />
          <motion.div
            className="absolute left-1/2 -translate-x-px w-px bg-blue-400 origin-top"
            style={{
              top: "55px",
              scaleY: parcoursProgress,
              height: "calc(100% - 110px)",
              boxShadow: "0 0 8px #60a5fa, 0 0 20px #60a5fa",
            }}
          />
          {h.parcours.items.map((item, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={i}
                className="relative grid grid-cols-2 gap-x-10 pb-10"
                initial={{ opacity: 0, y: 30 }}
                animate={isMobile ? { opacity: 1, y: 0 } : undefined}
                whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                viewport={isMobile ? undefined : { once: true, amount: 0.45 }}
                transition={{ duration: isMobile ? 0 : 0.55, ease: "easeOut" }}
              >
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-400 border-2 border-[#edf1fc] dark:border-[#020617] z-10"
                  style={{ boxShadow: "0 0 6px #60a5fa, 0 0 14px #60a5fa" }}
                />
                <div className={isLeft ? "text-right pr-6 py-1" : ""}>
                  {isLeft && (
                    <>
                      <span className="font-mono text-xs text-blue-500 dark:text-blue-400 block mb-0.5">
                        {item.year}
                      </span>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </>
                  )}
                </div>
                <div className={!isLeft ? "pl-6 py-1" : ""}>
                  {!isLeft && (
                    <>
                      <span className="font-mono text-xs text-blue-500 dark:text-blue-400 block mb-0.5">
                        {item.year}
                      </span>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
