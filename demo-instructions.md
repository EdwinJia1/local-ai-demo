# Local AI Demo - 演示说明 / Demo Instructions

## 中文说明 / Chinese Instructions

### 项目简介
这是一个本地AI演示项目，支持与本地AI模型进行交互的Web界面。具有专业的深色主题设计，支持多种LLM提供商。

### 快速开始
1. **启动Ollama服务**：
   ```bash
   ./start-ollama-cors.sh
   ```

2. **打开演示页面**：
   - 直接打开 `index.html` 文件
   - 或运行本地服务器：`python3 -m http.server 3000`

3. **配置模型**：
   - 点击页面顶部的 "Connect Model" 按钮
   - 选择提供商：Ollama
   - 基础URL：`http://127.0.0.1:11434`
   - 模型：`gemma3:1b`
   - 点击 "Test" 测试连接
   - 点击 "Save" 保存配置

4. **开始聊天**：
   - 在聊天框中输入消息
   - 按回车键或点击发送按钮

### 故障排除
- **CORS错误**：运行 `python3 cors_proxy.py` 启动代理服务器
- **连接失败**：确保Ollama服务正在运行并且端口正确
- **无响应**：检查模型名称是否正确

---

## English Instructions

### Project Overview
This is a local AI demo project featuring a web interface for interacting with local AI models. It includes a professional dark theme design and supports multiple LLM providers.

### Quick Start
1. **Start Ollama Service**:
   ```bash
   ./start-ollama-cors.sh
   ```

2. **Open Demo Page**:
   - Open `index.html` file directly
   - Or run local server: `python3 -m http.server 3000`

3. **Configure Model**:
   - Click "Connect Model" button at the top of the page
   - Select Provider: Ollama
   - Base URL: `http://127.0.0.1:11434`
   - Model: `gemma3:1b`
   - Click "Test" to test connection
   - Click "Save" to save configuration

4. **Start Chatting**:
   - Type message in chat box
   - Press Enter or click Send button

### Troubleshooting
- **CORS Error**: Run `python3 cors_proxy.py` to start proxy server
- **Connection Failed**: Ensure Ollama service is running and port is correct
- **No Response**: Check if model name is correct

### Features
- 🎨 Professional dark theme UI
- 🔄 Real-time chat interface
- 🌐 Multi-provider support (Ollama, OpenAI, llama.cpp)
- 📱 Responsive design
- 🔧 Easy configuration
- 🚀 Quick prompts for common scenarios

### Presentation Tips
1. **Demo Flow**:
   - Show the sophisticated UI design
   - Demonstrate model configuration process
   - Test real-time chat functionality
   - Highlight offline capabilities
   - Show multi-language support

2. **Key Points to Emphasize**:
   - Local deployment (no internet required)
   - Privacy-focused (data stays local)
   - Professional interface design
   - Easy setup and configuration
   - Cross-platform compatibility

3. **Technical Highlights**:
   - CORS handling for browser compatibility
   - Support for multiple AI providers
   - Responsive web design
   - Real-time typing indicators
   - Smooth scrolling chat interface