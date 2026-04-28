/**
 * Titan HQ — entry point.
 * Boots store, mounts sidebar, registers routes, starts router.
 */

import { Store } from './store.js';
import { renderSidebar } from './components/sidebar.js';
import { route, startRouter } from './router.js';

import { renderDashboard } from './pages/dashboard.js';
import { renderContacts }  from './pages/contacts.js';
import { renderPipeline }  from './pages/pipeline.js';
import { renderStudio }    from './pages/studio.js';
import { renderBrain }     from './pages/brain.js';
import { renderJarvis }    from './pages/jarvis.js';
import { renderTasks }     from './pages/tasks.js';
import { renderClients }   from './pages/clients.js';
import { renderAgents }    from './pages/agents.js';
import { renderSettings }  from './pages/settings.js';

// Boot
Store.init();
renderSidebar();

// Routes
route('/',          renderDashboard);
route('/jarvis',    renderJarvis);
route('/contacts',  renderContacts);
route('/pipeline',  renderPipeline);
route('/studio',    renderStudio);
route('/brain',     renderBrain);
route('/tasks',     renderTasks);
route('/clients',   renderClients);
route('/agents',    renderAgents);
route('/settings',  renderSettings);

startRouter();

// Re-render sidebar when settings change (so name updates live)
Store.subscribe(() => {
  // Cheap: just refresh the brand text without rebuilding nav
  const settings = Store.get().settings;
  const nameEl = document.querySelector('.brand-text .name');
  const subEl = document.querySelector('.brand-text .sub');
  if (nameEl) nameEl.textContent = settings.appName;
  if (subEl) subEl.textContent = settings.agencyName;
});
