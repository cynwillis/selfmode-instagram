// SelfMode Research — Instagram Transcription PWA
// selfmode-instagram.spectrumkore96.workers.dev

const IG_APP_ID = '936619743392459';
const DOC_ID_DEFAULT = '8845758582119845';

// ─── Icon: SelfMode × Instagram blend ───────────────────────────────────────
const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f09433"/>
      <stop offset="25%" stop-color="#e6683c"/>
      <stop offset="50%" stop-color="#dc2743"/>
      <stop offset="75%" stop-color="#cc2366"/>
      <stop offset="100%" stop-color="#bc1888"/>
    </linearGradient>
    <linearGradient id="ig2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f09433"/>
      <stop offset="50%" stop-color="#dc2743"/>
      <stop offset="100%" stop-color="#bc1888"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="114" fill="#0a0a0f"/>
  <rect x="18" y="18" width="476" height="476" rx="100" fill="none" stroke="url(#ig)" stroke-width="18"/>
  <rect x="104" y="220" width="304" height="72" rx="36" fill="none" stroke="#0d9488" stroke-width="18"/>
  <circle cx="192" cy="256" r="22" fill="#0d9488"/>
  <circle cx="352" cy="148" r="14" fill="url(#ig2)"/>
</svg>`;

// ─── PWA Manifest ────────────────────────────────────────────────────────────
const MANIFEST = JSON.stringify({
  name: 'SelfMode Research — Instagram',
  short_name: 'IG Transcribe',
  description: 'Transcribe any Instagram Reel or video for AI ingestion',
  start_url: '/',
  display: 'standalone',
  background_color: '#0a0a0f',
  theme_color: '#0a0a0f',
  orientation: 'portrait-primary',
  icons: [
    { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
  ]
});

// ─── Service Worker ──────────────────────────────────────────────────────────
const SW_JS = `
const CACHE = 'selfmode-ig-v1';
const PRECACHE = ['/', '/manifest.json', '/icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});
self.addEventListener('fetch', e => {
  if (e.request.url.includes('/transcribe')) return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
`;

// ─── HTML ────────────────────────────────────────────────────────────────────
const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="IG Transcribe">
<title>SelfMode Research — Instagram</title>
<link rel="manifest" href="/manifest.json">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://api.fontshare.com">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=geist-mono@400&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --dark: #0a0a0f;
    --teal: #0d9488;
    --teal-dim: rgba(13,148,136,0.12);
    --teal-glow: rgba(13,148,136,0.25);
    --surface: rgba(255,255,255,0.03);
    --border: rgba(255,255,255,0.07);
    --text: #fafafa;
    --muted: rgba(250,250,250,0.45);
    --ig-start: #f09433;
    --ig-mid: #dc2743;
    --ig-end: #bc1888;
  }

  body {
    background: var(--dark);
    color: var(--text);
    font-family: 'Satoshi', system-ui, sans-serif;
    min-height: 100dvh;
    -webkit-font-smoothing: antialiased;
    overscroll-behavior: none;
  }

  /* ── Layout ── */
  .app { display: flex; flex-direction: column; min-height: 100dvh; }

  /* ── Header ── */
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 24px 0;
    position: relative;
    overflow: hidden;
  }
  header::before {
    content: '';
    position: absolute;
    top: -80px; left: -40px;
    width: 400px; height: 300px;
    background: radial-gradient(ellipse, rgba(13,148,136,0.06), transparent 70%);
    pointer-events: none;
  }
  .brand { display: flex; align-items: center; gap: 10px; position: relative; }
  .logo-mark {
    width: 28px; height: 28px;
    border: 2px solid var(--teal);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
  }
  .logo-toggle { width: 10px; height: 6px; background: var(--teal); border-radius: 3px; }
  .logo-text {
    font-family: 'Instrument Serif', serif;
    font-size: 20px;
    color: var(--text);
    letter-spacing: -0.3px;
  }
  .research-badge {
    font-family: 'Geist Mono', monospace;
    font-size: 9px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--teal);
    padding: 4px 10px;
    border: 1px solid rgba(13,148,136,0.2);
    border-radius: 3px;
    margin-left: 4px;
  }
  .ig-badge {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    background: linear-gradient(135deg, var(--ig-start), var(--ig-mid), var(--ig-end));
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ig-badge svg { width: 18px; height: 18px; }

  /* ── Hero ── */
  .hero {
    padding: 40px 24px 32px;
  }
  .hero h1 {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(32px, 8vw, 44px);
    font-weight: 400;
    line-height: 1.1;
    margin-bottom: 10px;
  }
  .hero h1 em {
    font-style: italic;
    background: linear-gradient(90deg, var(--ig-start), var(--ig-mid), var(--ig-end));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hero p {
    font-size: 15px;
    color: var(--muted);
    line-height: 1.5;
    max-width: 320px;
  }

  /* ── Tabs ── */
  .tabs {
    display: flex;
    gap: 4px;
    padding: 0 24px;
    margin-bottom: 24px;
  }
  .tab {
    flex: 1;
    padding: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--muted);
    font-size: 13px;
    font-weight: 500;
    font-family: 'Satoshi', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    position: relative;
  }
  .tab.active {
    background: var(--teal-dim);
    border-color: var(--teal);
    color: var(--teal);
  }
  .tab-count {
    position: absolute;
    top: -6px;
    right: -6px;
    background: var(--teal);
    color: #0a0a0f;
    font-size: 10px;
    font-weight: 700;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ── Tab panels ── */
  .panel { display: none; padding: 0 24px; }
  .panel.active { display: block; }

  /* ── Input card ── */
  .input-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 16px;
    transition: border-color 0.2s;
  }
  .input-card:focus-within {
    border-color: rgba(220,39,67,0.4);
    box-shadow: 0 0 0 3px rgba(220,39,67,0.08);
  }
  .input-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 10px;
    display: block;
  }
  .url-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .url-input {
    flex: 1;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 14px;
    color: var(--text);
    font-family: 'Satoshi', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .url-input::placeholder { color: var(--muted); }
  .url-input:focus { border-color: rgba(220,39,67,0.5); }

  .btn-transcribe {
    background: linear-gradient(135deg, #e6683c, #dc2743, #cc2366);
    border: none;
    border-radius: 10px;
    padding: 12px 18px;
    color: #fff;
    font-family: 'Satoshi', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity 0.2s, transform 0.1s;
    -webkit-tap-highlight-color: transparent;
  }
  .btn-transcribe:active { transform: scale(0.97); opacity: 0.9; }
  .btn-transcribe:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  /* ── Format toggle ── */
  .format-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
  }
  .format-label { font-size: 13px; color: var(--muted); }
  .toggle {
    width: 40px;
    height: 22px;
    background: var(--border);
    border-radius: 11px;
    position: relative;
    cursor: pointer;
    transition: background 0.2s;
    border: none;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }
  .toggle.on { background: var(--teal); }
  .toggle::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    background: #fff;
    border-radius: 50%;
    top: 3px;
    left: 3px;
    transition: transform 0.2s;
  }
  .toggle.on::after { transform: translateX(18px); }

  /* ── Status ── */
  .status {
    display: none;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px;
    margin-bottom: 16px;
  }
  .status.show { display: block; }
  .status-steps {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;
  }
  .step {
    flex: 1;
    padding: 8px 6px;
    border-radius: 8px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    text-align: center;
    font-size: 11px;
    color: var(--muted);
    font-weight: 500;
    transition: all 0.3s;
  }
  .step.active {
    background: var(--teal-dim);
    border-color: var(--teal);
    color: var(--teal);
  }
  .step.done {
    background: rgba(13,148,136,0.06);
    border-color: rgba(13,148,136,0.2);
    color: rgba(13,148,136,0.6);
  }
  .status-text { font-size: 13px; color: var(--muted); display: flex; align-items: center; gap: 8px; }
  .spinner {
    width: 14px; height: 14px;
    border: 2px solid var(--border);
    border-top-color: var(--teal);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Result card ── */
  .result {
    display: none;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 16px;
  }
  .result.show { display: block; }
  .result-meta {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .result-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--ig-start), var(--ig-mid), var(--ig-end));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }
  .result-info { flex: 1; min-width: 0; }
  .result-username { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
  .result-caption {
    font-size: 12px;
    color: var(--muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .result-duration {
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    background: rgba(255,255,255,0.05);
    padding: 4px 8px;
    border-radius: 6px;
    flex-shrink: 0;
  }

  .result-transcript {
    padding: 20px;
  }
  .transcript-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
  }
  .transcript-text {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    line-height: 1.7;
    color: var(--text);
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 280px;
    overflow-y: auto;
    padding-right: 4px;
  }
  .transcript-text::-webkit-scrollbar { width: 4px; }
  .transcript-text::-webkit-scrollbar-track { background: transparent; }
  .transcript-text::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .result-actions {
    padding: 14px 20px;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .btn-action {
    flex: 1;
    min-width: 80px;
    padding: 10px 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 9px;
    color: var(--text);
    font-family: 'Satoshi', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
    transition: all 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .btn-action:active { background: rgba(255,255,255,0.08); transform: scale(0.97); }
  .btn-action.teal { background: var(--teal-dim); border-color: var(--teal); color: var(--teal); }
  .btn-action.teal:active { background: rgba(13,148,136,0.2); }

  /* ── Error ── */
  .error-card {
    display: none;
    background: rgba(220,39,67,0.08);
    border: 1px solid rgba(220,39,67,0.2);
    border-radius: 14px;
    padding: 16px 20px;
    margin-bottom: 16px;
    font-size: 14px;
    color: #f87171;
    line-height: 1.5;
  }
  .error-card.show { display: block; }

  /* ── History panel ── */
  .history-empty {
    text-align: center;
    padding: 48px 24px;
    color: var(--muted);
    font-size: 14px;
  }
  .history-empty .icon { font-size: 32px; margin-bottom: 12px; }
  .history-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 16px 18px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  .history-item:active { border-color: var(--teal); }
  .history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }
  .history-user { font-size: 14px; font-weight: 600; }
  .history-date { font-size: 11px; color: var(--muted); font-family: 'Geist Mono', monospace; }
  .history-preview { font-size: 13px; color: var(--muted); line-height: 1.4; }
  .history-delete {
    float: right;
    background: none;
    border: none;
    color: var(--muted);
    font-size: 16px;
    cursor: pointer;
    padding: 0 0 0 10px;
    line-height: 1;
    -webkit-tap-highlight-color: transparent;
  }

  /* ── Footer ── */
  footer {
    margin-top: auto;
    padding: 24px 24px 32px;
    text-align: center;
    font-size: 11px;
    color: rgba(250,250,250,0.2);
  }

  /* ── Toast ── */
  .toast {
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: rgba(13,148,136,0.95);
    color: #fff;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    opacity: 0;
    transition: all 0.3s;
    pointer-events: none;
    z-index: 100;
    white-space: nowrap;
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

  @media (min-width: 480px) {
    .hero { padding: 48px 32px 36px; }
    .tabs { padding: 0 32px; }
    .panel { padding: 0 32px; }
    header { padding: 24px 32px 0; }
    footer { padding: 24px 32px 40px; }
  }
</style>
</head>
<body>
<div class="app">

  <header>
    <div class="brand">
      <div class="logo-mark"><div class="logo-toggle"></div></div>
      <span class="logo-text">SelfMode</span>
      <span class="research-badge">Research</span>
    </div>
    <div class="ig-badge">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" stroke-width="1.8"/>
        <circle cx="12" cy="12" r="4.5" stroke="white" stroke-width="1.8"/>
        <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
      </svg>
    </div>
  </header>

  <div class="hero">
    <h1>Transcribe any<br><em>Reel</em></h1>
    <p>Paste a link. Get clean text. Ready for AI.</p>
  </div>

  <div class="tabs">
    <button class="tab active" onclick="switchTab('transcribe', this)">Transcribe</button>
    <button class="tab" onclick="switchTab('history', this)" id="history-tab">
      History
      <span class="tab-count" id="history-count" style="display:none">0</span>
    </button>
  </div>

  <!-- Transcribe Panel -->
  <div class="panel active" id="panel-transcribe">

    <div class="input-card">
      <span class="input-label">Instagram URL</span>
      <div class="url-row">
        <input
          type="url"
          class="url-input"
          id="url-input"
          placeholder="https://www.instagram.com/reel/..."
          enterkeyhint="go"
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
        >
        <button class="btn-transcribe" id="btn-go" onclick="startTranscribe()">Go</button>
      </div>
      <div class="format-row">
        <span class="format-label">Format for AI</span>
        <button class="toggle" id="format-toggle" onclick="this.classList.toggle('on')" aria-label="Format for AI"></button>
      </div>
    </div>

    <div class="status" id="status">
      <div class="status-steps">
        <div class="step" id="step-1">Fetching</div>
        <div class="step" id="step-2">Downloading</div>
        <div class="step" id="step-3">Transcribing</div>
      </div>
      <div class="status-text">
        <div class="spinner"></div>
        <span id="status-text">Fetching post data...</span>
      </div>
    </div>

    <div class="error-card" id="error-card"></div>

    <div class="result" id="result">
      <div class="result-meta">
        <div class="result-avatar" id="result-avatar">?</div>
        <div class="result-info">
          <div class="result-username" id="result-username">@username</div>
          <div class="result-caption" id="result-caption"></div>
        </div>
        <div class="result-duration" id="result-duration">0s</div>
      </div>
      <div class="result-transcript">
        <div class="transcript-label">Transcript</div>
        <div class="transcript-text" id="transcript-text"></div>
      </div>
      <div class="result-actions">
        <button class="btn-action teal" onclick="copyTranscript()">Copy</button>
        <button class="btn-action" onclick="saveTranscript()">Save .txt</button>
        <button class="btn-action" onclick="saveToHistory()">Save to History</button>
      </div>
    </div>

  </div>

  <!-- History Panel -->
  <div class="panel" id="panel-history">
    <div id="history-list"></div>
  </div>

  <footer>SelfMode Research &nbsp;·&nbsp; Instagram Transcription</footer>
</div>

<div class="toast" id="toast"></div>

<script>
// ── State ───────────────────────────────────────────────────────────────────
let currentResult = null;

// ── Tabs ─────────────────────────────────────────────────────────────────────
function switchTab(name, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('panel-' + name).classList.add('active');
  if (name === 'history') renderHistory();
}

// ── Transcribe ───────────────────────────────────────────────────────────────
async function startTranscribe() {
  const url = document.getElementById('url-input').value.trim();
  if (!url) return;

  const btn = document.getElementById('btn-go');
  btn.disabled = true;

  // Reset UI
  hide('result'); hide('error-card');
  setStep(1); setStatusText('Fetching post data...');
  show('status');

  try {
    setStep(2); setStatusText('Downloading video...');

    const resp = await fetch('/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    setStep(3); setStatusText('Transcribing with Whisper...');

    const data = await resp.json();
    if (!data.ok) throw new Error(data.error || 'Transcription failed');

    currentResult = { ...data, url, savedAt: new Date().toISOString() };
    renderResult(data);
    hide('status');

  } catch (e) {
    hide('status');
    showError(e.message);
  } finally {
    btn.disabled = false;
  }
}

function renderResult(data) {
  const m = data.metadata;
  const formatted = document.getElementById('format-toggle').classList.contains('on');
  const transcriptToShow = formatted ? formatForAI(data) : data.transcript;

  document.getElementById('result-avatar').textContent = (m.username || '?')[0].toUpperCase();
  document.getElementById('result-username').textContent = '@' + (m.username || 'unknown');
  document.getElementById('result-caption').textContent = m.caption ? m.caption.slice(0, 80) + (m.caption.length > 80 ? '…' : '') : 'No caption';
  document.getElementById('result-duration').textContent = m.duration + 's';
  document.getElementById('transcript-text').textContent = transcriptToShow;
  show('result');
}

function formatForAI(data) {
  const m = data.metadata;
  const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return [
    '[Instagram Video Transcript]',
    'Source: @' + (m.username || 'unknown') + ' — ' + (m.postUrl || ''),
    'Duration: ' + m.duration + ' seconds',
    m.caption ? 'Caption: "' + m.caption + '"' : '',
    'Date transcribed: ' + now,
    '',
    'TRANSCRIPT:',
    data.transcript
  ].filter(Boolean).join('\\n');
}

// ── History (IndexedDB) ───────────────────────────────────────────────────────
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('SelfModeIG', 1);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('transcripts')) {
        const store = db.createObjectStore('transcripts', { keyPath: 'id', autoIncrement: true });
        store.createIndex('savedAt', 'savedAt');
      }
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveToHistory() {
  if (!currentResult) return;
  try {
    const db = await openDB();
    const tx = db.transaction('transcripts', 'readwrite');
    tx.objectStore('transcripts').add(currentResult);
    tx.oncomplete = () => { updateHistoryCount(); toast('Saved to history'); };
  } catch (e) { toast('Save failed'); }
}

async function getHistory() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction('transcripts', 'readonly');
    const req = tx.objectStore('transcripts').index('savedAt').getAll();
    req.onsuccess = () => resolve((req.result || []).reverse());
  });
}

async function deleteHistory(id) {
  const db = await openDB();
  const tx = db.transaction('transcripts', 'readwrite');
  tx.objectStore('transcripts').delete(id);
  tx.oncomplete = () => { renderHistory(); updateHistoryCount(); };
}

async function renderHistory() {
  const items = await getHistory();
  const list = document.getElementById('history-list');
  if (!items.length) {
    list.innerHTML = '<div class="history-empty"><div class="icon">📋</div>No transcripts saved yet.</div>';
    return;
  }
  list.innerHTML = items.map(item => {
    const m = item.metadata || {};
    const date = new Date(item.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const preview = (item.transcript || '').slice(0, 100) + '...';
    return \`<div class="history-item" onclick="loadFromHistory(\${item.id})">
      <div class="history-header">
        <span class="history-user">@\${m.username || 'unknown'}</span>
        <span class="history-date">\${date}</span>
        <button class="history-delete" onclick="event.stopPropagation();deleteHistory(\${item.id})">×</button>
      </div>
      <div class="history-preview">\${preview}</div>
    </div>\`;
  }).join('');
}

async function loadFromHistory(id) {
  const db = await openDB();
  const tx = db.transaction('transcripts', 'readonly');
  const req = tx.objectStore('transcripts').get(id);
  req.onsuccess = () => {
    if (req.result) {
      currentResult = req.result;
      document.getElementById('url-input').value = req.result.url || '';
      renderResult(req.result);
      switchTab('transcribe', document.querySelector('.tab'));
    }
  };
}

async function updateHistoryCount() {
  const items = await getHistory();
  const el = document.getElementById('history-count');
  if (items.length > 0) { el.textContent = items.length; el.style.display = 'flex'; }
  else { el.style.display = 'none'; }
}

// ── Actions ───────────────────────────────────────────────────────────────────
function copyTranscript() {
  const text = document.getElementById('transcript-text').textContent;
  navigator.clipboard.writeText(text).then(() => toast('Copied!')).catch(() => toast('Copy failed'));
}

function saveTranscript() {
  const text = document.getElementById('transcript-text').textContent;
  const m = currentResult?.metadata || {};
  const filename = 'transcript-' + (m.username || 'ig') + '-' + (m.shortcode || Date.now()) + '.txt';
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function show(id) { document.getElementById(id).classList.add('show'); }
function hide(id) { document.getElementById(id).classList.remove('show'); }
function showError(msg) {
  const el = document.getElementById('error-card');
  el.textContent = msg;
  el.classList.add('show');
}

function setStep(n) {
  ['step-1','step-2','step-3'].forEach((id, i) => {
    const el = document.getElementById(id);
    el.className = 'step' + (i + 1 < n ? ' done' : i + 1 === n ? ' active' : '');
  });
}
function setStatusText(t) { document.getElementById('status-text').textContent = t; }

let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
}

// ── Paste handling ────────────────────────────────────────────────────────────
document.getElementById('url-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') startTranscribe();
});

// ── Init ──────────────────────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
updateHistoryCount();
</script>
</body>
</html>`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function igHeaders() {
  return {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  };
}

function extractShortcode(url) {
  const m = url.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}

function jsonResponse(data, status = 200) {
  return Response.json(data, { status });
}

function errorResponse(msg, status = 400) {
  return Response.json({ ok: false, error: msg }, { status });
}

// ─── Transcribe handler ───────────────────────────────────────────────────────
async function handleTranscribe(request, env) {
  let body;
  try { body = await request.json(); } catch { return errorResponse('Invalid request body'); }

  const { url } = body;
  if (!url) return errorResponse('Missing url');

  const shortcode = extractShortcode(url);
  if (!shortcode) return errorResponse('Invalid Instagram URL. Paste a /p/, /reel/, or /tv/ link.');

  try {
    // 1. Fetch page for CSRF token
    const pageResp = await fetch(`https://www.instagram.com/p/${shortcode}/`, {
      headers: igHeaders()
    });
    if (!pageResp.ok) return errorResponse('Could not reach Instagram. Try again in a moment.');

    const cookies = pageResp.headers.get('set-cookie') || '';
    const csrfToken = cookies.match(/csrftoken=([^;,\s]+)/)?.[1] || '';

    // 2. GraphQL — get video URL
    const docId = env.IG_STATE ? (await env.IG_STATE.get('ig:doc_id') || DOC_ID_DEFAULT) : DOC_ID_DEFAULT;

    const gqlResp = await fetch('https://www.instagram.com/graphql/query/', {
      method: 'POST',
      headers: {
        ...igHeaders(),
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
        'X-IG-App-ID': IG_APP_ID,
        'X-ASBD-ID': '129477',
        'X-IG-WWW-Claim': '0',
        'Referer': `https://www.instagram.com/p/${shortcode}/`,
        'Origin': 'https://www.instagram.com',
      },
      body: `doc_id=${docId}&variables=${encodeURIComponent(JSON.stringify({
        shortcode,
        child_comment_count: 3,
        fetch_comment_count: 40,
        parent_comment_count: 24,
        has_threaded_comments: true
      }))}`
    });

    if (gqlResp.status === 429) return errorResponse('Instagram rate limit hit. Wait a few minutes and try again.');
    if (!gqlResp.ok) return errorResponse(`Instagram returned ${gqlResp.status}. The post may be private or deleted.`);

    const gql = await gqlResp.json();
    const media = gql?.data?.xdt_shortcode_media;
    if (!media) return errorResponse('Could not read post data. The doc_id may need updating — contact support.');
    if (!media.is_video) return errorResponse('This post is a photo, not a video. Only video posts can be transcribed.');

    const videoUrl = media.video_url;
    const metadata = {
      username: media.owner?.username || 'unknown',
      caption: media.edge_media_to_caption?.edges?.[0]?.node?.text || '',
      duration: Math.round(media.video_duration || 0),
      shortcode,
      postUrl: `https://www.instagram.com/p/${shortcode}/`
    };

    // 3. Download video
    const videoResp = await fetch(videoUrl, {
      headers: { 'Referer': 'https://www.instagram.com/', 'User-Agent': igHeaders()['User-Agent'] }
    });
    if (!videoResp.ok) return errorResponse('Failed to download video from Instagram CDN.');

    const videoBytes = new Uint8Array(await videoResp.arrayBuffer());

    // 4. Transcribe with Whisper Large V3 Turbo
    if (!env.AI) return errorResponse('AI binding not configured on this worker.');

    const aiResult = await env.AI.run('@cf/openai/whisper-large-v3-turbo', {
      audio: [...videoBytes]
    });

    if (!aiResult?.text) return errorResponse('Transcription returned empty. The video may have no speech.');

    return jsonResponse({ ok: true, transcript: aiResult.text, metadata });

  } catch (e) {
    return errorResponse('Unexpected error: ' + e.message, 500);
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/icon.svg') {
      return new Response(ICON_SVG, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' }});
    }
    if (url.pathname === '/manifest.json') {
      return new Response(MANIFEST, { headers: { 'Content-Type': 'application/manifest+json', 'Cache-Control': 'public, max-age=3600' }});
    }
    if (url.pathname === '/sw.js') {
      return new Response(SW_JS, { headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'no-cache' }});
    }
    if (url.pathname === '/transcribe' && request.method === 'POST') {
      return handleTranscribe(request, env);
    }

    return new Response(HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' }});
  }
};
