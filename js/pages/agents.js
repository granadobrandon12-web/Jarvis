/**
 * Agents — placeholder cards for future AI agents.
 */
import { escapeHtml, toast } from '../ui.js';

const AGENTS = [
  {
    id: 'sales-scout',
    name: 'Sales Scout Agent',
    description: 'Finds high-fit local service businesses, scores them, and feeds them into your prospect list automatically.',
    iconPath: 'M21 21l-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z',
  },
  {
    id: 'audit',
    name: 'Audit Agent',
    description: 'Generates personalized website + Google profile audits and writes the Loom-ready walkthrough script.',
    iconPath: 'M9 11l3 3 7-7M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  },
  {
    id: 'content',
    name: 'Content Agent',
    description: 'Drafts daily social content for Titan Automation — case studies, before/after carousels, and reels hooks.',
    iconPath: 'M3 15a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM7 7h10M9 3h6',
  },
  {
    id: 'proposal',
    name: 'Proposal Agent',
    description: 'Builds tailored proposals and packages with pricing logic for Core, AI Voice, and bundles.',
    iconPath: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  },
  {
    id: 'ghl',
    name: 'GHL Agent',
    description: 'Generates GHL workflow maps, pipeline configs, and SOPs ready to paste into a sub-account.',
    iconPath: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  },
  {
    id: 'success',
    name: 'Client Success Agent',
    description: 'Writes monthly reports and proactive client update messages from real performance data.',
    iconPath: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 11l-2 2-2-2',
  },
];

export function renderAgents(root) {
  root.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Agents</h1>
        <div class="page-subtitle">Six specialist AI agents — coming soon</div>
      </div>
    </div>

    <div class="grid grid-3">
      ${AGENTS.map(a => `
        <div class="agent-card">
          <div class="agent-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${a.iconPath}"/></svg>
          </div>
          <h3>${escapeHtml(a.name)}</h3>
          <p>${escapeHtml(a.description)}</p>
          <div class="row between mt-12">
            <span class="badge">v0 · Concept</span>
            <button class="btn btn-sm btn-ghost" data-agent="${a.id}">Coming Soon</button>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="card mt-24">
      <h3 style="margin-top:0">Roadmap</h3>
      <p class="dim" style="margin:0 0 8px">When external AI is connected, these agents will run on a shared model gateway and pull from your live Titan HQ data:</p>
      <ul style="margin:0;padding-left:18px;color:var(--text-dim);line-height:1.8">
        <li>Phase 1 — wire OpenAI/Claude API + tool use</li>
        <li>Phase 2 — connect GHL for live pipeline / contact actions</li>
        <li>Phase 3 — connect Supabase for shared, multi-device state</li>
        <li>Phase 4 — agent runs scheduled jobs (daily content, weekly outreach)</li>
      </ul>
    </div>
  `;

  root.querySelectorAll('[data-agent]').forEach(b => {
    b.addEventListener('click', () => toast('Agent coming soon — wire AI provider first.'));
  });
}
