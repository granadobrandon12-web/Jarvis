/**
 * Hash-based router — supports #/path?a=1&b=2 patterns.
 * Pages register a render(root, params) function.
 */

const routes = new Map();
let currentCleanup = null;

export function route(path, renderFn) {
  routes.set(path, renderFn);
}

export function navigate(path) {
  if (location.hash !== '#' + path) {
    location.hash = path;
  } else {
    handle();
  }
}

function parseHash() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, qs] = raw.split('?');
  const params = {};
  if (qs) {
    qs.split('&').forEach(kv => {
      const [k, v] = kv.split('=');
      if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
  }
  return { path: path || '/', params };
}

export function getCurrentPath() {
  return parseHash().path;
}

function handle() {
  if (typeof currentCleanup === 'function') {
    try { currentCleanup(); } catch (_) { /* noop */ }
    currentCleanup = null;
  }
  const { path, params } = parseHash();
  const render = routes.get(path) || routes.get('/');
  const root = document.getElementById('page-root');
  root.innerHTML = '';
  const result = render && render(root, params);
  if (typeof result === 'function') currentCleanup = result;
  // Highlight nav
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.path === path);
  });
  // Close mobile sidebar
  document.getElementById('sidebar')?.classList.remove('open');
  window.scrollTo({ top: 0 });
}

export function startRouter() {
  window.addEventListener('hashchange', handle);
  if (!location.hash) location.hash = '/';
  else handle();
}
