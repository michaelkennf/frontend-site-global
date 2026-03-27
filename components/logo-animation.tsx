"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"

interface LogoAnimationProps {
  onComplete?: () => void
}

export function LogoAnimation({ onComplete }: LogoAnimationProps) {
  const controls = useAnimation()
  const [phase, setPhase] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    async function run() {
      // Phase 1: dove appears from left
      setPhase(1)
      await new Promise((r) => setTimeout(r, 800))
      // Phase 2: dove flies right
      setPhase(2)
      await new Promise((r) => setTimeout(r, 900))
      // Phase 3: dove lands
      setPhase(3)
      await new Promise((r) => setTimeout(r, 600))
      // Phase 4: globe + text fade in
      setPhase(4)
      await new Promise((r) => setTimeout(r, 900))
      // Phase 5: full logo
      setPhase(5)
      await new Promise((r) => setTimeout(r, 700))
      setDone(true)
      onComplete?.()
    }
    run()
  }, [onComplete])

  if (done) return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
      animate={done ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex flex-col items-center justify-center" style={{ width: 320, height: 320 }}>
        {/* Dove SVG */}
        <motion.div
          className="absolute"
          style={{ top: 20 }}
          initial={{ x: -200, opacity: 0 }}
          animate={
            phase >= 1
              ? phase === 1
                ? { x: -200, opacity: 1 }
                : phase === 2
                ? { x: 0, opacity: 1, y: -10 }
                : phase >= 3
                ? { x: 0, opacity: 1, y: 0 }
                : {}
              : {}
          }
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Dove body */}
            <motion.path
              d="M80 90 C60 85 30 70 20 50 C10 30 30 10 50 20 C70 30 90 20 110 25 C130 30 150 45 140 65 C130 85 100 95 80 90Z"
              fill="#0057B8"
              fillOpacity="0.15"
              stroke="#0057B8"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={phase >= 1 ? { pathLength: 1 } : {}}
              transition={{ duration: 0.8 }}
            />
            {/* Left wing */}
            <motion.path
              d="M80 70 C60 50 20 35 10 20 C20 15 50 25 80 45 C80 55 80 65 80 70Z"
              fill="#0057B8"
              fillOpacity="0.2"
              stroke="#0057B8"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={phase >= 1 ? { pathLength: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            {/* Right wing up */}
            <motion.path
              d="M85 60 C110 35 140 20 155 15 C150 30 130 45 100 55 C95 58 90 60 85 60Z"
              fill="#0057B8"
              fillOpacity="0.2"
              stroke="#0057B8"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={phase >= 1 ? { pathLength: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            {/* Olive branch */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={phase >= 2 ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
            >
              <path d="M105 22 C115 14 125 10 130 8" stroke="#0057B8" strokeWidth="1.5" />
              <circle cx="112" cy="17" r="3" fill="#0057B8" fillOpacity="0.6" />
              <circle cx="120" cy="13" r="3" fill="#0057B8" fillOpacity="0.6" />
              <circle cx="127" cy="10" r="3" fill="#0057B8" fillOpacity="0.6" />
            </motion.g>
            {/* Eye */}
            <motion.circle
              cx="50" cy="42" r="4"
              fill="#0057B8"
              initial={{ scale: 0 }}
              animate={phase >= 2 ? { scale: 1 } : {}}
              transition={{ duration: 0.3 }}
            />
          </svg>
        </motion.div>

        {/* Globe */}
        <motion.div
          className="absolute"
          style={{ bottom: 20 }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={phase >= 4 ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Globe arc */}
            <motion.path
              d="M15 70 C15 70 30 20 90 20 C150 20 165 70 165 70 C165 70 150 120 90 120 C30 120 15 70 15 70Z"
              stroke="#E31E24"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={phase >= 4 ? { pathLength: 1 } : {}}
              transition={{ duration: 0.8 }}
            />
            {/* Globe lines */}
            <motion.path d="M20 55 Q90 45 160 55" stroke="#E31E24" strokeWidth="1.5" fill="none"
              initial={{ pathLength: 0 }}
              animate={phase >= 4 ? { pathLength: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }} />
            <motion.path d="M25 85 Q90 75 155 85" stroke="#E31E24" strokeWidth="1.5" fill="none"
              initial={{ pathLength: 0 }}
              animate={phase >= 4 ? { pathLength: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }} />
            <motion.path d="M90 22 Q90 70 90 118" stroke="#E31E24" strokeWidth="1.5" fill="none"
              initial={{ pathLength: 0 }}
              animate={phase >= 4 ? { pathLength: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }} />
            <motion.path d="M60 25 Q55 70 60 115" stroke="#E31E24" strokeWidth="1.2" fill="none"
              initial={{ pathLength: 0 }}
              animate={phase >= 4 ? { pathLength: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }} />
            <motion.path d="M120 25 Q125 70 120 115" stroke="#E31E24" strokeWidth="1.2" fill="none"
              initial={{ pathLength: 0 }}
              animate={phase >= 4 ? { pathLength: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }} />
          </svg>
        </motion.div>

        {/* Text */}
        <motion.div
          className="absolute"
          style={{ bottom: 30 }}
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <span className="font-serif font-bold text-3xl" style={{ color: "#0057B8" }}>Global</span>
            <br />
            <span className="font-serif font-black text-4xl" style={{ color: "#E31E24" }}>SOS</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
