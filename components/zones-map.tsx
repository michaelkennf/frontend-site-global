"use client"

import { useEffect, useRef } from "react"
import type { GeoJSON as LeafletGeoJSON, Map as LeafletMap } from "leaflet"
import "leaflet/dist/leaflet.css"

const SUD_KIVU_NAME = "Sud-Kivu"
/** Bleu foncé — zone d'intervention actuelle */
const SUD_KIVU_FILL = "#0B3D5C"
/** Bleu ciel — autres provinces */
const OTHER_FILL = "#A8DFF5"
const OTHER_STROKE = "#5BB8D9"
const TERRITORY_STROKE = "#FFFFFF"

type ZonesMapProps = {
  lang: "fr" | "en"
}

export function ZonesMap({ lang }: ZonesMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)

  useEffect(() => {
    let cancelled = false
    let map: LeafletMap | null = null
    let provincesLayer: LeafletGeoJSON | null = null
    let territoriesLayer: LeafletGeoJSON | null = null

    async function init() {
      if (!containerRef.current || mapRef.current) return

      const L = (await import("leaflet")).default
      if (cancelled || !containerRef.current) return

      map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        attributionControl: false,
        zoomControl: true,
      }).setView([-2.5, 23.5], 5)

      const [provincesRes, territoriesRes] = await Promise.all([
        fetch("/geojson/province.geojson"),
        fetch("/geojson/territoires-sud-kivu.geojson"),
      ])
      if (cancelled || !map) return

      const provinces = await provincesRes.json()
      const territories = await territoriesRes.json()

      provincesLayer = L.geoJSON(provinces, {
        style: (feature) => {
          const isSudKivu = feature?.properties?.NOM === SUD_KIVU_NAME
          return {
            fillColor: isSudKivu ? SUD_KIVU_FILL : OTHER_FILL,
            fillOpacity: isSudKivu ? 0.95 : 0.85,
            color: isSudKivu ? SUD_KIVU_FILL : OTHER_STROKE,
            weight: isSudKivu ? 2 : 1,
          }
        },
        onEachFeature: (feature, layer) => {
          const name = feature.properties?.NOM ?? ""
          const isSudKivu = name === SUD_KIVU_NAME
          const label = isSudKivu
            ? lang === "fr"
              ? `${name} — zone d'intervention actuelle`
              : `${name} — current intervention zone`
            : name
          layer.bindTooltip(label, { sticky: true })
        },
      }).addTo(map)

      territoriesLayer = L.geoJSON(territories, {
        style: {
          fillColor: "transparent",
          fillOpacity: 0,
          color: TERRITORY_STROKE,
          weight: 1.25,
          opacity: 0.9,
        },
        onEachFeature: (feature, layer) => {
          const name = feature.properties?.NOM ?? ""
          const type = feature.properties?.TYPE ?? ""
          layer.bindTooltip(`${name}${type ? ` (${type})` : ""}`, { sticky: true })
        },
      }).addTo(map)

      const bounds = provincesLayer.getBounds()
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [24, 24], maxZoom: 6 })
      }

      mapRef.current = map
    }

    void init()

    return () => {
      cancelled = true
      provincesLayer?.remove()
      territoriesLayer?.remove()
      map?.remove()
      mapRef.current = null
    }
  }, [lang])

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="h-[420px] md:h-[560px] w-full overflow-hidden border border-gray-200 bg-white z-0 [&_.leaflet-container]:bg-white"
        aria-label={lang === "fr" ? "Carte des zones d'intervention" : "Intervention zones map"}
      />
      <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3.5 w-3.5 rounded-sm" style={{ backgroundColor: SUD_KIVU_FILL }} />
          {lang === "fr" ? "Sud-Kivu — zone actuelle" : "South Kivu — current zone"}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3.5 w-3.5 rounded-sm border border-gray-300" style={{ backgroundColor: OTHER_FILL }} />
          {lang === "fr" ? "Autres provinces" : "Other provinces"}
        </span>
      </div>
    </div>
  )
}
