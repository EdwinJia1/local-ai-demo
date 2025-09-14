#!/usr/bin/env python3
"""
Simple CORS proxy for Ollama API
Allows browser to access local Ollama instance
"""

import http.server
import socketserver
import urllib.request
import urllib.parse
import json
import sys
from datetime import datetime

class CORSProxyHandler(http.server.BaseHTTPRequestHandler):
    
    def add_cors_headers(self):
        """Add CORS headers to response"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    
    def do_OPTIONS(self):
        """Handle preflight requests"""
        self.send_response(200)
        self.add_cors_headers()
        self.end_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        self.proxy_request()
    
    def do_POST(self):
        """Handle POST requests"""
        self.proxy_request()
    
    def proxy_request(self):
        """Proxy request to Ollama"""
        try:
            # Log request
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"[{timestamp}] {self.command} {self.path}")
            
            # Build target URL
            target_url = f"http://127.0.0.1:11434{self.path}"
            
            # Prepare request data
            if self.command == 'POST':
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
            else:
                post_data = None
            
            # Create request
            req = urllib.request.Request(target_url, data=post_data)
            
            # Copy relevant headers
            for header in ['Content-Type', 'Authorization']:
                if header in self.headers:
                    req.add_header(header, self.headers[header])
            
            # Make request to Ollama
            try:
                with urllib.request.urlopen(req, timeout=60) as response:
                    # Send response status
                    self.send_response(response.status)
                    
                    # Add CORS headers
                    self.add_cors_headers()
                    
                    # Copy response headers
                    for header, value in response.headers.items():
                        if header.lower() not in ['access-control-allow-origin', 'access-control-allow-methods', 'access-control-allow-headers']:
                            self.send_header(header, value)
                    
                    self.end_headers()
                    
                    # Copy response body
                    self.wfile.write(response.read())
                    
            except urllib.error.HTTPError as e:
                print(f"HTTP Error: {e.code} - {e.reason}")
                self.send_response(e.code)
                self.add_cors_headers()
                self.end_headers()
                self.wfile.write(str(e.reason).encode())
                
        except Exception as e:
            print(f"Proxy error: {str(e)}")
            self.send_response(500)
            self.add_cors_headers()
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(f"Proxy error: {str(e)}".encode())
    
    def log_message(self, format, *args):
        """Override to prevent duplicate logging"""
        pass

def main():
    PORT = 8080
    
    print("🔗 CORS Proxy for Ollama")
    print(f"🤖 Starting proxy on http://localhost:{PORT}")
    print("🌐 Proxying to Ollama at http://127.0.0.1:11434")
    print("")
    print("Configure your demo with:")
    print("  Base URL: http://localhost:8080")
    print("  Model: gemma3:1b")
    print("")
    print("Press Ctrl+C to stop")
    
    try:
        with socketserver.TCPServer(("", PORT), CORSProxyHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Proxy stopped")
        sys.exit(0)

if __name__ == "__main__":
    main()