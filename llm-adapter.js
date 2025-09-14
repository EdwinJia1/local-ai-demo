// LLM adapter with support for OpenAI-compatible, Ollama, and llama.cpp servers.
// Simple non-streaming calls with basic CORS/health checks. ESM module.

export const LLM = (() => {
  let cfg = {
    provider: 'openai',
    baseUrl: '',
    path: '', // used for generic
    model: '',
    apiKey: ''
  };

  function setConfig(next) {
    cfg = { ...cfg, ...next };
    localStorage.setItem('llmConfig', JSON.stringify(cfg));
  }

  function getConfig() {
    try { return JSON.parse(localStorage.getItem('llmConfig')) || cfg; }
    catch { return cfg; }
  }

  async function health(signal) {
    const c = getConfig();
    try {
      // Try a light GET to a provider-specific endpoint
      const url = c.baseUrl.replace(/\/$/, '') + (c.provider === 'ollama' ? '/api/tags' : '/v1/models');
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(c.apiKey ? { 'Authorization': `Bearer ${c.apiKey}` } : {})
      };
      const res = await fetch(url, { method: 'GET', signal, mode: 'cors', headers });
      return { ok: res.ok, status: res.status };
    } catch (e) {
      // Last-resort connectivity probe (may succeed despite CORS)
      try {
        const testUrl = c.baseUrl.replace(/\/$/, '') + '/api/tags';
        await fetch(testUrl, { method: 'GET', mode: 'no-cors' });
        return { ok: true, status: 200, note: 'Connection successful (no-cors mode)' };
      } catch (e2) {
        return { ok: false, error: e.message + ' | Proxy may be needed for CORS' };
      }
    }
  }

  function normalizeMessages(textOrMessages) {
    if (Array.isArray(textOrMessages)) return textOrMessages;
    return [{ role: 'user', content: String(textOrMessages || '') }];
  }

  function corsHint(errorMessage) {
    const hint = 'If this is a browser CORS issue, enable CORS on your server (Access-Control-Allow-Origin) or use a local proxy.';
    return `${errorMessage}\n\n${hint}`;
  }

  async function chat(textOrMessages, opts = {}) {
    const c = getConfig();
    const messages = normalizeMessages(textOrMessages);
    const temperature = opts.temperature ?? 0.3;
    const max_tokens = opts.max_tokens ?? 256;

    try {
      if (c.provider === 'openai' || c.provider === 'llama_cpp') {
        // OpenAI-compatible endpoint
        const url = c.baseUrl.replace(/\/$/, '') + '/v1/chat/completions';
        const res = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(c.apiKey ? { 'Authorization': `Bearer ${c.apiKey}` } : {})
          },
          body: JSON.stringify({ model: c.model || 'gpt-3.5-turbo', messages, temperature, max_tokens, stream: false })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content ?? '';
        return { text, raw: data };
      }

      if (c.provider === 'ollama') {
        // Ollama chat API
        const url = c.baseUrl.replace(/\/$/, '') + '/api/chat';
        const res = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ model: c.model || 'gemma3:1b', messages, stream: false, options: { temperature } })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const data = await res.json();
        const last = data.message?.content ?? (Array.isArray(data) ? data[data.length - 1]?.message?.content : '');
        return { text: last || '', raw: data };
      }

      // Generic JSON endpoint: expects {text: string} in response
      const url = c.baseUrl.replace(/\/$/, '') + (c.path || '/v1/chat/completions');
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(c.apiKey ? { 'Authorization': `Bearer ${c.apiKey}` } : {})
        },
        body: JSON.stringify({ model: c.model, messages, temperature, max_tokens })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const data = await res.json();
      const text = data.text || data.choices?.[0]?.message?.content || '';
      return { text, raw: data };
    } catch (e) {
      throw new Error(corsHint(e.message));
    }
  }

  return { setConfig, getConfig, health, chat };
})();
