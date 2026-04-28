/**
 * Settings — agency info, monthly goal, data export/import/reset.
 */
import { Store } from '../store.js';
import { escapeHtml, toast, confirmDialog } from '../ui.js';

export function renderSettings(root) {
  const draw = () => {
    const s = Store.get();
    const settings = s.settings;

    root.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Settings</h1>
          <div class="page-subtitle">App configuration and data tools</div>
        </div>
      </div>

      <div class="grid grid-2">
        <div class="card">
          <h3 style="margin-top:0">Agency</h3>
          <div class="form-grid">
            <div class="field">
              <label>App name</label>
              <input class="input" id="s-appName" value="${escapeHtml(settings.appName)}" />
            </div>
            <div class="field">
              <label>Agency name</label>
              <input class="input" id="s-agencyName" value="${escapeHtml(settings.agencyName)}" />
            </div>
            <div class="field" style="grid-column: span 2">
              <label>Positioning statement</label>
              <textarea class="textarea" id="s-positioning" style="min-height:90px">${escapeHtml(settings.positioning)}</textarea>
            </div>
            <div class="field">
              <label>Monthly revenue goal ($)</label>
              <input class="input" id="s-goal" type="number" value="${Number(settings.monthlyGoal) || 0}" />
            </div>
          </div>
          <div class="row mt-12" style="justify-content:flex-end">
            <button class="btn btn-primary" id="save-settings">Save</button>
          </div>
        </div>

        <div class="card">
          <h3 style="margin-top:0">Offer & Pricing</h3>
          <div class="card-elev card mb-12">
            <div style="font-weight:700">${escapeHtml(settings.offer.core.name)}</div>
            <div class="muted" style="font-size:13px">$${settings.offer.core.setup} setup · $${settings.offer.core.monthly}/mo</div>
            <ul style="margin:8px 0 0;padding-left:18px;color:var(--text-dim);font-size:13px;line-height:1.7">
              ${settings.offer.core.includes.map(i => `<li>${escapeHtml(i)}</li>`).join('')}
            </ul>
          </div>
          <div class="card-elev card">
            <div style="font-weight:700">${escapeHtml(settings.offer.addon.name)}</div>
            <div class="muted" style="font-size:13px">$${settings.offer.addon.setup} setup · $${settings.offer.addon.monthly}/mo</div>
            <ul style="margin:8px 0 0;padding-left:18px;color:var(--text-dim);font-size:13px;line-height:1.7">
              ${settings.offer.addon.includes.map(i => `<li>${escapeHtml(i)}</li>`).join('')}
            </ul>
          </div>
          <div class="muted" style="font-size:12px;margin-top:10px">Editing offer details lives in <strong>Brain</strong> → "Current Offer" note.</div>
        </div>

        <div class="card">
          <h3 style="margin-top:0">Target Niches</h3>
          <div class="row wrap" style="gap:6px">
            ${settings.targetNiches.map(n => `<span class="badge purple">${escapeHtml(n)}</span>`).join('')}
          </div>
        </div>

        <div class="card">
          <h3 style="margin-top:0">Data</h3>
          <p class="dim" style="margin:0 0 12px">All data is stored in your browser's localStorage. Export to back it up before clearing browser data.</p>
          <div class="row gap-8 wrap">
            <button class="btn" id="btn-export">Export JSON</button>
            <button class="btn" id="btn-import">Import JSON</button>
            <button class="btn btn-danger" id="btn-reset">Reset to seed</button>
          </div>
          <input type="file" id="file-input" accept="application/json" class="hidden" />
        </div>

        <div class="card" style="grid-column: span 2">
          <h3 style="margin-top:0">Future Integrations</h3>
          <div class="grid grid-3">
            ${integration('Supabase', 'Cloud storage + multi-device sync')}
            ${integration('GoHighLevel', 'Live pipeline, contacts, automations')}
            ${integration('OpenAI / Claude', 'Real AI for Jarvis + Agents')}
            ${integration('Twilio', 'SMS sending from inside Titan HQ')}
            ${integration('Stripe', 'Billing for setup + monthly retainers')}
            ${integration('Google Business', 'Live review counts on prospects')}
          </div>
        </div>
      </div>
    `;

    root.querySelector('#save-settings').addEventListener('click', () => {
      const appName = root.querySelector('#s-appName').value.trim() || 'Titan HQ';
      const agencyName = root.querySelector('#s-agencyName').value.trim() || 'Titan Automation';
      const positioning = root.querySelector('#s-positioning').value;
      const monthlyGoal = Number(root.querySelector('#s-goal').value) || 50000;
      Store.set(s => {
        s.settings = { ...s.settings, appName, agencyName, positioning, monthlyGoal };
        return s;
      });
      toast('Settings saved');
    });

    root.querySelector('#btn-export').addEventListener('click', () => {
      const json = Store.exportJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `titan-hq-backup-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast('Export downloaded');
    });

    root.querySelector('#btn-import').addEventListener('click', () => {
      root.querySelector('#file-input').click();
    });
    root.querySelector('#file-input').addEventListener('change', async e => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        Store.importJson(text);
        toast('Data imported');
      } catch (err) {
        toast('Import failed — invalid JSON');
      }
    });

    root.querySelector('#btn-reset').addEventListener('click', () => {
      confirmDialog('This wipes everything and reloads the original seed data. Continue?', () => {
        Store.reset();
        toast('Reset to seed');
      });
    });
  };

  draw();
  return Store.subscribe(draw);
}

function integration(name, desc) {
  return `
    <div class="card-elev card">
      <div class="row between">
        <div style="font-weight:700">${escapeHtml(name)}</div>
        <span class="badge">Not connected</span>
      </div>
      <div class="muted" style="font-size:12px;margin-top:6px">${escapeHtml(desc)}</div>
    </div>
  `;
}
