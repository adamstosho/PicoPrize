// Lesson and Question interfaces
export interface Lesson {
  id: string
  poolId: bigint
  title: string
  author: string
  authorAddress: `0x${string}`
  description: string
  duration: number // seconds
  difficulty: "beginner" | "intermediate" | "advanced"
  tags: string[]
  image: string
  minStake: number // in cUSD
  maxStake: number // in cUSD
  totalStaked: number // in cUSD
  deadline: Date
  status: "active" | "closed" | "resolved" | "cancelled"
  choicesCount: number
  language: string
  questions: Question[]
}

export interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
}

// Lesson metadata stored off-chain (IPFS or API)
export interface LessonMetadata {
  title: string
  description: string
  author: string
  duration: number
  difficulty: "beginner" | "intermediate" | "advanced"
  tags: string[]
  image: string
  language: string
  questions: Question[]
}

// Lesson metadata is stored server-side (data/lessons.json) and fetched via API
// Future enhancement: Support IPFS metadata via metadataUri from pool contract
const LESSON_STORAGE_KEY = "picoPrize:lessonMetadata"

type MetadataMap = Record<string, LessonMetadata>

let customMetadataCache: MetadataMap | null = null

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

function loadCustomMetadata(): MetadataMap | null {
  if (!isBrowser()) return customMetadataCache
  if (customMetadataCache) return customMetadataCache

  try {
    const raw = window.localStorage.getItem(LESSON_STORAGE_KEY)
    customMetadataCache = raw ? (JSON.parse(raw) as MetadataMap) : {}
  } catch (err) {
    customMetadataCache = {}
  }
  return customMetadataCache
}

function persistCustomMetadata(store: MetadataMap) {
  if (!isBrowser()) return
  customMetadataCache = store
  window.localStorage.setItem(LESSON_STORAGE_KEY, JSON.stringify(store))
}

export function saveLessonMetadata(key: string, metadata: LessonMetadata, alternateKey?: string) {
  if (!isBrowser()) return
  const store = loadCustomMetadata() || {}
  store[key] = metadata
  if (alternateKey) {
    store[alternateKey] = metadata
  }
  persistCustomMetadata(store)
}

export const DEMO_LESSON_METADATA: Record<string, LessonMetadata> = {
  // Pool ID 1
  "1": {
    title: "Introduction to Blockchain",
    description: "Learn the fundamentals of blockchain technology and how it powers cryptocurrencies.",
    author: "Alice Chen",
    duration: 120,
    difficulty: "beginner",
    tags: ["blockchain", "crypto", "basics"],
    image: "/blockchain-network.png",
    language: "en",
    questions: [
      {
        id: "q1",
        text: "What is the primary purpose of blockchain technology?",
        options: [
          "To create secure, distributed ledgers",
          "To increase internet speed",
          "To replace all databases",
          "To store large video files",
        ],
        correctAnswer: 0,
        explanation: "Blockchain creates immutable, distributed ledgers that allow multiple parties to agree on truth without a central authority.",
      },
      {
        id: "q2",
        text: "Which of these is NOT a characteristic of blockchain?",
        options: ["Decentralized", "Immutable", "Centralized control", "Transparent"],
        correctAnswer: 2,
        explanation: "Blockchain is specifically designed to be decentralized, not centralized.",
      },
    ],
  },
  "2": {
    title: "Understanding Smart Contracts",
    description: "Discover how smart contracts automate transactions on the Ethereum network.",
    author: "Bob Martinez",
    duration: 90,
    difficulty: "intermediate",
    tags: ["smart-contracts", "ethereum", "solidity"],
    image: "/smart-contracts-code.jpg",
    language: "en",
    questions: [
      {
        id: "q1",
        text: "What language is commonly used to write Ethereum smart contracts?",
        options: ["JavaScript", "Solidity", "Python", "Rust"],
        correctAnswer: 1,
        explanation: "Solidity is the primary language for writing smart contracts on Ethereum.",
      },
    ],
  },
  "3": {
    title: "Celo Basics for Developers",
    description: "Master the essentials of building on the Celo blockchain platform.",
    author: "Carol Lee",
    duration: 150,
    difficulty: "intermediate",
    tags: ["celo", "blockchain", "development"],
    image: "/celo-blockchain.jpg",
    language: "en",
    questions: [
      {
        id: "q1",
        text: "What is the native currency of Celo?",
        options: ["CELO", "cUSD", "cEUR", "All of the above"],
        correctAnswer: 3,
        explanation: "Celo has multiple tokens: CELO is the governance token, while cUSD and cEUR are stablecoins.",
      },
    ],
  },
  "4": {
    title: "Web3 Security Best Practices",
    description: "Learn essential security principles for protecting your cryptocurrency assets.",
    author: "David Wong",
    duration: 180,
    difficulty: "advanced",
    tags: ["security", "web3", "wallets"],
    image: "/web3-security-lock.jpg",
    language: "en",
    questions: [
      {
        id: "q1",
        text: "What should you NEVER do with your private key?",
        options: [
          "Store it safely offline",
          "Share it with anyone",
          "Use it to sign transactions",
          "Keep it in a hardware wallet",
        ],
        correctAnswer: 1,
        explanation: "Your private key should never be shared with anyone under any circumstances.",
      },
    ],
  },
  "5": {
    title: "DeFi Fundamentals",
    description: "Understand the basics of decentralized finance and yield opportunities.",
    author: "Emma Davis",
    duration: 120,
    difficulty: "intermediate",
    tags: ["defi", "yield", "liquidity"],
    image: "/defi-trading.jpg",
    language: "en",
    questions: [
      {
        id: "q1",
        text: "What does APY stand for in DeFi?",
        options: [
          "Annual Percentage Yield",
          "Average Payment Year",
          "Application Protocol Yield",
          "Active Protocol Yield",
        ],
        correctAnswer: 0,
        explanation: "APY (Annual Percentage Yield) represents the annual return on an investment, including compound interest.",
      },
    ],
  },
}

// Helper function to get metadata by pool ID or metadataUri
export function getLessonMetadata(poolIdOrUri: string): LessonMetadata | null {
  const customMetadata = loadCustomMetadata()
  if (customMetadata && customMetadata[poolIdOrUri]) {
    return customMetadata[poolIdOrUri]
  }

  // First check if it's a known pool ID
  if (DEMO_LESSON_METADATA[poolIdOrUri]) {
    return DEMO_LESSON_METADATA[poolIdOrUri]
  }
  
  // In production, fetch from IPFS/API using metadataUri
  // For now, return a default if not found
  return null
}

// Helper to generate default metadata for unknown pools
export function getDefaultMetadata(poolId: string, choicesCount: number = 4): LessonMetadata {
  // Generate questions based on choicesCount
  const generateOptions = (count: number): string[] => {
    return Array.from({ length: count }, (_, i) => {
      const labels = ["A", "B", "C", "D", "E", "F"]
      return `Option ${labels[i] || String.fromCharCode(65 + i)}`
    })
  }

  return {
    title: `Challenge Pool #${poolId}`,
    description: "A stakeable challenge pool on PicoPrize. Complete the lesson and stake on your prediction!",
    author: "Pool Creator",
    duration: 60,
    difficulty: "beginner",
    tags: ["challenge"],
    image: "/placeholder.png",
    language: "en",
    questions: [
      {
        id: "q1",
        text: "What is your prediction for this challenge?",
        options: generateOptions(choicesCount),
        correctAnswer: 0,
        explanation: "Select the option you believe will win this challenge pool.",
      },
    ],
  }
}
