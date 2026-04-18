"use client"

import { useRef, useState, useEffect } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { useI18n } from "@/lib/i18n"
import { statsApi, ImpactStat } from "@/lib/api"

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export function StatsSection() {
  const { t } = useI18n()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [stats, setStats] = useState<ImpactStat | null>(null)

  useEffect(() => {
    statsApi.getImpact().then(setStats).catch(() => {
      setStats({ id: "", communities: 150, trained: 12000, responses: 87, initiatives: 45 })
    })
  }, [])

  const items = stats
    ? [
        { value: stats.communities, suffix: "+", label: t.stats.communities, color: "var(--sos-blue)" },
        { value: stats.trained, suffix: "+", label: t.stats.trained, color: "var(--sos-red)" },
        { value: stats.responses, suffix: "", label: t.stats.responses, color: "var(--sos-blue)" },
        { value: stats.initiatives, suffix: "+", label: t.stats.initiatives, color: "var(--sos-red)" },
      ]
    : []

  return (
    <section className="py-20" style={{ background: "#0a1e46" }} ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif font-black text-4xl text-white mb-3">{t.stats.title}</h2>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ background: "var(--sos-red)" }} />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <div
                className="text-5xl lg:text-6xl font-black font-serif mb-3"
                style={{ color: stat.color }}
              >
                <AnimatedCounter target={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-white/70 text-sm font-medium uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
