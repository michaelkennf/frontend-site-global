"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { logout, getStoredUser } from "@/lib/auth"
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Image as ImageIcon,
  Mail,
  Heart,
  MessageSquare,
  Users,
  UserCircle2,
  TrendingUp,
  Handshake,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  User,
} from "lucide-react"

const menuItems = [
  { icon: LayoutDashboard, labelFr: "Tableau de bord", href: "/admin/dashboard", roles: ["ADMIN", "GESTIONNAIRE"] },
  { icon: Calendar, labelFr: "Activités", href: "/admin/activities", roles: ["ADMIN", "GESTIONNAIRE"] },
  { icon: UserCircle2, labelFr: "Équipe", href: "/admin/team", roles: ["ADMIN", "GESTIONNAIRE"] },
  { icon: Handshake, labelFr: "Partenaires", href: "/admin/partners", roles: ["ADMIN", "GESTIONNAIRE"] },
  { icon: TrendingUp, labelFr: "Chiffres d'impact", href: "/admin/stats", roles: ["ADMIN", "GESTIONNAIRE"] },
  { icon: ImageIcon, labelFr: "Médiathèque", href: "/admin/media", roles: ["ADMIN", "GESTIONNAIRE"] },
  { icon: Mail, labelFr: "Newsletter", href: "/admin/newsletter", roles: ["ADMIN", "GESTIONNAIRE"] },
  { icon: Heart, labelFr: "Dons", href: "/admin/donations", roles: ["ADMIN", "GESTIONNAIRE"] },
  { icon: MessageSquare, labelFr: "Messages", href: "/admin/messages", roles: ["ADMIN", "GESTIONNAIRE"] },
  { icon: Users, labelFr: "Utilisateurs", href: "/admin/users", roles: ["ADMIN"] },
  { icon: Settings, labelFr: "Paramètres", href: "/admin/settings", roles: ["ADMIN", "GESTIONNAIRE"] },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const user = getStoredUser()

  const visibleItems = menuItems.filter((item) => user?.role && item.roles.includes(user.role))

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Global SOS" width={44} height={44} className="rounded-lg" />
          <div>
            <span className="font-serif font-bold text-white">Global</span>
            <span className="font-serif font-black" style={{ color: "#E31E24" }}> SOS</span>
          </div>
        </Link>
      </div>

      {/* User badge */}
      {user && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-full bg-[var(--sos-blue)] flex items-center justify-center text-white text-xs font-bold">
              {user.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user.name}</p>
              <div className="flex items-center gap-1">
                {user.role === "ADMIN" ? <Shield className="w-3 h-3 text-red-400" /> : <User className="w-3 h-3 text-[var(--sos-blue)]" />}
                <span className="text-white/60 text-xs">{user.role === "ADMIN" ? "Admin" : "Gestionnaire"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-white"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.labelFr}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-red-500/20 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex-col bg-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="p-2 rounded-lg bg-white shadow-md border border-gray-200"
        >
          {mobileOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
        </button>
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <aside
            className="absolute inset-y-0 left-0 w-64 bg-sidebar flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
