#!/bin/bash

# Quick start script for MiniPay testing
# This script helps you start both the dev server and ngrok

set -e

echo "🚀 PicoPrize MiniPay Testing - Quick Start"
echo "=========================================="
echo ""

# Check if dev server is already running
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Dev server is already running on port 3000"
    echo ""
    echo "Starting ngrok tunnel..."
    echo ""
    echo "📱 Your MiniPay testing URL will appear below:"
    echo "   Copy the HTTPS URL (e.g., https://xxxx-xx-xx-xx-xx.ngrok-free.app)"
    echo "   and use it to test your app in MiniPay"
    echo ""
    echo "Press Ctrl+C to stop ngrok"
    echo ""
    ngrok http 3000
else
    echo "⚠️  Dev server is not running on port 3000"
    echo ""
    echo "Please start the dev server first in another terminal:"
    echo "  cd apps/web && pnpm dev"
    echo ""
    echo "Then come back and run this script again, or run:"
    echo "  ngrok http 3000"
    echo ""
    exit 1
fi

