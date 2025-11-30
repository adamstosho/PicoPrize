#!/bin/bash

# MiniPay Mini App Testing Setup with ngrok
# This script helps you test your PicoPrize app in MiniPay using ngrok

set -e

echo "🚀 PicoPrize MiniPay Testing Setup"
echo "=================================="
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok is not installed."
    echo ""
    echo "Please install ngrok:"
    echo "  Option 1: Download from https://ngrok.com/download"
    echo "  Option 2: Install via package manager:"
    echo "    - macOS: brew install ngrok/ngrok/ngrok"
    echo "    - Linux: Download from https://ngrok.com/download"
    echo "    - Windows: Download from https://ngrok.com/download"
    echo ""
    echo "After installation, sign up at https://dashboard.ngrok.com and get your authtoken"
    echo "Then run: ngrok config add-authtoken YOUR_TOKEN"
    exit 1
fi

# Check if Next.js dev server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "⚠️  Next.js dev server is not running on port 3000"
    echo ""
    echo "Please start the dev server first:"
    echo "  cd apps/web && pnpm dev"
    echo ""
    read -p "Press Enter to continue anyway (ngrok will start but won't work until server is running)..."
fi

echo "✅ Starting ngrok tunnel..."
echo ""
echo "📱 Your MiniPay testing URL will be displayed below"
echo "   Copy the HTTPS URL (e.g., https://xxxx-xx-xx-xx-xx.ngrok-free.app)"
echo "   and use it to test your app in MiniPay"
echo ""
echo "⚠️  Note: Free ngrok URLs change each time you restart ngrok"
echo "   For production, use a fixed domain or ngrok paid plan"
echo ""
echo "Press Ctrl+C to stop ngrok"
echo ""

# Start ngrok tunnel
ngrok http 3000 --log=stdout

