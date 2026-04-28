/**
 * Clients — closed-won client management.
 */
import { Store, addClient, updateClient, deleteClient } from '../store.js';
import { el, escapeHtml, fmtMoney, fmtDate, openModal, closeModal, toast, confirmDialog, todayISO } from '../ui.js';

export function renderClients(root) {
  const draw = () => {
    const s = Store.get();
    const totalMrr = s.clients.reduce((sum, c) => sum + (Number(c.monthlyRetainer) || 0), 0);
    const totalSetup = s.clients.reduce((sum, c) => sum + (Number(c.setupFee) || 0), 0);

    root.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Clients</h1>
          <div class="page-subtitle">${s.clients.length} active · ${fmtMoney(totalMrr)} MRR · ${fmtMoney(totalSetup)} lifetime setup</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" id="btn-new">+ Add Client</button>
        </div>
      </div>

      <div class="grid grid-3">
        ${s.clients.length === 0
          ? `<div class="empty" style="grid-column: 1 / -1">No clients yet. Close some deals!</div>`
          : s.clients.map(c => clientCard(c)).join('')
        }
      </div>
    `;

    root.querySelector('#btn-new').addEventListener('click', () => openClientForm());
    root.querySelectorAll('[data-id]').forEach(card => {
      card.addEventListener('click', () => {
        const c = Store.get().clients.find(x => x.id === card.dataset.id);
        if (c) openClientDetail(c);
      });
    });
  };

  draw();
  return Store.subscribe(draw);
}

function clientCard(c) {
  return `
    <div class="card" data-id="${c.id}" style="cursor:pointer">
      <div class="card-row">
        <div>
          <div style="font-weight:700;font-size:16px">${escapeHtml(c.businessName)}</div>
          <div class="muted" style="font-size:12px">${escapeHtml(c.ownerName || '')}</div>
        </div>
        <span class="badge purple">${escapeHtml(c.package || '—')}</span>
      </div>
      <div class="row mt-12 wrap" style="gap:6px">
        <span class="badge ${statusColor(c.websiteStatus)}">Site: ${escapeHtml(c.websiteStatus || '—')}</span>
        <span class="badge ${statusColor(c.ghlStatus)}">GHL: ${escapeHtml(c.ghlStatus || '—')}</span>
        <span class="badge ${statusColor(c.reviewAutoStatus)}">Reviews: ${escapeHtml(c.reviewAutoStatus || '—')}</span>
        <span class="badge ${statusColor(c.mctbStatus)}">MCTB: ${escapeHtml(c.mctbStatus || '—')}</span>
      </div>
      <div class="row between mt-12">
        <div>
          <div class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em">MRR</div>
          <div style="font-weight:700">${fmtMoney(c.monthlyRetainer)}</div>
        </div>
        <div>
          <div class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em">Started</div>
          <div>${fmtDate(c.startDate)}</div>
        </div>
      </div>
    </div>
  `;
}

function statusColor(s) {
  if (!s) return '';
  const v = s.toLowerCase();
  if (v.includes('live') || v.includes('on track') || v.includes('sent')) return 'green';
  if (v.includes('progress') || v.includes('pending')) return 'amber';
  return '';
}

function openClientDetail(c) {
  openModal({
    title: c.businessName,
    body: `
      <div class="grid grid-2 mb-12">
        ${kv('Owner', c.ownerName)}
        ${kv('Package', c.package)}
        ${kv('Monthly Retainer', fmtMoney(c.monthlyRetainer))}
        ${kv('Setup Fee', fmtMoney(c.setupFee))}
        ${kv('Start Date', fmtDate(c.startDate))}
        ${kv('Services', c.services)}
      </div>
      <div class="grid grid-2 mb-12">
        ${kv('Website Status', c.websiteStatus)}
        ${kv('GHL Status', c.ghlStatus)}
        ${kv('Review Automation', c.reviewAutoStatus)}
        ${kv('Missed Call Text Back', c.mctbStatus)}
        ${kv('Monthly Report Status', c.monthlyReportStatus)}
      </div>
      <div class="card-elev card">
        <h3 style="margin-top:0">Notes</h3>
        <div style="white-space:pre-wrap">${escapeHtml(c.notes || '—')}</div>
      </div>
    `,
    footer: `
      <button class="btn btn-danger" id="del-client">Delete</button>
      <button class="btn btn-ghost" data-close>Close</button>
      <button class="btn btn-primary" id="edit-client">Edit</button>
    `,
  });
  document.querySelector('#edit-client').addEventListener('click', () => { closeModal(); openClientForm(c); });
  document.querySelector('#del-client').addEventListener('click', () => {
    confirmDialog(`Delete ${c.businessName}? This cannot be undone.`, () => {
      deleteClient(c.id);
      closeModal();
      toast('Client deleted');
    });
  });
}

function kv(k, v) {
  return `
    <div>
      <div class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em">${escapeHtml(k)}</div>
      <div>${escapeHtml(v == null || v === '' ? '—' : String(v))}</div>
    </div>
  `;
}

function openClientForm(existing = null) {
  const isEdit = !!existing;
  const c = existing || {
    package: 'Core', monthlyRetainer: 400, setupFee: 1200,
    startDate: todayISO(),
    websiteStatus: 'In Progress', ghlStatus: 'In Progress',
    reviewAutoStatus: 'In Progress', mctbStatus: 'In Progress',
    monthlyReportStatus: 'Pending',
  };

  const form = el(`
    <form id="client-form" class="form-grid">
      ${input('businessName', 'Business name *', c.businessName)}
      ${input('ownerName', 'Owner name', c.ownerName)}
      <div class="field">
        <label>Package</label>
        <select class="select" name="package">
          ${['Core', 'Core + AI Voice', 'Custom'].map(p => `<option value="${p}" ${c.package === p ? 'selected':''}>${p}</option>`).join('')}
        </select>
      </div>
      ${input('monthlyRetainer', 'Monthly retainer', c.monthlyRetainer, '400', 'number')}
      ${input('setupFee', 'Setup fee', c.setupFee, '1200', 'number')}
      ${input('startDate', 'Start date', c.startDate, '', 'date')}
      <div class="field" style="grid-column: span 2">
        <label>Services included</label>
        <input class="input" name="services" value="${escapeHtml(c.services || '')}" placeholder="Website, MCTB, Reviews Auto, Lead Follow-up..." />
      </div>
      ${statusSelect('websiteStatus', 'Website status', c.websiteStatus)}
      ${statusSelect('ghlStatus', 'GHL status', c.ghlStatus)}
      ${statusSelect('reviewAutoStatus', 'Review automation status', c.reviewAutoStatus)}
      ${statusSelect('mctbStatus', 'Missed call text back status', c.mctbStatus)}
      ${input('monthlyReportStatus', 'Monthly report status', c.monthlyReportStatus, 'Pending / Sent / On track')}
      <div class="field" style="grid-column: span 2">
        <label>Notes</label>
        <textarea class="textarea" name="notes">${escapeHtml(c.notes || '')}</textarea>
      </div>
    </form>
  `);

  openModal({
    title: isEdit ? 'Edit Client' : 'Add Client',
    body: form,
    footer: `
      <button class="btn btn-ghost" data-close>Cancel</button>
      <button class="btn btn-primary" id="save-client">${isEdit ? 'Save' : 'Add Client'}</button>
    `,
  });

  document.querySelector('#save-client').addEventListener('click', () => {
    const data = Object.fromEntries(new FormData(form));
    if (!data.businessName.trim()) { toast('Business name required'); return; }
    data.monthlyRetainer = Number(data.monthlyRetainer) || 0;
    data.setupFee = Number(data.setupFee) || 0;
    if (isEdit) { updateClient(existing.id, data); toast('Client updated'); }
    else { addClient(data); toast('Client added'); }
    closeModal();
  });
}

function input(name, label, value = '', placeholder = '', type = 'text') {
  return `
    <div class="field">
      <label>${escapeHtml(label)}</label>
      <input class="input" name="${name}" type="${type}" value="${escapeHtml(value ?? '')}" placeholder="${escapeHtml(placeholder)}" />
    </div>
  `;
}

function statusSelect(name, label, value) {
  const opts = ['Not Started', 'In Progress', 'Live', 'Paused'];
  return `
    <div class="field">
      <label>${escapeHtml(label)}</label>
      <select class="select" name="${name}">
        ${opts.map(o => `<option value="${o}" ${value === o ? 'selected':''}>${o}</option>`).join('')}
      </select>
    </div>
  `;
}
