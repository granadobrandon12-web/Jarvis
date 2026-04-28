/**
 * UI helpers — DOM creation, modals, toasts, formatters.
 */

export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function fmtMoney(n) {
  if (n == null || isNaN(n)) return '$0';
  return '$' + Math.round(Number(n)).toLocaleString();
}

export function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function fmtRelative(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  return `In ${diff}d`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function isToday(iso) {
  return iso && iso.slice(0, 10) === todayISO();
}

export function isOverdue(iso) {
  if (!iso) return false;
  return iso.slice(0, 10) < todayISO();
}

// ---------------- Modal ----------------
export function openModal({ title, body, footer, width }) {
  closeModal();
  const root = document.getElementById('modal-root');
  const back = el(`
    <div class="modal-backdrop">
      <div class="modal" style="${width ? `max-width:${width}px` : ''}">
        <div class="modal-head">
          <h3>${escapeHtml(title || '')}</h3>
          <button class="icon-btn" data-close aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body"></div>
        ${footer ? `<div class="modal-foot"></div>` : ''}
      </div>
    </div>
  `);

  const bodyEl = back.querySelector('.modal-body');
  if (typeof body === 'string') bodyEl.innerHTML = body;
  else if (body instanceof Node) bodyEl.appendChild(body);

  if (footer) {
    const footEl = back.querySelector('.modal-foot');
    if (typeof footer === 'string') footEl.innerHTML = footer;
    else if (footer instanceof Node) footEl.appendChild(footer);
  }

  back.addEventListener('click', e => {
    if (e.target === back || e.target.closest('[data-close]')) closeModal();
  });
  document.addEventListener('keydown', escListener);
  root.appendChild(back);
  return back;
}

function escListener(e) {
  if (e.key === 'Escape') closeModal();
}

export function closeModal() {
  const root = document.getElementById('modal-root');
  root.innerHTML = '';
  document.removeEventListener('keydown', escListener);
}

// ---------------- Toast ----------------
export function toast(msg, ms = 2200) {
  const root = document.getElementById('toast-root');
  const t = el(`<div class="toast">${escapeHtml(msg)}</div>`);
  root.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transition = 'opacity 0.25s';
    setTimeout(() => t.remove(), 260);
  }, ms);
}

// ---------------- Confirm ----------------
export function confirmDialog(message, onYes) {
  openModal({
    title: 'Are you sure?',
    body: `<p style="margin:0;color:var(--text-dim)">${escapeHtml(message)}</p>`,
    footer: `
      <button class="btn btn-ghost" data-close>Cancel</button>
      <button class="btn btn-danger" data-yes>Confirm</button>
    `,
  });
  document.querySelector('[data-yes]')?.addEventListener('click', () => {
    closeModal();
    onYes && onYes();
  });
}
