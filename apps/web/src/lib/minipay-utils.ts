/**
 * MiniPay utility functions
 * Helper functions for detecting and optimizing MiniPay Mini App experience
 */

/**
 * Check if the app is running inside MiniPay
 */
export function isMiniPay(): boolean {
  if (typeof window === "undefined") return false
  
  // @ts-ignore - MiniPay injects isMiniPay property
  return !!(window.ethereum && window.ethereum.isMiniPay)
}

/**
 * Get MiniPay version if available
 */
export function getMiniPayVersion(): string | null {
  if (typeof window === "undefined") return null
  
  try {
    // @ts-ignore
    if (window.ethereum?.isMiniPay) {
      // @ts-ignore
      return window.ethereum?.minipayVersion || null
    }
  } catch (error) {
    console.warn("Error detecting MiniPay version:", error)
  }
  
  return null
}

/**
 * Check if we should hide certain UI elements in MiniPay
 * (e.g., connect button since it auto-connects)
 */
export function shouldOptimizeForMiniPay(): boolean {
  return isMiniPay()
}

/**
 * Get user agent info for debugging
 */
export function getUserAgentInfo(): {
  isMiniPay: boolean
  userAgent: string
  version: string | null
} {
  return {
    isMiniPay: isMiniPay(),
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
    version: getMiniPayVersion(),
  }
}

/**
 * Log MiniPay detection info (for debugging)
 */
export function logMiniPayInfo(): void {
  if (typeof window === "undefined") return
  
  const info = getUserAgentInfo()
  if (info.isMiniPay) {
    console.log("🎉 Running in MiniPay Mini App", info)
  }
}

