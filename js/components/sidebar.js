/**
 * Sidebar navigation. Renders nav items + brand.
 */
import { Store } from '../store.js';
import { navigate, getCurrentPath } from '../router.js';

const NAV = [
  { label: 'Dashboard', path: '/',          icon: 'grid' },
  { label: 'Jarvis',    path: '/jarvis',    icon: 'sparkles' },
  { label: 'Contacts',  path: '/contacts',  icon: 'users' },
  { label: 'Pipeline',  path: '/pipeline',  icon: 'columns' },
  { label: 'Studio',    path: '/studio',    icon: 'wand' },
  { label: 'Brain',     path: '/brain',     icon: 'brain' },
  { label: 'Tasks',     path: '/tasks',     icon: 'check' },
  { label: 'Clients',   path: '/clients',   icon: 'briefcase' },
  { label: 'Agents',    path: '/agents',    icon: 'bot' },
  { label: 'Settings',  path: '/settings',  icon: 'gear' },
];

const ICONS = {
  grid:      `<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>`,
  sparkles:  `<path d="M5 3v4M3 5h4M19 13v4M17 15h4M11 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>`,
  users:     `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  columns:   `<path d="M3 4h6v16H3zM10 4h4v16h-4zM15 4h6v10h-6z"/>`,
  wand:      `<path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M15 9l-3 3-9 9 3 3 9-9 3-3-3-3z"/>`,
  brain:     `<path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v.6A2.5 2.5 0 0 0 4.5 7v.6A2.5 2.5 0 0 0 4.5 13v.6A2.5 2.5 0 0 0 7 18.5V19a2.5 2.5 0 0 0 5 0V2.5A2.5 2.5 0 0 0 9.5 2zM14.5 2A2.5 2.5 0 0 1 17 4.5v.6A2.5 2.5 0 0 1 19.5 7v.6A2.5 2.5 0 0 1 19.5 13v.6A2.5 2.5 0 0 1 17 18.5V19a2.5 2.5 0 0 1-5 0V2.5"/>`,
  check:     `<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>`,
  briefcase: `<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`,
  bot:       `<rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="8" cy="16" r="1.5"/><circle cx="16" cy="16" r="1.5"/><path d="M12 7V3M8 11V8a4 4 0 0 1 8 0v3"/>`,
  gear:      `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>`,
};

function svg(icon) {
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[icon] || ''}</svg>`;
}

export function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  const settings = Store.get().settings;
  sidebar.innerHTML = `
    <div class="brand">
      <div class="logo-mark">T</div>
      <div class="brand-text">
        <span class="name">${settings.appName}</span>
        <span class="sub">${settings.agencyName}</span>
      </div>
    </div>
    <div class="nav-section">Workspace</div>
    <nav class="nav">
      ${NAV.map(n => `
        <div class="nav-item" data-path="${n.path}" role="link" tabindex="0">
          ${svg(n.icon)}<span>${n.label}</span>
        </div>
      `).join('')}
    </nav>
    <div class="sidebar-footer">
      <div>v0.1 · MVP</div>
      <div class="muted" style="font-size:11px">Local storage only</div>
    </div>
  `;

  sidebar.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.path));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(item.dataset.path); }
    });
  });

  // Sync active
  const cur = getCurrentPath();
  sidebar.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.path === cur);
  });

  // Mobile toggle
  document.getElementById('menu-toggle')?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}
