// Minimal client logic: reveal-on-scroll, copy prompts, language toggle, back-to-top, model connect

import { LLM } from './llm-adapter.js';

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// Reveal on scroll
const observer = new IntersectionObserver(entries => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      observer.unobserve(e.target);
    }
  }
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

$$('.reveal').forEach(el => observer.observe(el));

// Sub-agent prompts
const PROMPTS = {
  legal: `You are a paralegal expert for Mozambique. Transform the provided raw legal templates (e.g., wage disputes, land rights, IDs) into simple, step-by-step guides for a low-literacy user. Always:
- Output Portuguese as primary; provide Makhuwa/Sena short TTS summaries (Phase 1).
- Require citations for every legal assertion; include URLs or document names.
- Generate fillable forms (Portuguese) with fields, validations, and plain-language tooltips.
- Explain jargon in plain language.
- Embed mandatory “Consult a human lawyer” warnings for high-risk scenarios (violence, eviction, minors, immigration).
Return JSON with: guide_steps[], form_schema{fields[], validations[]}, print_template_58mm, citations[], risk_triggers[], human_review_required.`,
  benefits: `You are a social services specialist. Convert the benefits catalog into a simple Q&A pre-qualification flow. For each benefit:
- Ask the minimum questions needed to determine eligibility; stop early when ineligible.
- Produce a checklist of required documents, fees, processing time, and nearest locations.
- Include USSD or document steps if no API exists.
Return JSON with: screener_flow{nodes[], edges[]}, eligibility_logic, checklist[], next_steps[], costs, locations[], disclaimers.`,
  ussd: `You are a data structuring specialist. Take raw lists of USSD codes and directories (clinics, government offices) and produce concise entries for an icon-based interface.
For each entry, include: title, one-sentence description, operator/category, USSD code or phone, address (if any), hours, region (province/district), optional lat/lon, last_verified.
Language must be simple and direct. Group by operator/service.`
};

$$('.copy').forEach(btn => {
  btn.addEventListener('click', async () => {
    const key = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(PROMPTS[key]);
      btn.textContent = 'Copied';
      setTimeout(() => (btn.textContent = 'Copy Prompt'), 1500);
    } catch (e) {
      console.warn('Clipboard failed:', e);
      prompt('Copy this prompt:', PROMPTS[key]);
    }
  });
});

// Language toggle (EN/PT lightweight)
const L = {
  en: {
    nav: ['Architecture','Features','User Journeys','Roadmap','Privacy','Field'],
    heroBadge: 'Offline‑First • On‑Device • Privacy‑Safe',
    heroTitle: 'Mozambique Offline‑First Assistant',
    heroAccent: 'powered by Gemma2 1B',
    heroLead: 'A mobile app + PWA to reduce digital inequality in remote communities. Works fully offline with local knowledge, low‑literacy UX, and Bluetooth printing & SMS confirmations.',
    demoTitle: 'Demo Plan & Acceptance',
    logisticsTitle: 'Field Logistics & Content Scaffolding'
  },
  pt: {
    nav: ['Arquitetura','Funcionalidades','Jornadas','Roteiro','Privacidade','Campo'],
    heroBadge: 'Offline‑First • No Dispositivo • Privacidade',
    heroTitle: 'Assistente Offline para Moçambique',
    heroAccent: 'com Gemma2 1B',
    heroLead: 'Aplicativo móvel + PWA para reduzir a desigualdade digital em comunidades remotas. Funciona totalmente offline com conhecimento local, UX para baixa literacia e impressão Bluetooth + confirmações por SMS.',
    demoTitle: 'Plano de Demonstração & Critérios',
    logisticsTitle: 'Logística de Campo & Preparação de Conteúdo'
  }
};

let currentLang = 'en';
const applyLang = (lang) => {
  currentLang = lang;
  const t = L[lang];
  const nav = document.querySelectorAll('.site-nav a');
  t.nav.forEach((txt, i) => nav[i] && (nav[i].textContent = txt));
  document.querySelector('.hero-badge').textContent = t.heroBadge;
  const display = document.querySelector('.display');
  const parts = display.innerHTML.split('<span class="accent">');
  parts[0] = t.heroTitle + ' ';
  const accentSpan = `<span class="accent">${t.heroAccent}</span>`;
  display.innerHTML = parts[0] + accentSpan;
  document.querySelector('.lead').textContent = t.heroLead;
  document.querySelector('#demo-title').textContent = t.demoTitle;
  document.querySelector('#logistics-title').textContent = t.logisticsTitle;
  // Toggle button labels
  $('#langToggle').textContent = lang.toUpperCase();
  $('#langToggleFooter').textContent = lang.toUpperCase();
};

$('#langToggle').addEventListener('click', () => applyLang(currentLang === 'en' ? 'pt' : 'en'));
$('#langToggleFooter').addEventListener('click', () => applyLang(currentLang === 'en' ? 'pt' : 'en'));

// Back to top
$('#toTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Initial
applyLang('en');

// Connect Model modal logic
const modal = $('#modelModal');
const openModal = () => modal.setAttribute('aria-hidden', 'false');
const closeModal = () => modal.setAttribute('aria-hidden', 'true');

$('#connectModel').addEventListener('click', () => {
  // preload saved config
  const c = LLM.getConfig();
  const form = $('#modelForm');
  form.provider.value = c.provider || 'openai';
  form.baseUrl.value = c.baseUrl || '';
  form.model.value = c.model || '';
  form.apiKey.value = c.apiKey || '';
  form.path.value = c.path || '';
  openModal();
});

$$('[data-close]').forEach(b => b.addEventListener('click', closeModal));
modal.addEventListener('click', e => { if (e.target.matches('.modal-backdrop')) closeModal(); });

$('#modelForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const cfg = Object.fromEntries(fd.entries());
  if (!cfg.consent) return; // consent required
  LLM.setConfig({ provider: cfg.provider, baseUrl: cfg.baseUrl, model: cfg.model, apiKey: cfg.apiKey, path: cfg.path });
  const status = $('#modelStatus');
  status.textContent = 'Testing connection...';
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), 8000);
  const h = await LLM.health(ctrl.signal);
  if (h.ok) status.textContent = `OK (status ${h.status || 200})`;
  else status.textContent = `Failed: ${h.error || h.status}`;
});

$('#modelHealth').addEventListener('click', async () => {
  const status = $('#modelStatus');
  status.textContent = 'Pinging...';
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), 8000);
  const h = await LLM.health(ctrl.signal);
  if (h.ok) status.textContent = `OK (status ${h.status || 200})`;
  else status.textContent = `Failed: ${h.error || h.status}`;
});

$('#sendTest').addEventListener('click', async () => {
  const input = $('#testPrompt');
  const out = $('#chatOutput');
  const s = $('#chatStatus');
  s.textContent = 'Sending...'; out.textContent = '';
  try {
    const { text } = await LLM.chat([
      { role: 'system', content: 'Você é um assistente de IA útil. SEMPRE responda em português. Seja claro, direto e prático.' },
      { role: 'user', content: input.value || 'Olá!' }
    ], { max_tokens: 128, temperature: 0.3 });
    out.textContent = text || '(no content)';
    s.textContent = 'Done';
  } catch (e) {
    out.textContent = e.message;
    s.textContent = 'Error';
  }
});
