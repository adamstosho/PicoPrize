# PicoPrize

**Gamified Microlearning Platform on Celo Blockchain**

PicoPrize is a mobile-first web application that combines bite-sized learning with blockchain-based rewards. Learn new skills through quick 2-5 minute lessons, stake small amounts of cUSD on quiz predictions, and earn instant rewards when you answer correctly.

> ✅ **Tested with MiniPay Mini App** - This application has been successfully tested and verified to work with MiniPay Mini App using ngrok configuration for local development and testing.

## Testing Page Snapshot on Mini pay app 

![Screenshot of the testing page on mini app](/apps/web/public/test%20page.jpeg)

## 🎯 Problem We're Solving

Traditional learning platforms often struggle with:
- **Low engagement** - Learners lose motivation quickly
- **No real incentives** - Learning feels like a chore
- **Unfair creator compensation** - Content creators aren't rewarded fairly
- **Lack of Web3 education** - People want to learn blockchain but don't know where to start

PicoPrize solves these problems by making learning fun, rewarding, and accessible through gamification and blockchain technology.
## home page
![Home Page](/apps/web/public/screencapture-picoprize-vercel-app-2025-11-30-08_19_36.png)
## lesson page
![ Lesson Page](/apps/web/public/screencapture-picoprize-vercel-app-lessons-2025-11-30-08_20_30.png)
## ✨ Key Features

### For Learners
- **📚 Microlearning Lessons** - Quick 2-5 minute lessons on blockchain, Web3, and DeFi topics
- **💰 Stake-to-Learn** - Gamified staking system where you stake cUSD on quiz answers
- **🏆 Instant Rewards** - Earn rewards immediately when you answer correctly
- **📊 Reputation System** - Build your on-chain reputation with points, streaks, and achievements
- **📈 Leaderboards** - Compete with other learners and see your ranking
- **💼 Wallet Integration** - Connect MetaMask, WalletConnect, or Coinbase Wallet

### For Creators
- **✏️ Lesson Creation** - Create engaging lessons with custom questions and answers
- **💵 Pool Seeding** - Seed reward pools to attract learners to your content
- **📊 Analytics Dashboard** - Track your lessons, participants, and earnings
- **💎 Creator Earnings** - Earn fees from pools you seed and manage

### Technical Features
- **🔒 Secure Smart Contracts** - Deployed on Celo Sepolia testnet
- **📱 Mobile Responsive** - Works perfectly on mobile, tablet, and desktop
- **⚡ Fast & Optimized** - Built with Next.js for optimal performance
- **🌐 On-Chain Reputation** - All achievements and stats stored on blockchain
- **📲 MiniPay Compatible** - Tested and verified to work with MiniPay Mini App
## leaderboard page
![leaderboard page](/apps/web/public/screencapture-picoprize-vercel-app-leaderboard-2025-11-30-08_20_05.png)
## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Wagmi v2** - React hooks for Ethereum/Celo
- **RainbowKit** - Wallet connection UI
- **Viem** - TypeScript interface for Ethereum

### Smart Contracts
- **Solidity** - Smart contract language
- **Hardhat** - Development environment
- **OpenZeppelin** - Secure contract libraries
- **Celo Sepolia** - Testnet deployment

### Key Libraries
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Lucide React** - Icon library

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- A Web3 wallet (MetaMask, WalletConnect, or Coinbase Wallet)
- Celo Sepolia testnet cUSD (get from [faucet.celo.org](https://faucet.celo.org))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adamstosho/PicoPrize.git
   cd PicoPrize
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create `apps/web/.env.local`:
   ```env
   NEXT_PUBLIC_PICOPRIZE_POOL_ADDRESS=0x878dee43770336c7e01f80af48924797d38c0196
   NEXT_PUBLIC_PICOPRIZE_REPUTATION_ADDRESS=0x9a739b533371057fd349f49cf98e207fe2c93fd6
   NEXT_PUBLIC_PICOPRIZE_COMMIT_REVEAL_ADDRESS=0x6cfb9be3afa2761cf7bf0e9eab5591c6e26687c7
   NEXT_PUBLIC_CUSD_ADDRESS=0xf200a733177c35187c07763502d02c5cc3e55ac7
   NEXT_PUBLIC_CELO_RPC=https://sepolia-forno.celo-testnet.org
   NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id
   ```

4. **Run the development server**
   ```bash
   cd apps/web
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use PicoPrize

### For Learners

#### 1. Connect Your Wallet
- Click the "Connect Wallet" button in the top right
- Choose your preferred wallet (MetaMask, WalletConnect, or Coinbase Wallet)
- Make sure you're connected to **Celo Sepolia** testnet
- Get testnet cUSD from the faucet if needed

#### 2. Browse Lessons
- Go to the **Lessons** page from the navigation menu
- Browse available lessons on blockchain, Web3, and DeFi topics
- Click on any lesson card to view details

#### 3. Take a Quiz
- Click "Start Lesson" on any lesson
- Read the lesson content carefully
- Answer the quiz questions
- See your results immediately

#### 4. Stake on Your Prediction
- After passing the quiz, choose to stake on your answer
- Select your stake amount (between minimum and maximum shown)
- Approve the cUSD token if it's your first time
- Confirm the stake transaction in your wallet
- Wait for the pool to resolve to see if you won

#### 5. Claim Rewards
- If you staked on the winning choice, you'll earn a share of the reward pool
- Go to the **Wallet** page to see your balance and stats
- Click "Claim Rewards" when the pool is resolved
- Your rewards will be sent directly to your wallet

#### 6. Track Your Progress
- View your stats on the **Wallet** page:
  - Total staked
  - Total claimed
  - Lessons taken
  - Win rate
- Check the **Leaderboard** to see your ranking
- Build your reputation with streaks and achievements

### For Creators

#### 1. Access Creator Dashboard
- Connect your wallet
- Navigate to the **Creator** page from the menu
- You'll see your creator dashboard with stats

#### 2. Create a Lesson
- Click "Create Pool" button
- Fill in lesson details:
  - Title and description
  - Difficulty level
  - Duration estimate
  - Tags
- Add quiz questions:
  - Question text
  - Multiple choice answers
  - Correct answer
- Set pool parameters:
  - Minimum stake amount
  - Maximum stake amount
  - Creator seed amount (your contribution to the pool)
  - Deadline for the pool

#### 3. Approve and Create
- Review all your lesson details
- Click "Create Pool"
- Approve the cUSD token transaction
- Confirm the pool creation transaction
- Your lesson is now live!

#### 4. Manage Your Pools
- View all your created pools in the "My Pools" section
- See statistics for each pool:
  - Number of participants
  - Total staked
  - Pool status
- Click "View Details" to see the full lesson

#### 5. Resolve Pools
- When the deadline passes, you can resolve the pool
- Click "Resolve Pool" on any closed pool
- Select the winning choice
- Confirm the resolution transaction
- Rewards are automatically distributed to winners

#### 6. Track Earnings
- View your creator statistics:
  - Published pools count
  - Total participants
  - Total earnings in cUSD
- Check the **Creator Leaderboard** to see your ranking

## 🏗️ Project Structure

```
PicoPrize/
├── apps/
│   ├── web/                 # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/         # Next.js app router pages
│   │   │   ├── components/  # React components
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   └── lib/         # Utilities and configurations
│   │   └── public/          # Static assets
│   │
│   └── contracts/           # Smart contracts
│       ├── contracts/       # Solidity contracts
│       ├── scripts/          # Deployment scripts
│       └── test/             # Contract tests
│
└── README.md
```

## 🔧 Development

### Frontend Development
```bash
cd apps/web
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linter
```

### Smart Contract Development
```bash
cd apps/contracts
pnpm compile      # Compile contracts
pnpm test         # Run tests
pnpm deploy:sepolia  # Deploy to Celo Sepolia
```

## 🌐 Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Smart Contracts
Contracts are deployed on Celo Sepolia testnet:
- **PicoPrizePool**: `0x878dee43770336c7e01f80af48924797d38c0196`
- **PicoPrizeReputation**: `0x9a739b533371057fd349f49cf98e207fe2c93fd6`
- **PicoPrizeCommitReveal**: `0x6cfb9be3afa2761cf7bf0e9eab5591c6e26687c7`
- **cUSD (Mock)**: `0xf200a733177c35187c07763502d02c5cc3e55ac7`

## 📝 Important Notes

### Testnet Only
⚠️ **This application runs on Celo Sepolia testnet. No real money is involved.** All transactions use testnet tokens for demonstration purposes.

### Wallet Requirements
- You need a Web3 wallet (MetaMask, WalletConnect, or Coinbase Wallet)
- Connect to **Celo Sepolia** network (Chain ID: 11142220)
- Get testnet cUSD from [faucet.celo.org](https://faucet.celo.org)
- **MiniPay Support**: The app has been tested with MiniPay Mini App and works seamlessly with automatic wallet connection

### MiniPay Testing
✅ **MiniPay Integration Verified** - This application has been tested with MiniPay Mini App using ngrok for local development. The app includes:
- Web App Manifest (`manifest.json`) for MiniPay compatibility
- MiniPay-specific meta tags for proper integration
- Automatic wallet connection when accessed via MiniPay
- Responsive design optimized for mobile Mini App experience

For local MiniPay testing setup, see `QUICK_START_MINIPAY.md` in the project root.

### Data Storage
- Lesson metadata is stored in-memory (temporary)
- For production, consider using Vercel KV, a database, or external storage
- All on-chain data (pools, stakes, reputation) is stored on Celo blockchain

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [https://picoprize.vercel.app](https://picoprize.vercel.app)
- **GitHub Repository**: [https://github.com/adamstosho/PicoPrize](https://github.com/adamstosho/PicoPrize)
- **Celo Sepolia Explorer**: [https://celo-sepolia.blockscout.com](https://celo-sepolia.blockscout.com)
- **Celo Testnet Faucet**: [https://faucet.celo.org](https://faucet.celo.org)

## 👥 Authors

- **PicoPrize Team**

## 🙏 Acknowledgments

- Built on [Celo](https://celo.org) blockchain
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Wallet integration via [RainbowKit](https://rainbowkit.com) and [Wagmi](https://wagmi.sh)

---

**Happy Learning! 🎓💰**

