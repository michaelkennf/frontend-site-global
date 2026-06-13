"use client"

import {
  LayoutSettings,
  LAYOUT_OPTIONS,
  TextAlign,
  ContentWidth,
} from "@/lib/article-layout"
import { cn } from "@/lib/utils"
import { LayoutTemplate, AlignLeft, AlignCenter, AlignJustify } from "lucide-react"

interface LayoutSettingsFormProps {
  value: LayoutSettings
  onChange: (next: LayoutSettings) => void
}

export function LayoutSettingsForm({ value, onChange }: LayoutSettingsFormProps) {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/80 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
        <LayoutTemplate size={16} className="text-[var(--sos-blue)]" />
        Disposition sur le site
      </div>

      <div className="grid sm:grid-cols-2 gap-2">
        {LAYOUT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange({ ...value, layout: opt.id })}
            className={cn(
              "text-left p-3 rounded-lg border-2 transition-all",
              value.layout === opt.id
                ? "border-[var(--sos-blue)] bg-white shadow-sm"
                : "border-transparent bg-white hover:border-gray-200",
            )}
          >
            <span className="block text-sm font-bold text-gray-900">{opt.labelFr}</span>
            <span className="block text-xs text-gray-500 mt-0.5">{opt.descFr}</span>
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1.5 block">Alignement du texte</label>
          <div className="flex gap-1">
            {(
              [
                { id: "left" as TextAlign, icon: AlignLeft, label: "Gauche" },
                { id: "center" as TextAlign, icon: AlignCenter, label: "Centré" },
                { id: "justify" as TextAlign, icon: AlignJustify, label: "Justifié" },
              ] as const
            ).map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                title={label}
                onClick={() => onChange({ ...value, textAlign: id })}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1 py-2 rounded-md border text-xs font-medium transition-colors",
                  value.textAlign === id
                    ? "border-[var(--sos-blue)] bg-[var(--sos-blue-light)]/50 text-[var(--sos-blue-dark)]"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
                )}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1.5 block">Largeur du contenu</label>
          <select
            className="w-full h-9 rounded-md border border-gray-200 bg-white px-2 text-sm"
            value={value.contentWidth}
            onChange={(e) =>
              onChange({ ...value, contentWidth: e.target.value as ContentWidth })
            }
          >
            <option value="narrow">Étroit — lecture confortable</option>
            <option value="medium">Moyen — équilibré</option>
            <option value="wide">Large — plus d&apos;espace</option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
        <input
          type="checkbox"
          checked={value.showExcerpt}
          onChange={(e) => onChange({ ...value, showExcerpt: e.target.checked })}
          className="rounded border-gray-300"
        />
        Afficher le résumé / chapô au-dessus du contenu
      </label>
    </div>
  )
}
