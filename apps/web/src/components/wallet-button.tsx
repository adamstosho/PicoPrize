"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { useWallet } from "@/lib/wallet-context"

export function WalletButton() {
  const { address, isConnected, isConnecting, disconnect } = useWallet()
  const [showMenu, setShowMenu] = useState(false)

  if (!isConnected) {
    return null
  }

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""

  return (
    <div className="relative">
      <Button variant="secondary" size="md" onClick={() => setShowMenu(!showMenu)} className="font-mono">
        {shortAddress}
      </Button>

      {showMenu && (
        <div
          className="absolute right-0 mt-2 w-48 border rounded-lg py-2 z-40"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow-01)",
          }}
        >
          <button
            onClick={disconnect}
            className="w-full px-4 py-2 text-left transition-colors"
            style={{
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--surface-01)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent"
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
