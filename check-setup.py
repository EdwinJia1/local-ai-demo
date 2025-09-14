#!/usr/bin/env python3
"""
Local AI Demo - Setup Checker
Automatically diagnoses common setup issues
"""

import requests
import subprocess
import sys
import json
import platform
import socket
from urllib.parse import urlparse

def print_header(text):
    print(f"\n{'='*50}")
    print(f"🔍 {text}")
    print(f"{'='*50}")

def print_success(text):
    print(f"✅ {text}")

def print_error(text):
    print(f"❌ {text}")

def print_warning(text):
    print(f"⚠️  {text}")

def print_info(text):
    print(f"ℹ️  {text}")

def check_system_info():
    print_header("System Information")
    print_info(f"Operating System: {platform.system()} {platform.release()}")
    print_info(f"Python Version: {sys.version}")
    
    # Check if required tools are available
    try:
        result = subprocess.run(['curl', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print_success("curl is available")
        else:
            print_error("curl not found - needed for API testing")
    except FileNotFoundError:
        print_error("curl not found - please install curl")

def check_port(host, port, service_name):
    """Check if a port is open"""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(3)
            result = s.connect_ex((host, port))
            if result == 0:
                print_success(f"{service_name} port {port} is open")
                return True
            else:
                print_error(f"{service_name} port {port} is closed")
                return False
    except Exception as e:
        print_error(f"Cannot check {service_name} port {port}: {e}")
        return False

def check_ollama():
    print_header("Ollama Check")
    
    # Check if Ollama port is open
    if not check_port('127.0.0.1', 11434, 'Ollama'):
        print_warning("Ollama doesn't seem to be running")
        print_info("To start Ollama: ./start-ollama-cors.sh")
        return False
    
    # Test Ollama API
    try:
        response = requests.get('http://127.0.0.1:11434/api/tags', timeout=5)
        if response.status_code == 200:
            data = response.json()
            models = data.get('models', [])
            print_success(f"Ollama API is working")
            print_info(f"Available models: {len(models)}")
            for model in models[:3]:  # Show first 3 models
                print_info(f"  - {model.get('name', 'Unknown')}")
            if len(models) > 3:
                print_info(f"  ... and {len(models) - 3} more")
            return True
        else:
            print_error(f"Ollama API returned status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_error(f"Cannot connect to Ollama API: {e}")
        return False

def check_cors():
    print_header("CORS Check")
    
    # Test CORS headers from Ollama
    try:
        response = requests.get('http://127.0.0.1:11434/api/tags', timeout=5)
        cors_header = response.headers.get('Access-Control-Allow-Origin')
        if cors_header:
            print_success(f"CORS headers present: {cors_header}")
        else:
            print_warning("No CORS headers detected")
            print_info("Run: ./start-ollama-cors.sh to enable CORS")
    except requests.exceptions.RequestException:
        print_warning("Cannot test CORS - Ollama not accessible")

def test_chat_api(base_url="http://127.0.0.1:11434", model="gemma3:1b"):
    print_header("Chat API Test")
    
    # Test chat endpoint
    chat_url = f"{base_url}/api/chat"
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": "Hello, can you respond?"}],
        "stream": False,
        "options": {"temperature": 0.1}
    }
    
    try:
        print_info(f"Testing chat API: {chat_url}")
        print_info(f"Using model: {model}")
        
        response = requests.post(chat_url, json=payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            message_content = data.get('message', {}).get('content', '')
            if message_content:
                print_success("Chat API is working!")
                print_info(f"Test response: {message_content[:100]}...")
                return True
            else:
                print_error("Chat API responded but no message content")
                return False
        else:
            print_error(f"Chat API returned status {response.status_code}")
            if response.text:
                print_info(f"Error details: {response.text[:200]}")
            return False
            
    except requests.exceptions.Timeout:
        print_error("Chat API request timed out (>30s)")
        print_info("Try using a smaller/faster model")
        return False
    except requests.exceptions.RequestException as e:
        print_error(f"Chat API request failed: {e}")
        return False

def check_proxy_ports():
    print_header("Proxy Ports Check")
    
    # Check common proxy ports
    if check_port('127.0.0.1', 8080, 'CORS Proxy'):
        print_info("CORS proxy seems to be running")
        print_info("You can use http://localhost:8080 as base URL")
    else:
        print_info("CORS proxy not detected")
        print_info("To start proxy: python3 cors_proxy.py")

def check_browser_files():
    print_header("Demo Files Check")
    
    import os
    files_to_check = [
        'index.html',
        'web/llm-adapter.js',
        'start-ollama-cors.sh'
    ]
    
    all_present = True
    for file in files_to_check:
        if os.path.exists(file):
            print_success(f"Found: {file}")
        else:
            print_error(f"Missing: {file}")
            all_present = False
    
    if all_present:
        print_success("All demo files are present")
    else:
        print_error("Some demo files are missing")

def provide_recommendations():
    print_header("Recommendations")
    
    print_info("🚀 To start using the demo:")
    print("   1. Ensure Ollama is running: ./start-ollama-cors.sh")
    print("   2. Open demo: python3 -m http.server 3000")
    print("   3. Visit: http://localhost:3000")
    print("   4. Configure with: Ollama, http://127.0.0.1:11434, gemma3:1b")
    
    print_info("🔧 If you have issues:")
    print("   - Check browser console (F12) for errors")
    print("   - Try CORS proxy: python3 cors_proxy.py")
    print("   - Use smaller model: gemma3:1b instead of larger ones")
    print("   - Restart Ollama with CORS enabled")

def main():
    print("🤖 Local AI Demo - Setup Checker")
    print("This script will check your setup and diagnose common issues")
    
    # Run all checks
    check_system_info()
    check_browser_files()
    ollama_working = check_ollama()
    check_cors()
    check_proxy_ports()
    
    if ollama_working:
        # Test with default model
        test_chat_api()
    
    provide_recommendations()
    
    print_header("Setup Check Complete")
    print("If you're still having issues, check QUICK-START-GUIDE.md")

if __name__ == "__main__":
    main()