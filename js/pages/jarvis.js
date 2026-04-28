/**
 * Jarvis — chat-style assistant powered by app data + template logic.
 * Pure local — no external API. Easy to wire to Claude/OpenAI later.
 */
import { Store } from '../store.js';
import { escapeHtml, fmtMoney, todayISO } from '../ui.js';
import { GENERATORS, getGenerator } from '../generators/templates.js';

const SUGGESTIONS = [
  'Who should I follow up with today?',
  'Give me today\'s top 3 actions.',
  'What prospects are closest to closing?',
  'Create a Facebook post about missed calls.',
  'Create a cold call script for {prospect}.',
  'Create an audit script for {prospect}.',
  'Create a proposal for {prospect}.',
  'How am I tracking to $50k MRR?',
];

export function renderJarvis(root) {
  const draw = () => {
    const s = Store.get();
    root.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Jarvis</h1>
          <div class="page-subtitle">Internal logic. Connect Claude later.</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-ghost" id="clear-chat">Clear</button>
        </div>
      </div>

      <div class="chat">
        <div class="chat-stream" id="stream"></div>
        <div style="padding:0 12px">
          <div class="suggestions">
            ${SUGGESTIONS.map(s => `<span class="suggestion">${escapeHtml(s)}</span>`).join('')}
          </div>
        </div>
        <div class="chat-input">
          <input class="input" id="msg" placeholder='Ask Jarvis... (e.g. "Top 3 actions today")' />
          <button class="btn btn-primary" id="send">Send</button>
        </div>
      </div>
    `;

    const stream = root.querySelector('#stream');
    const renderHistory = () => {
      const history = Store.get().jarvisHistory || [];
      stream.innerHTML = history.length === 0
        ? `<div class="bubble bot"><div class="meta">Jarvis</div>Hey — I run on local data and templates for now. Try one of the suggestions below or ask me about your pipeline.</div>`
        : history.map(m => bubble(m)).join('');
      stream.scrollTop = stream.scrollHeight;
    };

    renderHistory();

    const send = (text) => {
      text = (text || root.querySelector('#msg').value || '').trim();
      if (!text) return;
      const userMsg = { role: 'user', text, ts: Date.now() };
      Store.set(s => { s.jarvisHistory = [...(s.jarvisHistory || []), userMsg]; return s; });
      const reply = answer(text);
      const botMsg = { role: 'bot', text: reply, ts: Date.now() };
      Store.set(s => { s.jarvisHistory = [...(s.jarvisHistory || []), botMsg]; return s; });
      root.querySelector('#msg').value = '';
      renderHistory();
    };

    root.querySelector('#send').addEventListener('click', () => send());
    root.querySelector('#msg').addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); send(); }
    });
    root.querySelectorAll('.suggestion').forEach(s => {
      s.addEventListener('click', () => {
        let t = s.textContent;
        const firstProspect = Store.get().prospects[0]?.businessName;
        if (firstProspect) t = t.replace('{prospect}', firstProspect);
        root.querySelector('#msg').value = t;
        root.querySelector('#msg').focus();
      });
    });
    root.querySelector('#clear-chat').addEventListener('click', () => {
      Store.set(s => { s.jarvisHistory = []; return s; });
      renderHistory();
    });
  };

  draw();
  return Store.subscribe(draw);
}

function bubble(m) {
  if (m.role === 'user') return `<div class="bubble user">${escapeHtml(m.text)}</div>`;
  return `<div class="bubble bot"><div class="meta">Jarvis</div>${escapeHtml(m.text)}</div>`;
}

// ============================================================
//  Local intent router — tries to be useful with no external API.
// ============================================================
function answer(text) {
  const q = text.toLowerCase();
  const s = Store.get();

  // Top 3 actions
  if (/top\s*3|today.*(action|priorit|focus)|what.*do.*today|priorit/.test(q)) {
    return topActionsAnswer(s);
  }

  // Follow ups today
  if (/follow.?up.*today|who.*follow.?up|follow.?ups.*today/.test(q)) {
    return followUpsAnswer(s);
  }

  // Closest to closing
  if (/closest.*clos|deals.*about.*close|who.*ready.*close|hottest/.test(q)) {
    return closestToClosingAnswer(s);
  }

  // MRR / goal tracking
  if (/mrr|monthly.*revenue|goal|50k|tracking/.test(q)) {
    return goalAnswer(s);
  }

  // Generation requests — find the template
  const gen = matchGenerator(q);
  if (gen) {
    const prospect = matchProspect(text, s);
    const seed = prospect ? prospectSeed(prospect) : exampleSeed(gen);
    const out = getGenerator(gen.id).render(seed);
    const header = prospect
      ? `Drafted ${gen.label} for ${prospect.businessName}. Edit in Studio for full control.`
      : `Drafted ${gen.label} using sample data. Edit in Studio for full control.`;
    return `${header}\n\n${out}`;
  }

  // Help
  if (/help|what.*can.*do|menu/.test(q)) {
    return [
      'I can pull from your local data and templates. Try:',
      '• "Who should I follow up with today?"',
      '• "Give me today\'s top 3 actions"',
      '• "What prospects are closest to closing?"',
      '• "Create a cold call script for [Business]"',
      '• "Create a proposal for [Business]"',
      '• "Create a Facebook post about missed calls"',
      '• "How am I tracking to $50k MRR?"',
      '',
      'External AI is not connected yet — when it is, I\'ll get a lot smarter.',
    ].join('\n');
  }

  // Default — try to summarize
  return [
    `I'm running on local logic — I couldn't fully match that prompt. Things I can do today:`,
    '• Tell you who to follow up with',
    '• Give you the top 3 actions for today',
    '• Show what\'s closest to closing',
    '• Generate scripts, audits, proposals, posts, and reports',
    '• Track MRR vs goal',
    '',
    'Try rewording or use one of the suggestion chips.',
  ].join('\n');
}

function topActionsAnswer(s) {
  const today = todayISO();
  const lines = [];

  const overdue = s.tasks.filter(t => t.status !== 'Done' && t.dueDate && t.dueDate.slice(0,10) < today);
  const todayCalls = s.tasks.filter(t => t.status !== 'Done' && t.type === 'Call' && t.dueDate && t.dueDate.slice(0,10) === today);
  const proposalReady = s.prospects.find(p => p.stage === 'Call Booked');
  const followUps = s.prospects.filter(p => p.nextFollowUp && p.nextFollowUp.slice(0,10) === today);

  if (overdue[0]) lines.push(`1. Knock out overdue: "${overdue[0].title}" (${overdue[0].type})`);
  if (todayCalls[0]) lines.push(`${lines.length + 1}. Make the call: "${todayCalls[0].title}"`);
  if (proposalReady && lines.length < 3) lines.push(`${lines.length + 1}. Send proposal to ${proposalReady.businessName} (${proposalReady.packageRecommended || 'pick a package'})`);
  for (const p of followUps) {
    if (lines.length >= 3) break;
    lines.push(`${lines.length + 1}. Follow up with ${p.businessName} — ${p.problemFound || 're-engage'}`);
  }
  if (lines.length === 0) {
    return 'Nothing scheduled for today. Use the time to add 5 fresh prospects to your pipeline. Outbound is the move.';
  }
  return `Here are today's top ${lines.length} money-making actions:\n\n${lines.join('\n')}`;
}

function followUpsAnswer(s) {
  const today = todayISO();
  const list = s.prospects.filter(p => p.nextFollowUp && p.nextFollowUp.slice(0,10) === today);
  if (list.length === 0) return 'No follow-ups due today. You\'re clear — keep moving prospects forward.';
  return `Follow up with these ${list.length} today:\n\n` +
    list.map((p, i) => `${i+1}. ${p.businessName} — ${p.niche || 'unknown niche'} — ${p.problemFound || 're-engage'}`).join('\n');
}

function closestToClosingAnswer(s) {
  const order = { 'Proposal Sent': 0, 'Call Booked': 1, 'Contacted': 2, 'Audit Sent': 3 };
  const ranked = s.prospects
    .filter(p => p.stage in order)
    .sort((a, b) => order[a.stage] - order[b.stage])
    .slice(0, 5);
  if (ranked.length === 0) return 'Pipeline is light. Add audits and start booking calls.';
  return `Top deals closest to closing:\n\n` +
    ranked.map((p, i) => `${i+1}. ${p.businessName} — ${p.stage} — ${p.packageRecommended || 'no package set'}`).join('\n');
}

function goalAnswer(s) {
  const mrr = s.clients.reduce((sum, c) => sum + (Number(c.monthlyRetainer) || 0), 0);
  const goal = s.settings.monthlyGoal || 50000;
  const pct = Math.round((mrr / goal) * 100);
  const left = goal - mrr;
  const pkgValue = 400; // average new client per month, rough
  const clientsNeeded = Math.max(0, Math.ceil(left / pkgValue));
  return [
    `MRR: ${fmtMoney(mrr)} of ${fmtMoney(goal)} (${pct}%).`,
    `Gap to goal: ${fmtMoney(left)}.`,
    `At ~${fmtMoney(pkgValue)}/mo per Core client, you need ~${clientsNeeded} more clients to hit $50k/mo.`,
    `If half take AI Voice ($600/mo), you only need ~${Math.ceil(left / 500)}.`,
  ].join('\n');
}

function matchGenerator(q) {
  const map = [
    { id: 'cold-call',      keys: ['cold call', 'call script', 'phone script'] },
    { id: 'follow-up-text', keys: ['follow up text', 'follow-up text', 'sms', 'text message'] },
    { id: 'follow-up-email',keys: ['follow up email', 'follow-up email', 'email follow'] },
    { id: 'audit-script',   keys: ['audit script', 'audit', 'walkthrough'] },
    { id: 'proposal',       keys: ['proposal', 'sales proposal'] },
    { id: 'fb-post',        keys: ['facebook post', 'fb post'] },
    { id: 'li-post',        keys: ['linkedin post', 'li post'] },
    { id: 'ghl-map',        keys: ['ghl', 'workflow map', 'workflow'] },
    { id: 'monthly-report', keys: ['monthly report', 'client report'] },
    { id: 'objection',      keys: ['objection'] },
  ];
  for (const { id, keys } of map) {
    if (keys.some(k => q.includes(k))) return GENERATORS.find(g => g.id === id);
  }
  return null;
}

function matchProspect(text, s) {
  const lower = text.toLowerCase();
  return s.prospects.find(p =>
    p.businessName && lower.includes(p.businessName.toLowerCase())
  ) || null;
}

function prospectSeed(p) {
  return {
    businessName: p.businessName,
    ownerName: p.ownerName,
    niche: p.niche,
    website: p.website,
    problem: p.problemFound,
    problems: p.problemFound,
    reviews: p.googleReviews,
    package: p.packageRecommended,
    price: p.packageRecommended?.toLowerCase().includes('voice')
      ? '$1,700 setup / $600 monthly'
      : '$1,200 setup / $400 monthly',
    timeline: '14 days to launch',
    goal: 'Book a 15-min discovery call',
    websiteStatus: p.websiteStatus,
    context: 'Last contact ' + (p.lastContacted || 'recently'),
    topic: 'Missed calls = lost jobs',
  };
}

function exampleSeed(gen) {
  // Use placeholder defaults from each field
  const out = {};
  gen.fields.forEach(f => out[f.key] = f.placeholder || '');
  return out;
}
