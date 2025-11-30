# MiniPay Mini App Testing Guide

This guide will help you test PicoPrize as a MiniPay Mini App using ngrok for local development.

## Prerequisites

1. **MiniPay App**: Install MiniPay on your mobile device (available on Opera browser)
2. **ngrok**: Install ngrok for creating HTTPS tunnels
3. **Node.js & pnpm**: Ensure your development environment is set up

## Step 1: Install ngrok

### Option A: Download from Website
1. Visit [https://ngrok.com/download](https://ngrok.com/download)
2. Download for your operating system
3. Extract and add to your PATH

### Option B: Package Manager

**macOS:**
```bash
brew install ngrok/ngrok/ngrok
```

**Linux:**
```bash
# Download from https://ngrok.com/download
# Or use snap: snap install ngrok
```

**Windows:**
Download the executable from [ngrok.com](https://ngrok.com/download)

### Setup ngrok Account
1. Sign up at [https://dashboard.ngrok.com](https://dashboard.ngrok.com) (free account works)
2. Get your authtoken from the dashboard
3. Configure ngrok:
```bash
ngrok config add-authtoken YOUR_AUTHTOKEN
```

## Step 2: Start Your Development Server

In one terminal, start your Next.js dev server:

```bash
cd apps/web
pnpm dev
```

Your app should be running on `http://localhost:3000`

## Step 3: Start ngrok Tunnel

### Option A: Using the Setup Script

```bash
cd apps/web
chmod +x scripts/setup-ngrok.sh
./scripts/setup-ngrok.sh
```

### Option B: Manual ngrok Command

In another terminal, run:

```bash
ngrok http 3000
```

You'll see output like:
```
Forwarding  https://xxxx-xx-xx-xx-xx.ngrok-free.app -> http://localhost:3000
```

**Copy the HTTPS URL** (the one starting with `https://`)

## Step 4: Test in MiniPay

1. **Open MiniPay** on your mobile device
2. **Navigate to Mini Apps** section (if available)
3. **Enter your ngrok URL** in the Mini App URL field:
   - Example: `https://xxxx-xx-xx-xx-xx.ngrok-free.app`
4. **Open the app** - PicoPrize should load in MiniPay
5. **Test wallet connection** - MiniPay should auto-connect

## Step 5: Testing Checklist

- [ ] App loads correctly in MiniPay
- [ ] Wallet auto-connects (no manual connection needed)
- [ ] Can browse lessons
- [ ] Can take quizzes
- [ ] Can stake on predictions
- [ ] Can claim rewards
- [ ] Creator dashboard works
- [ ] All pages are accessible
- [ ] Mobile UI is responsive

## Troubleshooting

### Issue: ngrok URL shows "ngrok - 404 Not Found"
**Solution:** Make sure your Next.js dev server is running on port 3000

### Issue: App doesn't load in MiniPay
**Solutions:**
- Verify the ngrok URL is HTTPS (not HTTP)
- Check that ngrok tunnel is active
- Try refreshing the Mini App in MiniPay
- Check browser console for errors

### Issue: Wallet doesn't auto-connect
**Solutions:**
- Ensure you're using the latest version of MiniPay
- Check that `window.ethereum.isMiniPay` is detected
- Verify the wallet provider code is working

### Issue: ngrok URL changes every time
**Solution:** 
- This is normal for free ngrok accounts
- For production, use:
  - Fixed domain with ngrok paid plan
  - Deploy to Vercel/Netlify (already has HTTPS)
  - Use a custom domain

## Production Deployment

For production, you don't need ngrok because:
- Vercel provides HTTPS automatically
- Your deployed URL (e.g., `https://picoprize.vercel.app`) works directly
- Just use your production URL in MiniPay

## Additional Resources

- [ngrok Documentation](https://ngrok.com/docs)
- [MiniPay Documentation](https://docs.celo.org/developer/minipay)
- [Celo Developer Resources](https://docs.celo.org)

## Notes

- Free ngrok URLs expire after 2 hours of inactivity
- Free ngrok URLs change on each restart
- For consistent testing, consider ngrok paid plan or deploy to staging
- Always test on actual mobile device for best results

