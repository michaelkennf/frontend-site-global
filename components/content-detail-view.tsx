"use client"

import Image from "next/image"
import { Calendar, MapPin } from "lucide-react"
import { HeroRedDivider } from "@/components/hero-red-divider"
import { renderBodyWithInlineImages } from "@/lib/render-inline-body"
import {
  parseLayoutSettings,
  contentWidthClass,
  textAlignClass,
} from "@/lib/article-layout"
import { cn } from "@/lib/utils"

export interface ContentDetailMeta {
  categoryLabel?: string
  statusLabel?: string
  statusVariant?: "ongoing" | "completed" | "draft" | "published"
  date?: string
  location?: string
  authorName?: string
  readingMinutes?: number
  readingMinLabel?: string
}

export interface ContentDetailViewProps {
  title: string
  excerpt?: string
  body: string
  image?: string
  inlineImages?: string | null
  layoutSettings?: string | null
  lang: "fr" | "en"
  meta?: ContentDetailMeta
  /** Aperçu admin : images via balise img */
  preview?: boolean
}

const COVER_FALLBACK = "/images/hero image.png"

function CoverImage({
  src,
  alt,
  className,
  priority,
  preview,
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
  preview?: boolean
}) {
  if (preview) {
    return (
      <img src={src || COVER_FALLBACK} alt={alt} className={cn("object-cover object-center w-full h-full", className)} />
    )
  }
  return (
    <Image
      src={src || COVER_FALLBACK}
      alt={alt}
      fill
      priority={priority}
      sizes="100vw"
      className={cn("object-cover object-center", className)}
    />
  )
}

function MetaRow({ meta, lang }: { meta?: ContentDetailMeta; lang: "fr" | "en" }) {
  if (!meta) return null
  const statusColors: Record<string, string> = {
    ongoing: "bg-[var(--sos-blue)] text-white",
    completed: "bg-[var(--sos-red-light)] text-[var(--sos-red-dark)]",
    draft: "bg-gray-100 text-gray-600",
    published: "bg-[var(--sos-blue-light)] text-[var(--sos-blue-dark)]",
  }
  return (
    <div className="flex flex-wrap items-center gap-3 mb-5">
      {meta.categoryLabel && (
        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[var(--sos-blue-light)] text-[var(--sos-blue-dark)] uppercase tracking-widest">
          {meta.categoryLabel}
        </span>
      )}
      {meta.statusLabel && (
        <span
          className={cn(
            "text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest",
            statusColors[meta.statusVariant ?? "ongoing"],
          )}
        >
          {meta.statusLabel}
        </span>
      )}
    </div>
  )
}

function MetaDetails({ meta, lang }: { meta?: ContentDetailMeta; lang: "fr" | "en" }) {
  if (!meta) return null
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-4">
      {meta.date && (
        <span className="inline-flex items-center gap-1">
          <Calendar size={14} />
          {meta.date}
        </span>
      )}
      {meta.location && (
        <span className="inline-flex items-center gap-1">
          <MapPin size={14} />
          {meta.location}
        </span>
      )}
      {meta.readingMinutes != null && meta.readingMinLabel && (
        <span>
          {meta.readingMinutes} {meta.readingMinLabel}
        </span>
      )}
      {meta.authorName && (
        <span>
          {lang === "fr" ? "Par" : "By"} <strong>{meta.authorName}</strong>
        </span>
      )}
    </div>
  )
}

function BodyBlock({
  body,
  inlineImages,
  imageAlt,
  widthClass,
  alignClass,
}: {
  body: string
  inlineImages?: string | null
  imageAlt: string
  widthClass: string
  alignClass: string
}) {
  return (
    <section className="py-10 md:py-14 bg-white">
      <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", widthClass)}>
        <div className={cn("prose prose-lg max-w-none text-gray-700 leading-relaxed", alignClass)}>
          {renderBodyWithInlineImages(body, inlineImages, imageAlt)}
        </div>
      </div>
    </section>
  )
}

export function ContentDetailView({
  title,
  excerpt,
  body,
  image,
  inlineImages,
  layoutSettings,
  lang,
  meta,
  preview,
}: ContentDetailViewProps) {
  const settings = parseLayoutSettings(layoutSettings)
  const widthClass = contentWidthClass(settings.contentWidth)
  const alignClass = textAlignClass(settings.textAlign)
  const cover = image || COVER_FALLBACK
  const showExcerpt = settings.showExcerpt && excerpt?.trim()

  if (settings.layout === "immersive") {
    return (
      <div className="bg-white">
        <section className="relative min-h-[320px] md:min-h-[420px] flex items-end">
          <div className="absolute inset-0">
            <CoverImage src={cover} alt={title} preview={preview} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </div>
          <div className={cn("relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-24", widthClass)}>
            <MetaRow meta={meta} lang={lang} />
            <h1
              className={cn(
                "font-serif font-black text-3xl md:text-4xl lg:text-5xl text-white mb-4 leading-tight text-balance",
                alignClass,
              )}
            >
              {title}
            </h1>
            {showExcerpt && (
              <p className={cn("text-lg text-white/90 leading-relaxed max-w-3xl", alignClass)}>{excerpt}</p>
            )}
            <MetaDetails meta={meta} lang={lang} />
          </div>
        </section>
        <HeroRedDivider />
        <BodyBlock
          body={body}
          inlineImages={inlineImages}
          imageAlt={title}
          widthClass={widthClass}
          alignClass={alignClass}
        />
      </div>
    )
  }

  if (settings.layout === "magazine") {
    return (
      <div className="bg-white">
        <section className="pt-8 pb-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 shadow-md">
                  <CoverImage src={cover} alt={title} priority preview={preview} />
                </div>
              </div>
              <div className={cn("lg:col-span-7", alignClass)}>
                <MetaRow meta={meta} lang={lang} />
                <h1 className="font-serif font-black text-3xl md:text-4xl text-gray-900 mb-4 leading-tight text-balance">
                  {title}
                </h1>
                {showExcerpt && (
                  <p className="text-lg text-gray-600 leading-relaxed mb-4 border-l-4 border-[var(--sos-red)] pl-4">
                    {excerpt}
                  </p>
                )}
                <MetaDetails meta={meta} lang={lang} />
              </div>
            </div>
          </div>
        </section>
        <HeroRedDivider />
        <BodyBlock
          body={body}
          inlineImages={inlineImages}
          imageAlt={title}
          widthClass={widthClass}
          alignClass={alignClass}
        />
      </div>
    )
  }

  if (settings.layout === "minimal") {
    return (
      <div className="bg-white">
        <section className="pt-8 pb-6">
          <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", widthClass)}>
            <MetaRow meta={meta} lang={lang} />
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {image && (
                <div className="relative w-full sm:w-40 shrink-0 aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                  <CoverImage src={cover} alt={title} preview={preview} />
                </div>
              )}
              <div className={cn("flex-1 min-w-0", alignClass)}>
                <h1 className="font-serif font-black text-2xl md:text-3xl text-gray-900 mb-3 leading-tight">
                  {title}
                </h1>
                {showExcerpt && (
                  <p className="text-base text-gray-600 leading-relaxed mb-3">{excerpt}</p>
                )}
                <MetaDetails meta={meta} lang={lang} />
              </div>
            </div>
          </div>
        </section>
        <BodyBlock
          body={body}
          inlineImages={inlineImages}
          imageAlt={title}
          widthClass={widthClass}
          alignClass={alignClass}
        />
      </div>
    )
  }

  /* classic */
  return (
    <div className="bg-white">
      <section className="pt-8 pb-8">
        <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", widthClass)}>
          <MetaRow meta={meta} lang={lang} />
          <h1
            className={cn(
              "font-serif font-black text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-4 leading-tight text-balance",
              alignClass,
            )}
          >
            {title}
          </h1>
          {showExcerpt && (
            <p className={cn("text-lg text-gray-600 leading-relaxed mb-4", alignClass)}>{excerpt}</p>
          )}
          <MetaDetails meta={meta} lang={lang} />
        </div>
      </section>
      <section>
        <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", widthClass)}>
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-gray-100">
            <CoverImage src={cover} alt={title} priority preview={preview} />
          </div>
        </div>
      </section>
      <HeroRedDivider />
      <BodyBlock
        body={body}
        inlineImages={inlineImages}
        imageAlt={title}
        widthClass={widthClass}
        alignClass={alignClass}
      />
    </div>
  )
}
