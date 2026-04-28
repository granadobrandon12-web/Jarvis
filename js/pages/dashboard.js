/**
 * Dashboard — Command Center overview.
 */
import { Store } from '../store.js';
import { fmtMoney, fmtDate, fmtRelative, isToday, isOverdue, todayISO, escapeHtml } from '../ui.js';
import { navigate } from '../router.js';

export function renderDashboard(root) {
  const s = Store.get();
  const { settings, prospects, tasks, clients } = s;

  // ---- Metrics
  const activeClients = clients.length;
  const mrr = clients.reduce((sum, c) => sum + (Number(c.monthlyRetainer) || 0), 0);
  const goal = settings.monthlyGoal || 50000;
  const goalPct = Math.min(100, Math.round((mrr / goal) * 100));

  const callsBooked = prospects.filter(p => p.stage === 'Call Booked').length;
  const proposalsSent = prospects.filter(p => p.stage === 'Proposal Sent').length;
  const followUpsToday = prospects.filter(p => p.nextFollowUp && p.nextFollowUp.slice(0,10) === todayISO()).length;
  const tasksDueToday = tasks.filter(t => t.status !== 'Done' && t.dueDate && t.dueDate.slice(0,10) === todayISO()).length;
  const tasksOverdue = tasks.filter(t => t.status !== 'Done' && t.dueDate && t.dueDate.slice(0,10) < todayISO()).length;

  const monthStart = new Date();
  monthStart.setDate(1); monthStart.setHours(0,0,0,0);
  const closedWonThisMonth = clients.filter(c => c.startDate && new Date(c.startDate) >= monthStart).length;

  // Estimated pipeline value: prospects in proposal/call-booked, valued by recommended package
  const valueOf = (pkg) => {
    const lower = (pkg || '').toLowerCase();
    if (lower.includes('voice')) return 600 * 12 + 1700;
    if (lower) return 400 * 12 + 1200;
    return 0;
  };
  const pipelineStages = ['Audit Sent', 'Contacted', 'Call Booked', 'Proposal Sent'];
  const pipelineValue = prospects
    .filter(p => pipelineStages.includes(p.stage))
    .reduce((sum, p) => sum + valueOf(p.packageRecommended), 0);

  // Top 3 actions
  const top = pickTopActions({ prospects, tasks });

  root.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Command Center</h1>
        <div class="page-subtitle">${escapeHtml(settings.agencyName)} · ${fmtDate(new Date().toISOString())}</div>
      </div>
      <div class="page-actions">
        <button class="btn" data-go="/contacts">Add Prospect</button>
        <button class="btn btn-primary" data-go="/jarvis">Ask Jarvis</button>
      </div>
    </div>

    <!-- MRR + Goal -->
    <div class="grid grid-2 mb-16">
      <div class="stat" style="grid-column: span 1;">
        <span class="accent-bar"></span>
        <div class="label">Current MRR</div>
        <div class="value">${fmtMoney(mrr)}</div>
        <div class="sub">Goal ${fmtMoney(goal)} / month</div>
        <div class="progress"><span style="width:${goalPct}%"></span></div>
        <div class="sub mt-8">${goalPct}% to ${fmtMoney(goal)}/mo</div>
      </div>
      <div class="stat">
        <span class="accent-bar"></span>
        <div class="label">Estimated Pipeline Value (12mo)</div>
        <div class="value">${fmtMoney(pipelineValue)}</div>
        <div class="sub">From ${prospects.filter(p => pipelineStages.includes(p.stage)).length} active opportunities</div>
      </div>
    </div>

    <!-- Stat row -->
    <div class="grid grid-4 mb-16">
      ${stat('Active Clients', activeClients, 'closed and live')}
      ${stat('Prospects', prospects.length, 'in pipeline')}
      ${stat('Calls Booked', callsBooked, 'awaiting proposal')}
      ${stat('Proposals Sent', proposalsSent, 'pending decision')}
      ${stat('Follow-ups Today', followUpsToday, 'prospects to ping')}
      ${stat('Tasks Today', tasksDueToday, tasksOverdue ? `${tasksOverdue} overdue` : 'on track')}
      ${stat('Closed Won (mo)', closedWonThisMonth, 'this month')}
      ${stat('To $50k Goal', `${goalPct}%`, fmtMoney(goal - mrr) + ' left')}
    </div>

    <!-- Top 3 actions + Today's overview -->
    <div class="grid grid-2 mb-16">
      <div class="card">
        <h3>Today's Top 3 Money-Making Actions</h3>
        <div class="flex flex-col gap-8 mt-12">
          ${top.length === 0
            ? `<div class="empty">No actions queued. Add tasks or prospects to get rolling.</div>`
            : top.map((a, i) => `
              <div class="card-elev card" style="padding:12px 14px;display:flex;align-items:center;gap:12px;cursor:pointer" data-go="${a.link}">
                <div class="logo-mark" style="width:28px;height:28px;font-size:13px">${i+1}</div>
                <div style="flex:1">
                  <div style="font-weight:600">${escapeHtml(a.title)}</div>
                  <div class="muted" style="font-size:12px">${escapeHtml(a.subtitle)}</div>
                </div>
                <span class="badge ${a.badgeColor || 'purple'}">${escapeHtml(a.badge || '')}</span>
              </div>
            `).join('')
          }
        </div>
      </div>

      <div class="card">
        <h3>Today's Snapshot</h3>
        <div class="flex flex-col gap-8 mt-12">
          ${snapshotRow('Follow-ups due today', followUpsToday, '/contacts')}
          ${snapshotRow('Tasks due today', tasksDueToday, '/tasks')}
          ${snapshotRow('Overdue tasks', tasksOverdue, '/tasks')}
          ${snapshotRow('Calls booked', callsBooked, '/pipeline')}
          ${snapshotRow('Proposals out', proposalsSent, '/pipeline')}
        </div>
      </div>
    </div>

    <!-- Recent prospects -->
    <div class="card">
      <div class="card-row mb-12">
        <h3 style="margin:0">Recent Prospects</h3>
        <button class="btn btn-sm" data-go="/contacts">View all</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Business</th>
              <th>Niche</th>
              <th>City</th>
              <th>Stage</th>
              <th>Next follow-up</th>
            </tr>
          </thead>
          <tbody>
            ${prospects.slice(0, 6).map(p => `
              <tr data-go="/contacts?id=${p.id}">
                <td><strong>${escapeHtml(p.businessName)}</strong><div class="muted" style="font-size:11px">${escapeHtml(p.ownerName || '')}</div></td>
                <td>${escapeHtml(p.niche || '')}</td>
                <td>${escapeHtml([p.city, p.state].filter(Boolean).join(', '))}</td>
                <td><span class="badge ${stageColor(p.stage)}">${escapeHtml(p.stage || '')}</span></td>
                <td>${fmtRelative(p.nextFollowUp)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Wire navigation clicks
  root.querySelectorAll('[data-go]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.go));
  });
}

function stat(label, value, sub) {
  return `
    <div class="stat">
      <span class="accent-bar"></span>
      <div class="label">${escapeHtml(label)}</div>
      <div class="value">${escapeHtml(String(value))}</div>
      <div class="sub">${escapeHtml(sub)}</div>
    </div>
  `;
}

function snapshotRow(label, value, link) {
  return `
    <div class="card-elev card" style="padding:10px 12px;display:flex;align-items:center;justify-content:space-between;cursor:pointer" data-go="${link}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
    </div>
  `;
}

function stageColor(stage) {
  const map = {
    'New Prospect': 'blue',
    'Audit Needed': 'amber',
    'Audit Sent': 'cyan',
    'Contacted': 'purple',
    'Call Booked': 'pink',
    'Proposal Sent': 'amber',
    'Closed Won': 'green',
    'Closed Lost': 'red',
    'Onboarding': 'cyan',
    'Active Client': 'green',
  };
  return map[stage] || '';
}

/**
 * Choose the 3 highest-leverage actions for today.
 * Priority: overdue tasks → today's calls → today's follow-ups → next-best move.
 */
function pickTopActions({ prospects, tasks }) {
  const today = todayISO();
  const out = [];

  const overdue = tasks.filter(t => t.status !== 'Done' && t.dueDate && t.dueDate.slice(0,10) < today);
  overdue.slice(0, 1).forEach(t => out.push({
    title: 'Knock out overdue task: ' + t.title,
    subtitle: t.type + (t.dueDate ? ' · ' + fmtRelative(t.dueDate) : ''),
    badge: 'Overdue', badgeColor: 'red',
    link: '/tasks',
  }));

  const todayCalls = tasks.filter(t => t.status !== 'Done' && t.type === 'Call' && t.dueDate && t.dueDate.slice(0,10) === today);
  todayCalls.slice(0, 1).forEach(t => out.push({
    title: 'Make the call: ' + t.title,
    subtitle: 'Highest-leverage action right now',
    badge: 'Call today', badgeColor: 'pink',
    link: '/tasks',
  }));

  const proposalReady = prospects.find(p => p.stage === 'Call Booked');
  if (proposalReady && out.length < 3) {
    out.push({
      title: 'Send proposal: ' + proposalReady.businessName,
      subtitle: proposalReady.niche + ' · ' + (proposalReady.packageRecommended || 'Recommend package'),
      badge: 'Proposal', badgeColor: 'purple',
      link: '/studio?gen=proposal',
    });
  }

  const followUps = prospects.filter(p => p.nextFollowUp && p.nextFollowUp.slice(0,10) === today);
  followUps.slice(0, 3 - out.length).forEach(p => out.push({
    title: 'Follow up with ' + p.businessName,
    subtitle: p.niche + ' · ' + (p.problemFound || 'Re-engage'),
    badge: 'Follow-up', badgeColor: 'blue',
    link: '/contacts?id=' + p.id,
  }));

  if (out.length === 0) {
    out.push({
      title: 'Add 5 fresh prospects to pipeline',
      subtitle: 'Outbound time — keep the top of funnel full',
      badge: 'Prospecting', badgeColor: 'cyan',
      link: '/contacts',
    });
  }

  return out.slice(0, 3);
}
