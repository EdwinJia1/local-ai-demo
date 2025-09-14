# 🚀 Getting Started - Choose Your Path

## 📋 What's in this package?
- **Professional AI chat interface** with dark theme design
- **Multi-provider support**: Ollama, OpenAI, Claude, custom APIs
- **One-click setup** for all major operating systems
- **Automatic diagnostics** to solve common issues
- **Comprehensive guides** for troubleshooting

---

## 🎯 Quick Start Options

### 👶 Beginner (I just want it to work!)
1. **Run the one-click setup:**
   - **macOS/Linux**: Double-click `setup.sh`
   - **Windows**: Double-click `setup.bat`

2. **Wait for setup to complete** (installs Ollama, downloads model)

3. **Open the demo** at http://localhost:3000

**That's it!** ✨

---

### 🔧 Developer (I want to understand/customize)
1. **Read the docs**:
   - [README.md](README.md) - Full project overview
   - [QUICK-START-GUIDE.md](QUICK-START-GUIDE.md) - Detailed setup & debugging

2. **Manual setup**:
   ```bash
   ./start-ollama-cors.sh      # Start Ollama with CORS
   python3 -m http.server 3000 # Start web server
   ```

3. **Configure your AI provider** in the web interface

4. **Customize** the UI, prompts, or add new providers

---

### 🆘 Having Issues?
1. **Run diagnostics**: `python3 check-setup.py`
2. **Check the guides**: [QUICK-START-GUIDE.md](QUICK-START-GUIDE.md)
3. **Look at browser console** (F12) for error messages

---

## 🎭 For Presentations/Demos
1. **Follow beginner setup** first
2. **Read**: [demo-instructions.md](demo-instructions.md)
3. **Key points to highlight**:
   - ✅ Runs completely offline/local
   - ✅ Professional UI with real-time chat
   - ✅ Privacy-focused (data stays on device)
   - ✅ Works with multiple AI providers
   - ✅ Easy to deploy and scale

---

## 📊 System Requirements
- **OS**: Windows 10+, macOS 10.15+, Linux (Ubuntu 18.04+)
- **RAM**: 4GB minimum (8GB+ recommended for larger models)
- **Storage**: 2-10GB depending on AI model size
- **Internet**: Only needed for initial setup and model downloads

---

## ⚡ Performance Tips
- **Use smaller models** for faster responses (gemma3:1b, phi3.5:3.8b)
- **Enable GPU acceleration** if available
- **Close other apps** when running large models
- **Use SSD storage** for better model loading times

---

## 🔐 Privacy & Security
- **All data stays local** - no external API calls by default
- **No tracking or telemetry**
- **Open source** - you can review all code
- **Customizable** - modify prompts and behavior as needed

---

## 🤝 Support & Community
This is a demo project designed to showcase local AI capabilities. 

**For issues:**
1. Check the built-in diagnostics
2. Review the troubleshooting guides
3. Inspect browser developer console for errors

**For customization:**
- All files are well-commented
- Standard web technologies (HTML, CSS, JavaScript)
- Easy to modify and extend

---

**Ready to start?** Pick your path above and dive in! 🏊‍♂️