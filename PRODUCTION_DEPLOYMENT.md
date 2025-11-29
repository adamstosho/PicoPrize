# Production Deployment Checklist

## 🔒 Security Checklist

### ✅ Environment Variables
- [x] All `.env` files are in `.gitignore`
- [x] No private keys in source code
- [x] No API keys hardcoded
- [x] Contract addresses use environment variables
- [x] Fallback addresses removed/neutralized

### Required Environment Variables

**Frontend (`apps/web/.env.local` or production env vars):**
```bash
NEXT_PUBLIC_PICOPRIZE_POOL_ADDRESS=0x_your_pool_address
NEXT_PUBLIC_PICOPRIZE_REPUTATION_ADDRESS=0x_your_reputation_address
NEXT_PUBLIC_PICOPRIZE_COMMIT_REVEAL_ADDRESS=0x_your_commit_reveal_address
NEXT_PUBLIC_CUSD_ADDRESS=0x_your_cusd_address
```

**Contracts (`apps/contracts/.env` - NEVER commit this):**
```bash
PRIVATE_KEY=your_private_key_here
CELOSCAN_API_KEY=your_api_key_here
TREASURY_ADDRESS=0x_your_treasury_address
```

### ⚠️ Important Security Notes

1. **NEVER commit `.env` or `.env.local` files**
2. **NEVER commit private keys or API keys**
3. **Use environment variables in your deployment platform** (Vercel, Netlify, etc.)
4. **Contract addresses are public** - that's fine, they're meant to be public
5. **Private keys should ONLY be in `.env` files** (already in .gitignore)

---

## 🧹 Files to Review Before Deployment

### Files That Are Safe to Commit:
- ✅ `apps/web/data/lessons.json` - User-generated content (public data)
- ✅ All source code files
- ✅ Configuration files (package.json, tsconfig.json, etc.)
- ✅ Documentation files

### Files That Are Already Ignored (Good):
- ✅ `.env` files
- ✅ `.env.local` files
- ✅ `node_modules/`
- ✅ `.next/` (build output)
- ✅ `artifacts/`, `cache/`, `deployments/` (Hardhat)

### Optional: Files You Might Want to Remove:
- Documentation files (if you want a cleaner repo):
  - `ArchectureAndUserFlow.md`
  - `COMPREHENSIVE_REVIEW.md`
  - `FIND_CUSD_ADDRESS.md`
  - `FLOW_TEST_CHECKLIST.md`
  - `FLOW_VERIFICATION_REPORT.md`
  - `HOW_IT_WORKS.md`
  - `INTEGRATION_PLAN.md`
  - `TESTING_GUIDE.md`
  - `designSystem.md`
  - `projectPRD.md`

**Note:** These are helpful for development but not needed for production. You can keep them or remove them.

---

## 🚀 Deployment Steps

### 1. Pre-Deployment Checks

```bash
# 1. Verify no secrets in code
cd /root/PicoPrize
grep -r "PRIVATE_KEY\|API_KEY\|SECRET" apps/web/src --exclude-dir=node_modules || echo "✅ No secrets found"

# 2. Verify .env files are ignored
git check-ignore .env apps/contracts/.env apps/web/.env.local || echo "⚠️ Check .gitignore"

# 3. Test production build
cd apps/web
npm run build
```

### 2. Set Environment Variables

**For Vercel:**
1. Go to Project Settings → Environment Variables
2. Add all `NEXT_PUBLIC_*` variables
3. Redeploy

**For Netlify:**
1. Go to Site Settings → Environment Variables
2. Add all `NEXT_PUBLIC_*` variables
3. Redeploy

**For Other Platforms:**
- Set environment variables according to your platform's documentation
- Ensure all `NEXT_PUBLIC_*` variables are set

### 3. Build and Deploy

```bash
# Build the application
cd apps/web
npm run build

# Start production server (for testing)
npm start
```

### 4. Post-Deployment Verification

- [ ] Wallet connection works
- [ ] Balance displays correctly
- [ ] Can create pools
- [ ] Can stake on pools
- [ ] Can claim rewards
- [ ] Leaderboard displays correctly
- [ ] All pages load without errors
- [ ] No console errors in browser

---

## 📝 Environment Variable Template

Create `.env.example` files for reference (safe to commit):

**`apps/web/.env.example`:**
```bash
# PicoPrize Contract Addresses (Celo Sepolia)
NEXT_PUBLIC_PICOPRIZE_POOL_ADDRESS=0x_your_pool_address
NEXT_PUBLIC_PICOPRIZE_REPUTATION_ADDRESS=0x_your_reputation_address
NEXT_PUBLIC_PICOPRIZE_COMMIT_REVEAL_ADDRESS=0x_your_commit_reveal_address
NEXT_PUBLIC_CUSD_ADDRESS=0x_your_cusd_address
```

**`apps/contracts/.env.example`:**
```bash
# Hardhat Configuration
PRIVATE_KEY=your_private_key_here
CELOSCAN_API_KEY=your_api_key_here
TREASURY_ADDRESS=0x_your_treasury_address

# Contract Addresses (after deployment)
PICOPRIZE_POOL_ADDRESS=0x_your_pool_address
PICOPRIZE_REPUTATION_ADDRESS=0x_your_reputation_address
PICOPRIZE_COMMIT_REVEAL_ADDRESS=0x_your_commit_reveal_address
CUSD_ADDRESS=0x_your_cusd_address
```

---

## ✅ Final Checklist Before Pushing to Production

- [x] All `.env` files are in `.gitignore`
- [x] No private keys in source code
- [x] No API keys hardcoded
- [x] Contract addresses use environment variables
- [x] Old fallback addresses removed
- [x] Production build succeeds
- [x] All tests pass (if applicable)
- [x] Environment variables documented
- [x] README updated with deployment instructions

---

## 🎯 Quick Start for Production

1. **Set environment variables** in your deployment platform
2. **Build the app**: `cd apps/web && npm run build`
3. **Deploy** to your platform (Vercel, Netlify, etc.)
4. **Verify** all features work correctly
5. **Monitor** for any errors

---

**Last Updated**: $(date)
**Status**: ✅ Ready for Production

