"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card"
import { Button } from "@/components/button"
import { useWallet, ConnectButton } from "@/lib/wallet-context"

export function OnboardingModal() {
  const { isConnecting, isConnected } = useWallet()
  const [step, setStep] = useState(0)

  // Don't show if already connected
  if (isConnected) return null

  const steps = [
    {
      title: "Welcome to PicoPrize",
      description: "Learn bite-sized lessons and earn crypto rewards on Celo",
      content:
        "Stake small amounts of cUSD on quiz answers and earn instant rewards when you win. All transactions happen on Celo Sepolia testnet.",
    },
    {
      title: "How It Works",
      description: "Three simple steps to start earning",
      content:
        "Step 1: Connect your MiniPay wallet\nStep 2: Complete lessons and stake testnet cUSD\nStep 3: Get instant rewards when you answer correctly",
    },
    {
      title: "Testnet Disclaimer",
      description: "This is a demonstration on testnet",
      content:
        "This app uses cUSD on Celo Sepolia testnet. No real money is involved. All funds are testnet tokens obtained from the faucet for demonstration purposes only.",
    },
  ]

  const currentStep = steps[step]

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-fade-in"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Card className="w-full max-w-md animate-slide-up" variant="elevated">
        <CardHeader>
          <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
          <CardDescription>{currentStep.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>
            {currentStep.content}
          </p>

          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="ghost" size="md" onClick={() => setStep(step - 1)} className="flex-1">
                Back
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button variant="primary" size="md" onClick={() => setStep(step + 1)} className="flex-1">
                Next
              </Button>
            ) : (
              <div className="flex-1 flex justify-center">
                <ConnectButton />
              </div>
            )}
          </div>

          <div className="flex gap-1 justify-center">
            {steps.map((_, index) => (
              <div
                key={index}
                className="h-1.5 w-8 rounded-full transition-colors"
                style={{
                  backgroundColor: index === step ? "var(--primary)" : "var(--neutral-700)",
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
