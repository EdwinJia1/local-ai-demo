# Local AI Demo

A sophisticated web-based interface for interacting with local AI models, featuring dark theme design and support for multiple LLM providers.

## 📋 Overview

This project provides a professional-grade web interface for local AI deployment testing. It features a modern, dark-themed UI with support for Ollama, OpenAI-compatible APIs, and llama.cpp servers. Perfect for demonstrating local AI capabilities in offline environments.

## 🚀 Features

- **Multi-Provider Support**: Ollama, OpenAI-compatible APIs, llama.cpp
- **Dark Theme UI**: Professional design with gradients and animations
- **Real-time Chat**: Interactive chat interface with typing indicators
- **CORS Handling**: Built-in CORS proxy solutions for browser compatibility
- **Multi-language**: Support for English and Portuguese
- **Responsive Design**: Works on desktop and mobile devices
- **Quick Setup**: Easy configuration with test connectivity

## 📁 Project Structure

```
local-ai-demo-package/
├── index.html              # Main demo website
├── web/
│   └── llm-adapter.js      # LLM provider adapter
├── setup.sh               # One-click setup (macOS/Linux)
├── setup.bat              # One-click setup (Windows)
├── check-setup.py         # Automatic diagnostics tool
├── start-ollama-cors.sh   # Ollama with CORS setup script
├── cors_proxy.py          # Python CORS proxy server
├── cors-proxy.js          # Node.js CORS proxy server
├── QUICK-START-GUIDE.md   # Detailed debugging guide
├── demo-instructions.md   # Presentation guide
├── package.json           # Project metadata
└── README.md             # This file
```

## 🛠️ Quick Start

### Option 1: One-Click Setup (Recommended)

**For macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**For Windows:**
```cmd
setup.bat
```

This will automatically install Ollama, download a model, and start the demo!

### Option 2: Manual Setup

1. **Install Ollama** (if not already installed):
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Pull a model** (e.g., Gemma 1B):
   ```bash
   ollama pull gemma3:1b
   ```

3. **Start Ollama with CORS enabled**:
   ```bash
   chmod +x start-ollama-cors.sh
   ./start-ollama-cors.sh
   ```

4. **Open the demo**:
   - Open `index.html` in your browser
   - Or serve with a local server: `python3 -m http.server 3000`

### Option 2: Using CORS Proxy

If you encounter CORS issues, use one of the proxy servers:

**Python Proxy:**
```bash
python3 cors_proxy.py
```

**Node.js Proxy:**
```bash
npm install http-proxy
node cors-proxy.js
```

Then configure the demo to use `http://localhost:8080` as the base URL.

## ⚙️ Configuration

1. **Open the demo** in your browser
2. **Click "Connect Model"** button in the top navigation
3. **Configure your provider**:
   - **Provider**: Select Ollama, OpenAI, or llama.cpp
   - **Base URL**: Enter your server URL (e.g., `http://127.0.0.1:11434` for Ollama)
   - **Model**: Specify model name (e.g., `gemma3:1b`)
   - **API Key**: Optional, for OpenAI-compatible APIs

4. **Test Connection**: Click "Test" to verify connectivity
5. **Save & Start Chatting**: Click "Save" and start using the chat interface

## 📝 Usage Examples

### Basic Chat
1. Connect to your local model
2. Type a message in the chat input
3. Press Enter or click Send
4. View AI responses in real-time

### Quick Prompts
Use the built-in quick prompt buttons for common scenarios:
- Social Assistance
- Legal Guidance
- Mobile Money
- General Questions

## 🔧 Troubleshooting

### Quick Diagnosis
Run the automatic setup checker:
```bash
python3 check-setup.py
```

This will automatically diagnose common issues and provide solutions.

### Detailed Help
For step-by-step debugging, see: **[QUICK-START-GUIDE.md](QUICK-START-GUIDE.md)**

### Common Issues

#### CORS Errors
- **Solution 1**: Use the `start-ollama-cors.sh` script to start Ollama with CORS enabled
- **Solution 2**: Run one of the CORS proxy servers and configure the demo to use localhost:8080

#### Connection Failed
- Verify your AI server is running and accessible
- Check the correct port and URL in configuration
- Ensure firewall allows connections on the specified port

#### Model Not Responding
- Verify the model name matches exactly what's available in your server
- Check server logs for errors
- Try a different model if available

## 🎨 Customization

### Changing Theme
Edit the CSS variables in `index.html`:
```css
:root {
    --bg-primary: #0a0a0b;      /* Background color */
    --accent-purple: #8b5cf6;    /* Primary accent */
    --accent-blue: #3b82f6;      /* Secondary accent */
    --text-primary: #ffffff;     /* Text color */
}
```

### Adding New Providers
Extend the LLM adapter in `web/llm-adapter.js` to support additional API formats.

### Custom Prompts
Modify the quick prompt buttons in `index.html` to add your own scenarios.

## 🌐 Deployment

### Local Network Access
1. Find your machine's IP address: `ifconfig` or `ipconfig`
2. Start a local server: `python3 -m http.server 3000`
3. Access from other devices: `http://YOUR_IP:3000`

### Production Deployment
- Upload files to any web server
- Configure HTTPS if needed
- Update CORS settings for your domain

## 📚 Technical Details

### Supported AI Providers
- **Ollama**: Local LLM server with built-in model management
- **llama.cpp**: Direct API access to llama.cpp HTTP server
- **OpenAI-compatible**: Any API following OpenAI's format

### Browser Compatibility
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

### Performance Tips
- Use smaller models (1B-7B parameters) for faster responses
- Enable GPU acceleration in your AI server
- Use local hosting to reduce latency

## 📄 License

MIT License - Feel free to modify and distribute.

## 🤝 Contributing

This is a demo project. Feel free to fork and customize for your needs.

## 🐛 Known Issues

- Some browser security policies may block local API calls
- Large models may take time to load responses
- Mobile keyboards may cover chat input on some devices

## 💡 Tips

- Test with small models first (gemma3:1b, llama3.2:1b)
- Use the browser's developer console to debug connection issues
- Keep your AI server updated for best performance
- Consider using quantized models for faster inference

---

**Need help?** Check the troubleshooting section or review server logs for detailed error information.