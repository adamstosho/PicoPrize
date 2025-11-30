# Quick Start: MiniPay Testing

Your ngrok is now configured! Here's how to test PicoPrize in MiniPay:

## Option 1: Quick Start (Recommended)

### Step 1: Start Dev Server
Open a terminal and run:
```bash
cd apps/web
pnpm dev
```
Wait for it to show: `✓ Ready on http://localhost:3000`

### Step 2: Start ngrok Tunnel
Open **another terminal** and run:
```bash
cd apps/web
./scripts/start-minipay-test.sh
```

Or manually:
```bash
ngrok http 3000
```

### Step 3: Copy HTTPS URL
You'll see output like:
```
Forwarding  https://xxxx-xx-xx-xx-xx.ngrok-free.app -> http://localhost:3000
```

**Copy the HTTPS URL** (the one starting with `https://`)

### Step 4: Test in MiniPay
1. Open **MiniPay** on your mobile device
2. Navigate to **Mini Apps** section
3. Enter your ngrok HTTPS URL
4. The app should load and auto-connect your wallet! 🎉

---

## Option 2: Using npm Scripts

### Terminal 1 (Dev Server):
```bash
cd apps/web
pnpm dev
```

### Terminal 2 (ngrok):
```bash
cd apps/web
pnpm test:minipay
```

---

## What to Test

✅ App loads correctly  
✅ Wallet auto-connects (no manual connection needed)  
✅ Can browse lessons  
✅ Can take quizzes  
✅ Can stake on predictions  
✅ Can claim rewards  
✅ Creator dashboard works  
✅ All navigation works  

---

## Troubleshooting

**Problem:** ngrok shows "404 Not Found"  
**Solution:** Make sure dev server is running on port 3000

**Problem:** App doesn't load in MiniPay  
**Solution:** 
- Use the HTTPS URL (not HTTP)
- Check that ngrok tunnel is active
- Try refreshing in MiniPay

**Problem:** Wallet doesn't auto-connect  
**Solution:**
- Ensure latest MiniPay version
- Check browser console for errors

---

## Notes

- Free ngrok URLs change on each restart
- For consistent testing, consider ngrok paid plan
- Production: No ngrok needed - Vercel already has HTTPS

---

**Happy Testing! 🚀**

