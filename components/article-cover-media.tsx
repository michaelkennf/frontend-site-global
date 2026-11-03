"use client"

import Image from "next/image"
import { ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"

/** Zone visuelle sans photo de couverture (pas de fallback hero). */
export function ArticleImagePlaceholder({
  className,
  label = "Sans image",
}: {
  className?: string
  label?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400",
        className,
      )}
    >
      <ImageOff className="w-8 h-8 opacity-60" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  )
}

export function ArticleCoverMedia({
  src,
  alt,
  fill = true,
  className,
  sizes,
  priority,
  placeholderClassName,
}: {
  src?: string | null
  alt: string
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
  placeholderClassName?: string
}) {
  const url = src?.trim()
  if (!url) {
    return (
      <ArticleImagePlaceholder
        className={cn(fill ? "absolute inset-0" : "w-full h-full", placeholderClassName)}
      />
    )
  }
  if (fill) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "100vw"}
        className={cn("object-cover object-center", className)}
      />
    )
  }
  return (
    <Image
      src={url}
      alt={alt}
      width={800}
      height={500}
      priority={priority}
      className={cn("object-cover object-center w-full h-full", className)}
    />
  )
}
