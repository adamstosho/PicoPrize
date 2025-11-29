export const PicoPrizePoolABI = [
  {
    inputs: [
      { internalType: "address", name: "_stakingToken", type: "address" },
      { internalType: "address", name: "_treasury", type: "address" },
      { internalType: "uint256", name: "_platformFeeBps", type: "uint256" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "poolId", type: "uint256" },
      { indexed: true, internalType: "address", name: "creator", type: "address" },
      { indexed: false, internalType: "string", name: "metadataUri", type: "string" },
      { indexed: false, internalType: "uint8", name: "choicesCount", type: "uint8" },
      { indexed: false, internalType: "uint256", name: "deadline", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "minStake", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "maxStake", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "creatorSeed", type: "uint256" }
    ],
    name: "PoolCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "poolId", type: "uint256" },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "uint8", name: "choice", type: "uint8" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "StakePlaced",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "poolId", type: "uint256" },
      { indexed: false, internalType: "uint8", name: "winningChoice", type: "uint8" },
      { indexed: false, internalType: "uint256", name: "totalWinningStake", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "totalPayout", type: "uint256" }
    ],
    name: "PoolResolved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "poolId", type: "uint256" },
      { indexed: false, internalType: "string", name: "reason", type: "string" }
    ],
    name: "PoolCancelled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "poolId", type: "uint256" },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "RewardClaimed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "poolId", type: "uint256" },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "StakeRefunded",
    type: "event"
  },
  // Read Functions
  {
    inputs: [{ internalType: "uint256", name: "poolId", type: "uint256" }],
    name: "getPool",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "creator", type: "address" },
          { internalType: "string", name: "metadataUri", type: "string" },
          { internalType: "uint8", name: "choicesCount", type: "uint8" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
          { internalType: "uint256", name: "minStake", type: "uint256" },
          { internalType: "uint256", name: "maxStake", type: "uint256" },
          { internalType: "uint256", name: "creatorSeed", type: "uint256" },
          { internalType: "uint256", name: "platformFeeBps", type: "uint256" },
          { internalType: "uint256", name: "creatorFeeBps", type: "uint256" },
          { internalType: "uint256", name: "totalStaked", type: "uint256" },
          { internalType: "uint8", name: "winningChoice", type: "uint8" },
          { internalType: "enum IPicoPrize.PoolStatus", name: "status", type: "uint8" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "uint256", name: "resolvedAt", type: "uint256" }
        ],
        internalType: "struct IPicoPrize.Pool",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "poolId", type: "uint256" },
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint8", name: "choice", type: "uint8" }
    ],
    name: "getUserStake",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "bool", name: "claimed", type: "bool" }
        ],
        internalType: "struct IPicoPrize.UserStake",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "poolId", type: "uint256" },
      { internalType: "uint8", name: "choice", type: "uint8" }
    ],
    name: "getChoiceTotal",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "poolId", type: "uint256" },
      { internalType: "address", name: "user", type: "address" }
    ],
    name: "calculateReward",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "poolId", type: "uint256" }],
    name: "getPoolParticipants",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "poolId", type: "uint256" },
      { internalType: "address", name: "user", type: "address" }
    ],
    name: "getUserTotalStake",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "poolId", type: "uint256" },
      { internalType: "address", name: "user", type: "address" }
    ],
    name: "hasUserStaked",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "poolCounter",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "platformFeeBps",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "stakingToken",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  // Write Functions
  {
    inputs: [
      { internalType: "uint256", name: "poolId", type: "uint256" },
      { internalType: "string", name: "metadataUri", type: "string" },
      { internalType: "uint8", name: "choicesCount", type: "uint8" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "uint256", name: "minStake", type: "uint256" },
      { internalType: "uint256", name: "maxStake", type: "uint256" },
      { internalType: "uint256", name: "creatorSeed", type: "uint256" },
      { internalType: "uint256", name: "creatorFeeBps", type: "uint256" }
    ],
    name: "createPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "poolId", type: "uint256" },
      { internalType: "uint8", name: "choice", type: "uint8" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "poolId", type: "uint256" },
      { internalType: "uint8", name: "winningChoice", type: "uint8" }
    ],
    name: "resolvePool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "poolId", type: "uint256" },
      { internalType: "string", name: "reason", type: "string" }
    ],
    name: "cancelPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "poolId", type: "uint256" }],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "poolId", type: "uint256" }],
    name: "claimRefund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  // Constants
  {
    inputs: [],
    name: "MAX_FEE_BPS",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "BPS_DENOMINATOR",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "MIN_DEADLINE_BUFFER",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "MAX_CHOICES",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "MIN_STAKE_AMOUNT",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
] as const

