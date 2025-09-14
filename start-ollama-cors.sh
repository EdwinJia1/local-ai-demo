#!/bin/bash

echo "🔥 Starting Ollama with CORS enabled..."

# Kill any existing Ollama processes
pkill -f ollama
sleep 2

# Export CORS environment variables
export OLLAMA_ORIGINS="*"
export OLLAMA_HOST="0.0.0.0:11434"

echo "🌐 CORS Origins: $OLLAMA_ORIGINS"
echo "🔌 Host: $OLLAMA_HOST"

# Start Ollama in background
nohup ollama serve > ollama.log 2>&1 &

# Wait for startup
echo "⏳ Waiting for Ollama to start..."
sleep 5

# Test connection
if curl -s http://127.0.0.1:11434/api/tags > /dev/null; then
    echo "✅ Ollama started successfully with CORS enabled!"
    echo ""
    echo "🤖 Available models:"
    curl -s http://127.0.0.1:11434/api/tags | jq -r '.models[].name' 2>/dev/null || echo "  - Check ollama.log for details"
    echo ""
    echo "🌐 Configure your demo with:"
    echo "   Base URL: http://127.0.0.1:11434"
    echo "   Provider: Ollama"
    echo "   Model: gemma3:1b"
else
    echo "❌ Failed to start Ollama"
    echo "📋 Check ollama.log for details"
    tail -10 ollama.log 2>/dev/null || echo "No log file found"
fi