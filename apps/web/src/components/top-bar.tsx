"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { WalletButton } from "@/components/wallet-button"
import { useWallet } from "@/lib/wallet-context"

export function TopBar() {
  const { isConnected, balance } = useWallet()
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/lessons", label: "Lessons" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/wallet", label: "Wallet" },
    { href: "/creator", label: "Creator" },
  ]

  return (
    <div
      className="sticky top-0 z-40 border-b"
      style={{
        backgroundColor: "var(--surface-01)",
        borderBottomColor: "var(--border)",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="relative flex items-center justify-center w-9 h-9 rounded-2xl overflow-hidden"
            style={{
              background:
                "radial-gradient(circle at 0% 0%, #6C63FF 0%, rgba(108,99,255,0.15) 45%, transparent 70%), radial-gradient(circle at 100% 100%, #00D1B2 0%, rgba(0,209,178,0.15) 45%, transparent 70%)",
              boxShadow: "0 0 24px rgba(108, 99, 255, 0.45)",
            }}
          >
            <div
              className="absolute inset-[3px] rounded-2xl"
              style={{
                background:
                  "conic-gradient(from 210deg, rgba(11,16,32,0.95), rgba(108,99,255,0.35), rgba(0,209,178,0.25), rgba(11,16,32,0.9))",
              }}
            />
            <div className="relative flex items-center justify-center w-full h-full">
              <span className="text-lg font-black tracking-tight" style={{ color: "white" }}>
                P
              </span>
            </div>
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span
              className="text-sm font-semibold tracking-wide group-hover:tracking-[0.18em] transition-all duration-300"
              style={{ color: "var(--text-primary)" }}
            >
              PICO<span style={{ color: "var(--accent)" }}>PRIZE</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--text-tertiary)" }}>
              Learn · Stake · Earn
            </span>
          </div>
        </Link>

        {/* Desktop nav (md and up) */}
        <nav className="hidden md:flex items-center gap-4 flex-1 justify-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors"
                style={{
                  color: isActive ? "var(--primary)" : "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--text-primary)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--text-secondary)"
                  }
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          {isConnected && balance && (
            <div className="text-sm hidden sm:block" style={{ color: "var(--text-secondary)" }}>
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
