# 🚀 Local AI Demo - Quick Start & Debugging Guide

## 📖 Table of Contents
- [5-Minute Setup](#5-minute-setup)
- [API Integration](#api-integration) 
- [Debugging Guide](#debugging-guide)
- [Common Issues & Solutions](#common-issues--solutions)
- [Testing Your Setup](#testing-your-setup)

---

## ⚡ 5-Minute Setup

### Step 1: Download & Extract
```bash
# Extract the demo package to your desired folder
cd local-ai-demo-package
```

### Step 2: Choose Your AI Provider

#### Option A: Ollama (Recommended for beginners)
```bash
# 1. Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# 2. Pull a small model for testing
ollama pull gemma3:1b

# 3. Start Ollama with CORS (use our script)
chmod +x start-ollama-cors.sh
./start-ollama-cors.sh
```

#### Option B: Use Existing OpenAI-Compatible API
If you already have ChatGPT, Claude, or other API access, skip to [API Integration](#api-integration).

### Step 3: Start the Demo
```bash
# Option 1: Simple file open
open index.html

# Option 2: Local server (recommended)
python3 -m http.server 3000
# Then visit: http://localhost:3000
```

### Step 4: Configure & Test
1. Click **"Connect Model"** button
2. Fill in your settings (see [API Integration](#api-integration))
3. Click **"Test"** - should show ✅ success
4. Click **"Save"** and start chatting!

---

## 🔌 API Integration

### Ollama (Local)
```
Provider: Ollama
Base URL: http://127.0.0.1:11434
Model: gemma3:1b
API Key: (leave empty)
```

### OpenAI
```
Provider: OpenAI
Base URL: https://api.openai.com
Model: gpt-3.5-turbo
API Key: sk-your-api-key-here
```

### Local llama.cpp Server
```bash
# Start llama.cpp server first:
./server -m your-model.gguf --host 0.0.0.0 --port 8080 --cors

# Then configure:
Provider: llama.cpp  
Base URL: http://localhost:8080
Model: your-model-name
API Key: (leave empty)
```

### Claude (via OpenAI-compatible endpoint)
```
Provider: OpenAI
Base URL: https://api.anthropic.com/v1
Model: claude-3-haiku-20240307  
API Key: your-anthropic-key
```

### Custom API
```
Provider: Generic
Base URL: http://your-server.com:port
Path: /v1/chat/completions (or your endpoint)
Model: your-model-name
API Key: your-key-if-needed
```

---

## 🐛 Debugging Guide

### Check 1: Is Your AI Server Running?

**For Ollama:**
```bash
# Check if Ollama is running
curl http://127.0.0.1:11434/api/tags

# Expected output: JSON with models list
# If error: restart Ollama with our CORS script
./start-ollama-cors.sh
```

**For Other APIs:**
```bash
# Test your API endpoint
curl -X POST "YOUR_BASE_URL/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "YOUR_MODEL",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 50
  }'
```

### Check 2: Browser Console Debugging

1. **Open Developer Tools**: F12 or Ctrl+Shift+I
2. **Go to Console tab**
3. **Click "Test" in the demo** - look for error messages:

**Common Console Errors & Fixes:**

```javascript
// ERROR: CORS policy blocks request
// FIX: Use CORS proxy
python3 cors_proxy.py  // Start proxy on port 8080
// Then set Base URL to: http://localhost:8080

// ERROR: Failed to fetch
// FIX: Check if server is running and URL is correct

// ERROR: 401 Unauthorized  
// FIX: Check your API key

// ERROR: 404 Not Found
// FIX: Verify your endpoint path and model name
```

### Check 3: Network Tab Analysis

1. **F12 → Network tab**
2. **Click "Test" in demo**
3. **Look for failed requests (red entries)**

**What to check:**
- Request URL matches your configuration
- Status codes: 200=success, 4xx=client error, 5xx=server error
- Response headers include CORS headers if needed

---

## ❗ Common Issues & Solutions

### Issue 1: "CORS Error" 
**Symptoms:** Console shows CORS policy error
**Solutions:**
```bash
# Solution A: Enable CORS on your server
export OLLAMA_ORIGINS="*"
ollama serve

# Solution B: Use our CORS proxy
python3 cors_proxy.py
# Change Base URL to: http://localhost:8080
```

### Issue 2: "Connection Refused"
**Symptoms:** Cannot reach server
**Solutions:**
```bash
# Check if service is running
netstat -an | grep 11434  # For Ollama
netstat -an | grep 8080   # For llama.cpp

# Restart services
./start-ollama-cors.sh

# Check firewall settings
sudo ufw allow 11434  # Linux
```

### Issue 3: "Model Not Found"
**Symptoms:** 404 error or model not available
**Solutions:**
```bash
# List available models
ollama list                    # For Ollama
curl localhost:8080/v1/models  # For OpenAI-compatible

# Pull/download the model
ollama pull gemma3:1b
```

### Issue 4: "Slow Responses"
**Symptoms:** Long wait times
**Solutions:**
```bash
# Use smaller models
ollama pull gemma3:1b  # Instead of larger models

# Enable GPU (if available)
# Make sure CUDA/Metal is properly configured

# Reduce max_tokens in the demo configuration
```

### Issue 5: "Demo UI Issues"
**Symptoms:** Buttons don't work, scrolling problems
**Solutions:**
```javascript
// Hard refresh the page
Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

// Clear browser cache
// Check if JavaScript is enabled

// Try different browser (Chrome recommended)
```

---

## ✅ Testing Your Setup

### Test 1: API Connectivity
```bash
# Quick API test (replace with your settings)
curl -X POST "http://127.0.0.1:11434/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma3:1b",
    "messages": [{"role": "user", "content": "Say hello"}],
    "stream": false
  }'
```

### Test 2: Demo Functionality Checklist
- [ ] Page loads without errors
- [ ] "Connect Model" modal opens
- [ ] Configuration saves successfully  
- [ ] "Test" button shows green checkmark
- [ ] Chat input accepts text
- [ ] Send button/Enter key works
- [ ] AI responses appear
- [ ] Chat scrolls properly
- [ ] Language toggle works (if applicable)

### Test 3: Performance Check
```bash
# Monitor resource usage
top | grep ollama     # Check CPU/memory usage
nvidia-smi           # Check GPU usage (if available)
```

---

## 📞 Getting Help

### Debug Information to Collect:
1. **Operating System**: Windows/Mac/Linux
2. **Browser & Version**: Chrome 120, Firefox 115, etc.
3. **AI Provider**: Ollama/OpenAI/Custom
4. **Error Messages**: From browser console
5. **Server Logs**: From terminal where you started the AI service

### Self-Diagnosis Commands:
```bash
# System info
uname -a                    # OS details
python3 --version          # Python version
node --version             # Node.js version (if using JS proxy)

# Network connectivity
ping 127.0.0.1            # Local connectivity
telnet 127.0.0.1 11434    # Port accessibility

# Service status
ps aux | grep ollama       # Check if Ollama is running
curl localhost:11434/api/version  # Ollama version check
```

---

## 🎯 Quick Fixes Summary

| Problem | Quick Fix |
|---------|-----------|
| CORS Error | Run `python3 cors_proxy.py`, use `http://localhost:8080` |
| Can't Connect | Check server is running, verify URL/port |
| Wrong Model | Run `ollama list` and use exact model name |
| Slow Response | Use smaller model like `gemma3:1b` |
| UI Broken | Hard refresh (Ctrl+F5), try different browser |
| API Key Error | Double-check key format and permissions |

**Still having issues?** Check the browser console (F12) for detailed error messages and refer to the specific error solutions above.

---

*Happy debugging! 🚀 The demo should work smoothly once your AI provider is properly configured.*