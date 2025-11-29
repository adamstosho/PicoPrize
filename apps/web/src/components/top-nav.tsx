"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { WalletButton } from "@/components/wallet-button"
import { useWallet } from "@/lib/wallet-context"

export function TopNav() {
  const pathname = usePathname()
  const { isConnected, balance } = useWallet()
  const [showMenu, setShowMenu] = useState(false)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/lessons", label: "Lessons" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/creator", label: "Creator" },
  ]

  return (
    <div
      className="hidden md:block sticky top-0 z-40 border-b"
      style={{
        backgroundColor: "var(--surface-01)",
        borderBottomColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-2xl" style={{ color: "var(--text-primary)" }}>
          PicoPrize
        </div>

        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium transition-colors"
              style={{
                color: pathname === item.href ? "var(--primary)" : "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                if (pathname !== item.href) {
                  e.currentTarget.style.color = "var(--text-primary)"
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== item.href) {
                  e.currentTarget.style.color = "var(--text-secondary)"
                }
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {isConnected && balance && (
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              <span className="font-mono font-semibold" style={{ color: "var(--accent)" }}>
                {balance}
              </span>
              <span className="ml-1">cUSD</span>
            </div>
          )}
          <WalletButton />
        </div>
      </div>
    </div>
  )
}
