PicoPrize — Product Requirements Document (PRD)

Project: PicoPrize — microlearning with stakeable predictions and instant MiniPay rewards
Platform: Responsive PWA designed to behave like a MiniPay mini app
Blockchain: Celo (deploy to Celo Sepolia testnet for hackathon)
Author: (prepared for Adam)
Date: 27 November 2025

This PRD is comprehensive and actionable. It contains product rationale, success metrics, detailed functional and non-functional requirements, UX guidance, data and contract models, dev tasks, testing, deployment and the exact commands and references you need to implement the project on Celo Sepolia using the Celo Composer Minipay template.

1. Executive summary

PicoPrize is a mobile-first progressive web application that combines bite-sized learning, small-stake prediction challenges and instant micropay rewards powered by MiniPay on Celo. Users complete micro-lessons, optionally stake tiny stablecoin amounts on answers or short predictions, and receive instant payouts to their MiniPay wallets when they win. Creators and local sponsors can seed reward pools and earn fees. The product targets high engagement, real educational value and low friction monetary flows. The architecture prioritises simplicity and auditability to meet hackathon timelines.

Key build decisions

Use the Celo Composer Minipay template as the starter scaffold to accelerate MiniPay compatibility. 
Celo Docs

Use MiniPay payment flows and code libraries for wallet/payment integration. 
Celo Docs

Deploy smart contracts and tests to Celo Sepolia testnet. 
Celo Docs

Use Composer and the minipay template repository as code references and templates. 
GitHub
+1

2. Goals and success metrics

Primary goals

Build a fully functional PWA that behaves like a native MiniPay mini app, demonstrating wallet onboarding, staking, reward distribution and creator payouts on Celo Sepolia.

Create an engaging microlearning experience that incentivises learning through stakeable challenges.

Ship a robust demo that shows full on-chain flows, testnet transactions and quick, verifiable payouts via MiniPay.

Success metrics (hackathon measurable items)

End-to-end flow demo: deposit → stake → resolution → instant payout (yes/no).

Transaction traceability: every payout must be visible on Sepolia explorer (count).

UX metrics: lesson to stake conversion rate (target 30% for demo data).

Performance: PWA load time under 2s on mobile 3G emulation.

Security: zero critical vulnerabilities in smart contract static analysis and unit tests.

3. Target users and personas

Primary users

Learners: casual mobile users who want to learn a quick skill and earn micro rewards. Low technical knowledge.

Creators / Teachers: educators, community organisers or micro-influencers who author lessons and seed reward pools.

Curators / Sponsors: local organisations or businesses who sponsor reward pools to promote engagement.

Personas (short)

Amina, 21, student in Lagos: uses low-bandwidth phone, wants quick lessons and token rewards she can cash out to local services.

Musa, 34, teacher: uploads local language lessons, seeds small pools to promote his lessons.

Chidi, 27, dev-enthusiast: tests the dApp, stakes to earn reputation, and examines Sepolia transactions.

4. User journeys (happy paths)

Learner onboarding

Open link or install PWA from browser or MiniPay discovery page.

Connect MiniPay or MetaMask configured for Celo Sepolia.

Claim testnet funds from faucet if needed.

Browse micro-lessons and complete first lesson.

Lesson → stake → payout

Complete lesson (MCQ).

Opt into challenge mode: stake 0.1 cUSD on a chosen answer.

If correct, instant payout distributed from the pool to MiniPay wallet via contract + MiniPay flow.

Reputation increases; leaderboards update.

Creator flow

Sign up, create lesson content, set pool seed amount and reward rules.

Publish; track engagement and creator earnings dashboard.

5. Scope and MVP

MVP features (must-have)

PWA shell with mobile-first responsive UI (React + Tailwind).

Wallet integration: MiniPay deeplinks + MetaMask WalletConnect for Celo Sepolia.

Micro-lesson feed: view, take lesson, MCQ UI.

Stakeable challenge per lesson: small cUSD stake flow.

Smart contracts: RewardPool and CommitReveal for secure stake and payout.

Instant payouts shown via Sepolia block explorer.

Creator UI for lesson creation and pool seeding.

Basic reputation system and leaderboards.

Demo video (3–4 minutes) and public GitHub repo with README and setup instructions.

Out of scope for MVP (post-hackathon)

Chainlink oracle integration for complex real-world outcomes.

Advanced anti-cheat machine learning.

Fiat on/off ramps in production.

6. Functional requirements (detailed)

6.1 Onboarding and authentication

FR1: The app shall present an onboarding screen describing MiniPay reward flows and permissions.

FR2: The app shall connect to MiniPay via deeplink and MetaMask/WalletConnect for Sepolia. (Provide fallback to view-only mode for non-wallet users.)

6.2 Wallet and balances

FR3: The app shall display the connected wallet address and cUSD balance on Sepolia.

FR4: The app shall show recent transactions and links to the Sepolia block explorer.

6.3 Micro-lessons

FR5: Lesson metadata: id, title, language, duration, author, difficulty, reward pool id, tags.

FR6: Lessons shall support text, images and one MCQ set per lesson.

6.4 Stakeable challenges

FR7: The app shall allow learner to stake a configurable micro amount (e.g., 0.05–0.5 cUSD) to enter a challenge.

FR8: The app shall create a new stake transaction and record the stake in RewardPool contract.

6.5 Outcome resolution and payouts

FR9: For deterministic quizzes, the correct answer shall be resolved by the system and winners credited.

FR10: The app shall trigger the RewardPool contract to distribute winnings pro rata, then send micropay via MiniPay code flow.

6.6 Creator tools

FR11: Creator can author lesson content, preview and publish.

FR12: Creator can seed pool by sending cUSD; the seeding transaction must be on Sepolia and visible.

6.7 Reputation and leaderboards

FR13: After each resolved challenge, reputation points shall be awarded.

FR14: Leaderboard shall show top users and creators over custom intervals.

6.8 Admin / moderation

FR15: Admin dashboard for dispute resolution, content takedown and seeding emergency funds.

7. Non-functional requirements

7.1 Performance

NFR1: PWA initial load < 3 seconds on 4G; time to interactive < 2s on 3G emulator for key flows.

NFR2: Contract calls for stake and payout should be optimised to reduce gas; batch where possible.

7.2 Availability

NFR3: Frontend served via CDN. Backend minimal and stateless, deploy on Vercel or Netlify.

7.3 Security

NFR4: Use commit-reveal or on-chain verification for prediction markets.

NFR5: Secrets stored in environment variables and not in repo.

NFR6: Smart contracts must pass static analysis (Slither or MythX) and unit tests.

7.4 Privacy and compliance

NFR7: Store no sensitive personal data; tie accounts to wallet addresses. If phone numbers are used for MiniPay deeplinks, ensure they are not stored without consent.

7.5 Localisation and accessibility

NFR8: Support at least English and one local language for initial demo.

NFR9: Follow WCAG 2.1 AA for critical screens.

8. UX / UI guidelines

Design principles

Mobile-first card feed for lessons.

Minimalist interface: large touch targets, single primary CTA per screen.

Quick success feedback: in-place animations when awarding payouts.

Use Composer Kit UI components where helpful to speed development. 
Celo Docs

Key screens

Welcome / Onboarding.

Lesson feed.

Lesson view with MCQ.

Stake confirmation modal.

Wallet & balance view.

Creator lesson editor.

Leaderboard and reputation page.

Admin / dispute resolution console.

Microcopy guidance

Keep copy short and explicit about monetary risks. Provide tooltip explaining "testnet funds" vs real mainnet.

PWA behaviour

Add manifest and service worker for offline caching of lessons. Use staled-while-revalidate for lesson metadata.

9. Technical architecture

High level

Frontend: React + TypeScript + Tailwind CSS + Composer Kit UI; PWA manifest and service worker.

Smart contracts: Solidity (RewardPool, CommitReveal). Deploy to Celo Sepolia.

Backend optional: Node.js + Express API for content storage, file hosting for images and video metadata. Use IPFS for media optional.

Payments: MiniPay code library and deeplinks for in-app flows. 
Celo Docs
+1

Component interactions

Frontend ↔ Backend: REST API for lesson CRUD and analytics.

Frontend ↔ Contract: viem/ethers or thirdweb SDK interacting with deployed RewardPool. 
Celo Docs
+1

Frontend ↔ MiniPay: Deep links to trigger MiniPay wallet and confirm transfers.

Sequence for a stake flow

User selects stake amount and confirms.

Frontend calls write function on RewardPool contract to register stake and transfer cUSD.

On resolution, contract marks winners.

Payout function distributes shares and triggers MiniPay code to notify user and, if needed, to transfer via the MiniPay SDK/flow. (In testnet demo, payout can be a simple contract transfer to the user address, with a UI notification using MiniPay deeplink.)

10. Smart contract specifications

10.1 RewardPool contract (Solidity)

Responsibilities: receive pool funding, accept stakes, record stakes per user per choice, resolve a lesson outcome, calculate shares, distribute payouts.

Key functions:

createPool(lessonId, deadline, choices[], minStake, metadataUri) — only creators can call.

stake(poolId, choice) — payable in cUSD, store stake amount and user address.

resolvePool(poolId, winningChoice) — admin/creator resolves or automated via commit-reveal or oracle.

claimReward(poolId) — users claim their payout; or auto distribute in resolvePool to winners.

10.2 CommitReveal contract (prediction rounds)

Responsibilities: accept commit hashes in commit phase, accept reveals in reveal phase, verify and record choices.

Key functions:

commit(poolId, keccak(choice + salt))

reveal(poolId, choice, salt)

finalize(poolId) — compute winners.

10.3 Gas and token management

Use cUSD token on Sepolia testnet. Ensure the contract uses ERC20 approve + transferFrom pattern for cUSD transfers. Keep contract code small to reduce gas.

10.4 Security checklist for contracts

Input validation for pool parameters.

Reentrancy guards.

SafeMath or solidity 0.8+ built-in checks.

Limit admin privs, events for all state changes.

Unit tests with Hardhat/Foundry and quick static analysis.

Pseudocode snippets will be provided in the appendix.

11. Data model

Primary entities

User (walletAddress, reputation, displayName, createdAt)

Lesson (id, authorAddress, title, language, durationSec, difficulty, contentUri, poolId, createdAt)

Pool (id, lessonId, choices[], deadline, totalStaked, creatorSeed, status)

Stake (id, poolId, userAddress, choice, amount, timestamp, resolved)

Transaction (txHash, type, amount, from, to, timestamp)

Data storage

On-chain: stakes, pool state, payouts (minimal).

Off-chain: lesson content metadata, images, video links, leaderboards cache. Use backend DB (Postgres or Mongo) for metadata and analytics. Use IPFS for media if immutable storage desired.

12. APIs and third-party integrations

12.1 On-chain

Celo Sepolia RPC endpoints (public RPC or Infura/Alchemy if available). Option to run own RPC for reliability. 
Celo Docs

12.2 MiniPay

MiniPay code snippets and deeplinks for triggering wallet screens and deep integration. Use MiniPay code library. 
Celo Docs
+1

12.3 Optional oracles

Chainlink or similar for external resolution; avoid for MVP due to time constraints. 
Celo Docs

12.4 Analytics

Use Plausible or Google Analytics for frontend usage. Store event logs for lesson completions and stake events in backend.

13. Security, fraud and anti-cheat

Anti-cheat strategies

For quizzes: deterministic answers resolved by the platform; no dispute window.

For prediction markets: commit-reveal to prevent front-running.

Minimum stake floor to reduce spam.

Reputation weighting: lower payouts for new accounts until reputation threshold reached.

Creator verification step for published lessons and a small stake to discourage spam.

Smart contract security

Unit testing coverage ≥ 85% for critical contracts.

Static analysis with Slither and manual review.

Limit admin power and time-locked emergency kill switch.

Privacy

Avoid storing phone numbers. Use wallet addresses as the primary identifier. If MiniPay deeplinks require phone numbers, only use them transiently and do not persist them.

14. Testing strategy

Unit tests

Smart contract unit tests with Hardhat/Foundry using Sepolia-compatible toolchain.

Edge cases: multiple winners, zero stakes, underflow/overflow.

Integration tests

End-to-end tests simulating user: connect wallet, stake, resolve, claim.

Use thirdweb or viem test harness if desired.

Manual QA

UX flows, PWA offline behaviour test, MiniPay deeplink flows on Android (Opera Mini + MiniPay) and iOS.

Security testing

Static analysis and gas profiling. Optional bounty for security review.

15. Deployment and devops

15.1 Local dev commands (starter)

Scaffold project:

npx @celo/celo-composer@latest create -t minipay


This uses the Celo Composer Minipay template. 
Celo Docs

Install dependencies:

cd my-miniminds
yarn install


Run dev server:

yarn dev


15.2 Smart contract deployment (example)

Use Hardhat with Celo Sepolia RPC. Add .env:

CELO_SEPOLIA_RPC=https://sepolia-for-celo.example
PRIVATE_KEY=0x...


Deploy:

npx hardhat run scripts/deploy.js --network celo-sepolia


15.3 Testnet funds

Use Celo faucet to fund test wallets. 
faucet.celo.org
+1

15.4 Hosting

Frontend: Vercel or Netlify (PWA ready).

Backend: Serverless function on Vercel or small Node/Express on Render.

15.5 CI/CD

GitHub actions to run tests and deploy to preview environment. Protect main branch.

16. Monitoring and analytics

Track frontend events: lesson views, stake attempted, stake succeeded, payout received.

Track Sepolia transactions for every payout via on-chain listener (use a webhook or thirdweb/Alchemy subscriptions).

Real-time dashboard (admin): number of active pools, TVL on Sepolia, pending disputes.

17. Project plan, milestones and deliverables

Assuming a small hackathon team (3–5 people). Accelerated 7 day plan for robust demo.

Day 0 — Kickoff & scaffold

Scaffold composer minipay template. Wire basic PWA configs. Create repo and CI.

Day 1 — Core UX + onboarding

Lesson feed, lesson view, onboarding and wallet connection.

Day 2 — Smart contracts

Implement RewardPool and CommitReveal; unit tests.

Day 3 — Integrate on-chain flows

Wire frontend to contract calls for stake and resolve. Use Sepolia testnet.

Day 4 — Creator tools and reputation

Creator lesson editor and pool seeding. Reputation logic front end.

Day 5 — Polish + analytics

UX polish, leaderboards, PWA offline caching.

Day 6 — Testing & security

Run tests, static analysis, final bug fixes.

Day 7 — Demo & submission

Produce 3–4 minute demo video, prepare README and deploy.

Deliverables

Public GitHub repository with code and README and quickstart.

Deployed PWA on preview URL and production URL.

Smart contract code and deployments to Sepolia with TX hashes.

Demo video (4-minute), README with Sepolia testnet steps, and submission pack.

18. Team roles and skills

Recommended small team

Product / PM: defines feature priorities and writes README and demo script.

Frontend dev (React + PWA + Composer Kit UI).

Smart contract dev (Solidity + Hardhat/Foundry).

Backend / DevOps (Node, deploy, CI).

Designer (mobile UI + demo assets) optional.

19. Demo checklist for judges (exact things to show)

Open PWA on mobile and show Add to home screen.

Connect to MiniPay wallet via deeplink or WalletConnect on Sepolia.

Display cUSD balance and testnet funding. (Show faucet tx on Sepolia explorer.) 
faucet.celo.org

Take a lesson, opt into challenge mode, stake small amount.

Resolve correct answer; show immediate payout. Click on TX hash to show Sepolia explorer.

Show creator seeding pool and earnings.

Show admin dispute resolution and leaderboards.

Link to public GitHub and README with deploy steps.

20. Risks and mitigations

Oracle complexity: use commit-reveal or community adjudication for hackathon. Mitigation: postpone Chainlink. 
Celo Docs

MiniPay limitations: test integration early; use Composer Minipay template to avoid surprises. 
Celo Docs
+1

Gas and UX latency: batch non-critical writes off-chain where possible and only settle critical state on-chain.

21. Legal and ethical considerations

Provide clear on-screen disclaimers: testnet funds, no real money on demo, age restrictions for staking if applicable.

For real money products, check local gambling laws where predictions with stakes could be regulated. For hackathon demo use only testnet and micro amounts.

22. Acceptance criteria

The project is acceptable for hackathon submission when:

The repo is public with a working README and deploy instructions.

The PWA demonstrates wallet connect, stake, resolution and payout on Celo Sepolia with verifiable TX hashes.

A creator can publish a lesson, seed a reward pool and see engagement analytics.

Demo video clearly shows full flow in under 4 minutes.

23. Appendix
23.1 Essential commands and quickstart

Scaffold with Composer Minipay template:

npx @celo/celo-composer@latest create -t minipay


This is the recommended quickstart for MiniPay development. 
Celo Docs

Example repo references:

Minipay template repo: https://github.com/celo-org/minipay-template
. 
GitHub

Celo Composer repo: https://github.com/celo-org/celo-composer
. 
GitHub

Faucet for Sepolia/Celo testnet funds:

Official faucet and rules: https://faucet.celo.org/
 and Celo Sepolia docs. 
faucet.celo.org
+1

23.2 Sample contract pseudocode

RewardPool.sol (high level)

pragma solidity ^0.8.17;
interface IERC20 { ... } // cUSD interface

contract RewardPool {
  struct Pool { uint id; address creator; uint deadline; uint totalStaked; mapping(uint => uint) choiceStakes; bool resolved; uint winningChoice; }
  mapping(uint => Pool) public pools;
  IERC20 public cUSD;

  function createPool(uint id, uint deadline, uint[] memory choices) external {
    // store pool metadata
  }

  function stake(uint poolId, uint choice, uint amount) external {
    // require approve done, transferFrom cUSD, update stakes
  }

  function resolvePool(uint poolId, uint winningChoice) external onlyAdminOrCreator {
    // compute winners, send payouts via transfer to addresses
  }
}


CommitReveal sketch omitted for brevity; implement commit(bytes32) and reveal(choice, salt).

23.3 Environment variables (example)
NEXT_PUBLIC_CELO_SEPOLIA_RPC=https://<rpc-url>
PRIVATE_KEY=0x...
MINIPAY_APP_ID=...

23.4 Useful references and docs (selected)

Celo Composer Minipay quickstart.  
https://docs.celo.org/build-on-celo/build-on-minipay/quickstart?utm_source=chatgpt.com

MiniPay overview and developer docs. 
https://docs.celo.org/build-on-celo/build-on-minipay/overview?utm_source=chatgpt.com

Celo Sepolia testnet docs and faucet. 

https://docs.celo.org/tooling/testnets/celo-sepolia?utm_source=chatgpt.com

Celo SDKs and supported libraries. 

https://docs.celo.org/tooling/libraries-sdks/celo-sdks?utm_source=chatgpt.com