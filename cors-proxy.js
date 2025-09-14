#!/usr/bin/env node

/**
 * Simple CORS proxy for Ollama API
 * Allows browser to access local Ollama instance
 */

const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server
const proxy = httpProxy.createProxyServer({});

// Handle CORS
function addCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
}

const server = http.createServer((req, res) => {
    // Add CORS headers
    addCorsHeaders(res);
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    
    // Proxy to Ollama
    proxy.web(req, res, {
        target: 'http://127.0.0.1:11434',
        changeOrigin: true
    });
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('Proxy error: ' + err.message);
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`🔗 CORS Proxy running on http://localhost:${PORT}`);
    console.log(`🤖 Proxying to Ollama at http://127.0.0.1:11434`);
    console.log('');
    console.log('Configure your demo with:');
    console.log('  Base URL: http://localhost:8080');
    console.log('  Model: gemma3:1b');
    console.log('');
});