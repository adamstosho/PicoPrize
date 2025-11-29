# 🧪 PicoPrize Testing Guide - Simple Steps

## 📋 Prerequisites

### 1. Install Required Tools
```bash
# Check if you have Node.js (v18+)
node --version

# Check if you have pnpm
pnpm --version

# If not installed:
npm install -g pnpm
```

### 2. Get Testnet Funds
You'll need **two types** of tokens on Celo Sepolia:

1. **CELO** (for gas fees)
2. **cUSD** (for staking)

**Get Testnet Tokens:**
1. Visit: https://faucet.celo.org
2. Connect your wallet (MetaMask)
3. Switch to **Celo Sepolia** network
4. Request both **CELO** and **cUSD** tokens
5. Wait 1-2 minutes for tokens to arrive

**Minimum Required:**
- CELO: 0.1 (for gas)
- cUSD: 1.0 (for testing stakes)

---

## 🚀 Step 1: Start the App

### Terminal 1: Start Frontend
```bash
cd /root/PicoPrize/apps/web
pnpm install  # Only needed first time
pnpm dev
```

**Expected Output:**
```
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

### Open Browser
1. Go to: `http://localhost:3000`
2. You should see the PicoPrize homepage

---

## ✅ Step 2: Test Wallet Connection

### What to Do:
1. Click **"Connect Wallet"** button (top right)
2. Select **MetaMask** (or your preferred wallet)
3. **Approve** connection in wallet popup
4. **Switch network** to Celo Sepolia if prompted

### What to Verify:
- ✅ Wallet address shows in header
- ✅ cUSD balance displays (should show your testnet balance)
- ✅ Network shows "Celo Sepolia" (or chain ID 44787)

**If Issues:**
- Make sure MetaMask is installed
- Check you're on Celo Sepolia network
- Refresh page and try again

---

## 📚 Step 3: Browse Lessons

### What to Do:
1. Navigate to **"Lessons"** tab
2. Browse the lesson feed
3. Click on any lesson card

### What to Verify:
- ✅ Lesson feed loads (may be empty if no pools created yet)
- ✅ Lesson cards show:
  - Title
  - Author
  - Difficulty
  - Stake info (min/max)
  - Deadline
- ✅ Clicking a lesson opens lesson view

**Expected Behavior:**
- If no pools exist, you'll see empty state or default lessons
- This is normal for first-time testing

---

## 🎯 Step 4: Create a Test Pool (Creator Flow)

### What to Do:
1. Navigate to **"Creator"** tab
2. Click **"Create Lesson"** or **"New Pool"**
3. Fill in the form:
   - **Title**: "Test Lesson 1"
   - **Description**: "This is a test lesson"
   - **Content**: Add some text
   - **Question**: "What is 2+2?"
   - **Options**: ["3", "4", "5", "6"]
   - **Correct Answer**: Option 1 (4)
   - **Difficulty**: Beginner
   - **Language**: English
4. Set Pool Parameters:
   - **Deadline**: 24 hours from now
   - **Min Stake**: 0.1 cUSD
   - **Max Stake**: 5.0 cUSD
   - **Creator Seed**: 0.5 cUSD (optional)
   - **Creator Fee**: 1% (100 basis points)
5. Click **"Publish"** or **"Create Pool"**

### Transaction Flow:
1. **First Transaction**: Approve cUSD (if seeding pool)
   - Click "Approve" in wallet
   - Wait for confirmation (~5-10 seconds)
2. **Second Transaction**: Create Pool
   - Click "Confirm" in wallet
   - Wait for confirmation (~5-10 seconds)

### What to Verify:
- ✅ Approval transaction succeeds
- ✅ Pool creation transaction succeeds
- ✅ Success message shows with transaction hash
- ✅ Pool appears in lesson feed
- ✅ Pool shows correct parameters

**Transaction Hashes:**
- Copy the transaction hash
- Visit: https://celo-sepolia.blockscout.com
- Paste hash to verify on explorer

---

## 💰 Step 5: Test Staking Flow

### What to Do:
1. Go to **"Lessons"** tab
2. Click on the pool you just created
3. Read the lesson content
4. Answer the MCQ question
5. Toggle **"Challenge Mode"** ON
6. Select **stake amount** (slider: 0.1 - 5.0 cUSD)
7. Select your **answer choice**
8. Click **"Stake & Submit"**

### Transaction Flow:
1. **First Transaction** (if needed): Approve cUSD
   - Wallet popup appears
   - Click "Approve"
   - Wait for confirmation
2. **Second Transaction**: Stake
   - Wallet popup appears
   - Click "Confirm"
   - Wait for confirmation (~5-10 seconds)

### What to Verify:
- ✅ Approval succeeds (if needed)
- ✅ Stake transaction succeeds
- ✅ Success message shows
- ✅ Transaction hash is displayed
- ✅ Pool total staked increases
- ✅ Your stake shows in pool stats

**Check Transaction:**
- Copy transaction hash
- Visit: https://celo-sepolia.blockscout.com
- Verify transaction details

---

## 🏆 Step 6: Test Pool Resolution

### What to Do:
1. As the **pool creator**, go to your pool
2. Click **"Resolve Pool"** button
3. Select the **winning choice** (correct answer)
4. Click **"Confirm Resolution"**
5. Confirm transaction in wallet

### What to Verify:
- ✅ Resolution transaction succeeds
- ✅ Pool status changes to "Resolved"
- ✅ Winning choice is displayed
- ✅ Winners can now claim rewards

**Note:** Only pool creator or admin can resolve pools.

---

## 💸 Step 7: Test Reward Claiming

### What to Do:
1. If you staked on the **winning choice**:
   - Go to the resolved pool
   - Click **"Claim Reward"** button
   - Confirm transaction in wallet
   - Wait for confirmation
2. If you staked on the **wrong choice**:
   - You won't see "Claim Reward" button
   - This is expected behavior

### What to Verify:
- ✅ Claim transaction succeeds
- ✅ cUSD balance increases
- ✅ Success message shows
- ✅ Transaction hash is displayed

**Check Balance:**
- Your wallet balance should increase
- Check on Celo Sepolia explorer

---

## 📊 Step 8: Test Leaderboard

### What to Do:
1. Navigate to **"Leaderboard"** tab
2. View top users
3. Check your ranking

### What to Verify:
- ✅ Leaderboard loads
- ✅ Shows user addresses
- ✅ Shows reputation points
- ✅ Your address appears (if you have points)
- ✅ Rankings are sorted correctly

---

## 🎖️ Step 9: Test Reputation System

### What to Do:
1. Complete multiple challenges
2. Win some, lose some
3. Check your profile/stats

### What to Verify:
- ✅ Reputation points increase
- ✅ Challenges won/lost tracked
- ✅ Streak counter works
- ✅ Achievements unlock:
   - "First Steps" (first lesson)
   - "Quick Learner" (5 wins)
   - "On Fire" (5 streak)
   - etc.

---

## 🔍 Step 10: Verify On-Chain Data

### Check Smart Contracts on Explorer

1. **PicoPrizePool Contract:**
   - Address: `0xcc021afa714ffabb70b78a14d38850129756f0bc`
   - Visit: https://celo-sepolia.blockscout.com/address/0xcc021afa714ffabb70b78a14d38850129756f0bc
   - Check:
     - Pool counter
     - Recent transactions
     - Events (PoolCreated, StakePlaced, etc.)

2. **PicoPrizeReputation Contract:**
   - Address: `0xa158aabbe5d7fd53a50031f83db1de19bba3d3e4`
   - Visit: https://celo-sepolia.blockscout.com/address/0xa158aabbe5d7fd53a50031f83db1de19bba3d3e4
   - Check:
     - Your user stats
     - Leaderboard data

3. **Your Transactions:**
   - Go to: https://celo-sepolia.blockscout.com
   - Paste your wallet address
   - View all transactions:
     - Approve transactions
     - Stake transactions
     - Claim transactions
     - Pool creation transactions

---

## 🐛 Common Issues & Solutions

### Issue 1: "Insufficient funds"
**Solution:**
- Get more testnet tokens from faucet
- Make sure you have both CELO (gas) and cUSD (staking)

### Issue 2: "Transaction failed"
**Solution:**
- Check you're on Celo Sepolia network
- Check you have enough CELO for gas
- Check error message in wallet
- Try increasing gas limit

### Issue 3: "Pool not found"
**Solution:**
- Make sure pool was created successfully
- Check transaction hash on explorer
- Refresh the page

### Issue 4: "Cannot resolve pool"
**Solution:**
- Only creator or admin can resolve
- Make sure you're the pool creator
- Check pool deadline hasn't passed

### Issue 5: "Wallet not connecting"
**Solution:**
- Refresh page
- Clear browser cache
- Make sure MetaMask is unlocked
- Check MetaMask extension is enabled

### Issue 6: "Wrong network"
**Solution:**
- Click "Switch Network" button
- Or manually add Celo Sepolia to MetaMask:
  - Network Name: Celo Sepolia
  - RPC URL: https://sepolia-forno.celo-testnet.org
  - Chain ID: 44787
  - Currency Symbol: CELO
  - Block Explorer: https://celo-sepolia.blockscout.com

---

## ✅ Testing Checklist

Use this checklist to ensure everything works:

### Wallet & Connection
- [ ] Wallet connects successfully
- [ ] cUSD balance displays correctly
- [ ] Network is Celo Sepolia
- [ ] Can disconnect/reconnect wallet

### Pool Creation
- [ ] Can create a new pool
- [ ] Approval transaction succeeds
- [ ] Pool creation transaction succeeds
- [ ] Pool appears in lesson feed
- [ ] Pool parameters are correct

### Staking
- [ ] Can view pool details
- [ ] Can enable challenge mode
- [ ] Can select stake amount
- [ ] Approval transaction succeeds (if needed)
- [ ] Stake transaction succeeds
- [ ] Pool total staked updates
- [ ] Transaction hash is displayed

### Resolution
- [ ] Creator can resolve pool
- [ ] Resolution transaction succeeds
- [ ] Pool status changes to "Resolved"
- [ ] Winning choice is displayed

### Rewards
- [ ] Winners can claim rewards
- [ ] Claim transaction succeeds
- [ ] Balance increases correctly
- [ ] Non-winners cannot claim

### Reputation
- [ ] Reputation points update
- [ ] Stats are tracked correctly
- [ ] Achievements unlock
- [ ] Leaderboard shows data

### UI/UX
- [ ] All pages load correctly
- [ ] No console errors
- [ ] Transactions show loading states
- [ ] Success/error messages display
- [ ] Mobile responsive (test on phone)

---

## 📱 Mobile Testing

### Test on Mobile Device:

1. **Start dev server with network access:**
   ```bash
   # Find your local IP
   ip addr show | grep "inet " | grep -v 127.0.0.1
   
   # Start dev server (replace with your IP)
   pnpm dev --host 0.0.0.0
   ```

2. **Access from mobile:**
   - Connect phone to same WiFi
   - Open browser: `http://YOUR_IP:3000`
   - Test wallet connection (WalletConnect)

3. **Test PWA features:**
   - Add to home screen
   - Test offline mode
   - Test service worker

---

## 🎬 Demo Flow (For Recording)

If recording a demo video, follow this flow:

1. **Introduction** (30 sec)
   - Show homepage
   - Explain what PicoPrize is

2. **Connect Wallet** (30 sec)
   - Show connection process
   - Show balance

3. **Create Pool** (1 min)
   - Show creator dashboard
   - Create a pool
   - Show transaction on explorer

4. **Take Lesson & Stake** (2 min)
   - Browse lessons
   - Take lesson
   - Stake on answer
   - Show transaction

5. **Resolve & Claim** (1 min)
   - Resolve pool
   - Claim reward
   - Show balance increase

6. **Leaderboard** (30 sec)
   - Show leaderboard
   - Show reputation

**Total: ~5 minutes**

---

## 📞 Need Help?

If you encounter issues:

1. **Check Console:**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

2. **Check Transactions:**
   - View on Celo Sepolia explorer
   - Check transaction status
   - Read error messages

3. **Check Contract State:**
   - Use block explorer to read contract state
   - Verify pool exists
   - Check user stakes

4. **Restart:**
   - Restart dev server
   - Clear browser cache
   - Reconnect wallet

---

## 🎉 Success Criteria

Your app is working correctly if:

✅ All transactions succeed on-chain  
✅ All data displays correctly  
✅ No console errors  
✅ Wallet connection is stable  
✅ Transactions are verifiable on explorer  
✅ Reputation system tracks correctly  
✅ Leaderboard shows real data  

**You're ready to demo!** 🚀

