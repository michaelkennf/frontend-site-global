"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useI18n } from "@/lib/i18n"
import { Shield, Heart, Leaf, CheckCircle2 } from "lucide-react"

const areaIcons = [Shield, Heart, Leaf]
const areaColors = [
  { bg: "#E6EFF9", border: "#0057B8", icon: "#0057B8" },
  { bg: "#fdeaea", border: "#E31E24", icon: "#E31E24" },
  { bg: "#e6f9f0", border: "#16a34a", icon: "#16a34a" },
]

export function AreasSection() {
  const { t } = useI18n()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const areas = [
    {
      title: t.areas.area1Title,
      desc: t.areas.area1Desc,
      items: t.areas.area1Items,
    },
    {
      title: t.areas.area2Title,
      desc: t.areas.area2Desc,
      items: t.areas.area2Items,
    },
    {
      title: t.areas.area3Title,
      desc: t.areas.area3Desc,
      items: t.areas.area3Items,
    },
  ]

  return (
    <section id="work" className="py-24 bg-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: "#E6EFF9", color: "#0057B8" }}
          >
            {t.areas.subtitle}
          </span>
          <h2 className="font-serif font-black text-4xl lg:text-5xl text-gray-900 text-balance">
            {t.areas.title}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {areas.map((area, i) => {
            const Icon = areaIcons[i]
            const colors = areaColors[i]
            return (
              <motion.div
                key={area.title}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -4 }}
              >
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ background: colors.bg, border: `2px solid ${colors.border}20` }}
                >
                  <Icon size={24} style={{ color: colors.icon }} />
                </div>

                <h3
                  className="font-serif font-bold text-xl mb-3 text-gray-900 leading-snug"
                >
                  {area.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{area.desc}</p>

                {/* Items */}
                <ul className="space-y-2">
                  {area.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2
                        size={15}
                        className="mt-0.5 shrink-0"
                        style={{ color: colors.icon }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
