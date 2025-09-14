#!/bin/bash
# Local AI Demo - One-Click Setup Script
# Works on macOS and Linux

echo "🤖 Local AI Demo - One-Click Setup"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

success() { echo -e "${GREEN}✅ $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# Check if running on supported OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
else
    error "Unsupported OS: $OSTYPE"
    echo "This script works on macOS and Linux only."
    echo "For Windows, please install Ollama manually and use the demo."
    exit 1
fi

info "Detected OS: $OS"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo ""
info "Checking prerequisites..."

if command_exists python3; then
    success "Python3 is available"
else
    error "Python3 not found. Please install Python 3.x"
    exit 1
fi

if command_exists curl; then
    success "curl is available"
else
    error "curl not found. Please install curl"
    exit 1
fi

# Install Ollama if not present
echo ""
info "Checking Ollama installation..."

if command_exists ollama; then
    success "Ollama is already installed"
    OLLAMA_VERSION=$(ollama --version 2>/dev/null | head -1)
    info "Version: $OLLAMA_VERSION"
else
    warning "Ollama not found. Installing..."
    
    if [[ "$OS" == "macos" ]]; then
        info "Installing Ollama for macOS..."
        curl -fsSL https://ollama.ai/install.sh | sh
    else
        info "Installing Ollama for Linux..."
        curl -fsSL https://ollama.ai/install.sh | sh
    fi
    
    if command_exists ollama; then
        success "Ollama installed successfully"
    else
        error "Failed to install Ollama"
        exit 1
    fi
fi

# Pull a small model for testing
echo ""
info "Downloading AI model (this may take a few minutes)..."

if ollama list | grep -q "gemma3:1b"; then
    success "gemma3:1b model already available"
else
    info "Downloading gemma3:1b model (1GB)..."
    ollama pull gemma3:1b
    if [ $? -eq 0 ]; then
        success "Model downloaded successfully"
    else
        error "Failed to download model"
        warning "You can try manually: ollama pull gemma3:1b"
    fi
fi

# Start Ollama with CORS
echo ""
info "Starting Ollama with CORS enabled..."

# Kill any existing Ollama processes
pkill -f ollama
sleep 2

# Export CORS environment variables
export OLLAMA_ORIGINS="*"
export OLLAMA_HOST="0.0.0.0:11434"

# Start Ollama in background
nohup ollama serve > ollama.log 2>&1 &

# Wait for startup
info "Waiting for Ollama to start..."
sleep 5

# Test connection
if curl -s http://127.0.0.1:11434/api/tags > /dev/null; then
    success "Ollama started successfully with CORS enabled!"
else
    error "Failed to start Ollama"
    warning "Check ollama.log for details"
fi

# Run setup checker
echo ""
info "Running setup diagnostics..."
if [ -f "check-setup.py" ]; then
    python3 check-setup.py
else
    warning "Setup checker not found, skipping diagnostics"
fi

# Start demo server
echo ""
info "Starting demo server..."

# Check if port 3000 is available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    warning "Port 3000 is already in use"
    info "You can manually start the demo with: python3 -m http.server 3001"
else
    info "Starting HTTP server on port 3000..."
    echo ""
    success "🎉 Setup Complete!"
    echo ""
    info "Demo URL: http://localhost:3000"
    info "Configuration:"
    echo "  Provider: Ollama"
    echo "  Base URL: http://127.0.0.1:11434"
    echo "  Model: gemma3:1b"
    echo ""
    info "Press Ctrl+C to stop the server"
    
    # Start the server
    python3 -m http.server 3000
fi