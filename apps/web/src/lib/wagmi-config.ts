"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { http } from "wagmi"

// Celo Sepolia chain configuration
const celoSepolia = {
  id: 11142220,
  name: "Celo Sepolia",
  network: "celo-sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "CELO",
    symbol: "CELO",
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_CELO_RPC || "https://sepolia-forno.celo-testnet.org"],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_CELO_RPC || "https://sepolia-forno.celo-testnet.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Celo Explorer",
      url: "https://celo-sepolia.blockscout.com",
    },
  },
  testnet: true,
} as const

// getDefaultConfig automatically handles localStorage persistence
// No need to explicitly configure storage - it's handled internally
export const config = getDefaultConfig({
  appName: "PicoPrize",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [celoSepolia],
  transports: {
    [celoSepolia.id]: http(process.env.NEXT_PUBLIC_CELO_RPC || "https://sepolia-forno.celo-testnet.org"),
  },
  ssr: true,
})

export { celoSepolia }

