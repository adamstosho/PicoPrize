export const PicoPrizeReputationABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "oldPoints", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "newPoints", type: "uint256" },
      { indexed: false, internalType: "string", name: "reason", type: "string" }
    ],
    name: "ReputationUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "newStreak", type: "uint256" },
      { indexed: false, internalType: "bool", name: "isNewRecord", type: "bool" }
    ],
    name: "StreakUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "uint256", name: "achievementId", type: "uint256" },
      { indexed: false, internalType: "string", name: "achievementName", type: "string" }
    ],
    name: "AchievementUnlocked",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "creator", type: "address" },
      { indexed: false, internalType: "uint256", name: "lessonsCreated", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "totalParticipants", type: "uint256" }
    ],
    name: "CreatorStatsUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" }
    ],
    name: "UserRegistered",
    type: "event"
  },
  // Read Functions
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserStats",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "totalPoints", type: "uint256" },
          { internalType: "uint256", name: "lessonsCompleted", type: "uint256" },
          { internalType: "uint256", name: "challengesWon", type: "uint256" },
          { internalType: "uint256", name: "challengesLost", type: "uint256" },
          { internalType: "uint256", name: "totalStaked", type: "uint256" },
          { internalType: "uint256", name: "totalWon", type: "uint256" },
          { internalType: "uint256", name: "currentStreak", type: "uint256" },
          { internalType: "uint256", name: "longestStreak", type: "uint256" },
          { internalType: "uint256", name: "lastActivityTimestamp", type: "uint256" },
          { internalType: "uint256", name: "registeredAt", type: "uint256" }
        ],
        internalType: "struct PicoPrizeReputation.UserStats",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "creator", type: "address" }],
    name: "getCreatorStats",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "lessonsCreated", type: "uint256" },
          { internalType: "uint256", name: "totalParticipants", type: "uint256" },
          { internalType: "uint256", name: "totalPoolsSeeded", type: "uint256" },
          { internalType: "uint256", name: "totalFeesEarned", type: "uint256" },
          { internalType: "uint256", name: "averageRating", type: "uint256" },
          { internalType: "uint256", name: "ratingCount", type: "uint256" }
        ],
        internalType: "struct PicoPrizeReputation.CreatorStats",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserAchievements",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "achievementId", type: "uint256" }
    ],
    name: "hasAchievement",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "achievementId", type: "uint256" }],
    name: "getAchievement",
    outputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string", name: "imageUri", type: "string" },
          { internalType: "uint256", name: "requiredPoints", type: "uint256" },
          { internalType: "bool", name: "exists", type: "bool" }
        ],
        internalType: "struct PicoPrizeReputation.Achievement",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "count", type: "uint256" }],
    name: "getLeaderboard",
    outputs: [
      { internalType: "address[]", name: "users", type: "address[]" },
      { internalType: "uint256[]", name: "points", type: "uint256[]" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "isRegistered",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getTotalUsers",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "achievementCounter",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  // Constants
  {
    inputs: [],
    name: "BASE_POINTS_WIN",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "BASE_POINTS_PARTICIPATE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "STREAK_BONUS_MULTIPLIER",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "MAX_STREAK_BONUS",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  // Write Functions (only callable by UPDATER_ROLE)
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "registerUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "uint256", name: "rating", type: "uint256" }
    ],
    name: "rateCreator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const

