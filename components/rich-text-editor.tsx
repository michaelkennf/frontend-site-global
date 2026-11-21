"use client"

import { useEffect, useRef } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toEditorHtml } from "@/lib/rich-text"

const TEXT_COLORS = [
  { label: "Défaut", value: "" },
  { label: "Noir", value: "#111827" },
  { label: "Bleu SOS", value: "#0D3356" },
  { label: "Rouge SOS", value: "#C8102E" },
  { label: "Gris", value: "#4B5563" },
  { label: "Blanc", value: "#FFFFFF" },
]

type RichTextEditorProps = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: string
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Rédigez votre texte…",
  minHeight = "160px",
  className,
}: RichTextEditorProps) {
  const lastEmitted = useRef<string>("")

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
    ],
    content: toEditorHtml(value),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none px-3 py-2 text-gray-900 min-h-[120px]",
        "data-placeholder": placeholder,
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.isEmpty ? "" : ed.getHTML()
      lastEmitted.current = html
      onChange(html)
    },
  })

  useEffect(() => {
    if (!editor) return
    // Ignore echoes of our own onChange
    if (value === lastEmitted.current) return
    const next = toEditorHtml(value)
    if (next !== editor.getHTML()) {
      editor.commands.setContent(next || "", { emitUpdate: false })
    }
  }, [editor, value])

  if (!editor) {
    return (
      <div
        className={cn("border border-gray-300 rounded-lg bg-white animate-pulse", className)}
        style={{ minHeight }}
      />
    )
  }

  const btn = (active: boolean) =>
    cn(
      "p-1.5 rounded transition-colors",
      active ? "bg-[var(--sos-blue)] text-white" : "text-gray-600 hover:bg-gray-100",
    )

  return (
    <div
      className={cn(
        "border border-gray-300 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[var(--sos-blue)] focus-within:border-transparent",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        <button
          type="button"
          title="Gras"
          className={btn(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          title="Titre"
          className={btn(editor.isActive("heading", { level: 2 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={15} />
        </button>

        <span className="w-px h-5 bg-gray-300 mx-1" aria-hidden />

        <button
          type="button"
          title="Aligner à gauche"
          className={btn(editor.isActive({ textAlign: "left" }))}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={15} />
        </button>
        <button
          type="button"
          title="Centrer"
          className={btn(editor.isActive({ textAlign: "center" }))}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={15} />
        </button>
        <button
          type="button"
          title="Aligner à droite"
          className={btn(editor.isActive({ textAlign: "right" }))}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={15} />
        </button>
        <button
          type="button"
          title="Justifier"
          className={btn(editor.isActive({ textAlign: "justify" }))}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify size={15} />
        </button>

        <span className="w-px h-5 bg-gray-300 mx-1" aria-hidden />

        <label className="inline-flex items-center gap-1.5 text-xs text-gray-600 px-1">
          Couleur
          <input
            type="color"
            title="Couleur du texte"
            className="w-7 h-7 rounded border border-gray-200 cursor-pointer bg-white p-0.5"
            value={editor.getAttributes("textStyle").color || "#111827"}
            onChange={(e) => {
              editor.chain().focus().setColor(e.target.value).run()
            }}
          />
        </label>
        <select
          className="text-xs border border-gray-200 rounded px-1.5 py-1 bg-white text-gray-700"
          value={editor.getAttributes("textStyle").color || ""}
          onChange={(e) => {
            const v = e.target.value
            if (!v) editor.chain().focus().unsetColor().run()
            else editor.chain().focus().setColor(v).run()
          }}
          title="Couleur prédéfinie"
        >
          {TEXT_COLORS.map((c) => (
            <option key={c.label} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <EditorContent editor={editor} style={{ minHeight }} />
    </div>
  )
}
