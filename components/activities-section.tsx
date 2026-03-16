"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import { MapPin, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { activitiesApi, Activity } from "@/lib/api"

export function ActivitiesSection() {
  const { t, lang } = useI18n()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [activities, setActivities] = useState<Activity[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    activitiesApi.getPublic().then(setActivities).catch(() => {})
  }, [])

  useEffect(() => {
    if (activities.length === 0) return
    const timer = setInterval(() => {
      setCurrent((v) => (v + 1) % activities.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [activities.length])

  if (activities.length === 0) return null

  return (
    <section className="py-24 bg-white" id="activities" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "#fdeaea", color: "#E31E24" }}
            >
              {t.activities.subtitle}
            </span>
            <h2 className="font-serif font-black text-4xl lg:text-5xl text-gray-900">
              {t.activities.title}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrent((v) => (v - 1 + activities.length) % activities.length)}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#1B6EC2] hover:text-white hover:border-[#1B6EC2] transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrent((v) => (v + 1) % activities.length)}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#1B6EC2] hover:text-white hover:border-[#1B6EC2] transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, i) => (
            <motion.div
              key={activity.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -4 }}
            >
              <div className="relative h-48 sm:h-52 overflow-hidden">
                <Image
                  src={activity.image ?? "/images/hero.png"}
                  alt={lang === "fr" ? activity.titleFr : activity.titleEn}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${activity.status === "ONGOING" ? "bg-green-500" : "bg-gray-500"}`}>
                    {lang === "fr"
                      ? activity.status === "ONGOING" ? "En cours" : "Terminé"
                      : activity.status === "ONGOING" ? "Ongoing" : "Completed"}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-2 leading-snug">
                  {lang === "fr" ? activity.titleFr : activity.titleEn}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {lang === "fr" ? activity.descriptionFr : activity.descriptionEn}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} style={{ color: "#E31E24" }} />
                    {activity.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} style={{ color: "#1B6EC2" }} />
                    {activity.date}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
