/**
 * Contacts / Prospects — CRM table, filters, search, full detail view.
 */
import { Store, addProspect, updateProspect, deleteProspect, todayISO } from '../store.js';
import { el, escapeHtml, fmtDate, fmtRelative, openModal, closeModal, toast, confirmDialog } from '../ui.js';
import { PIPELINE_STAGES, STAGE_COLOR, AUDIT_STATUSES, NICHES } from '../constants.js';
import { navigate } from '../router.js';

let view = { search: '', niche: '', city: '', audit: '' };

export function renderContacts(root, params = {}) {
  const renderAll = () => {
    const s = Store.get();
    const filtered = s.prospects.filter(p => {
      const search = view.search.trim().toLowerCase();
      if (search && !(p.businessName || '').toLowerCase().includes(search)
                 && !(p.ownerName || '').toLowerCase().includes(search)) return false;
      if (view.niche && p.niche !== view.niche) return false;
      if (view.city && (p.city || '').toLowerCase() !== view.city.toLowerCase()) return false;
      if (view.audit && p.auditStatus !== view.audit) return false;
      return true;
    });

    const cities = [...new Set(s.prospects.map(p => p.city).filter(Boolean))].sort();

    root.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Contacts</h1>
          <div class="page-subtitle">${s.prospects.length} prospects · ${filtered.length} shown</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" id="btn-new">+ Add Prospect</button>
        </div>
      </div>

      <div class="toolbar">
        <input class="input" id="f-search" placeholder="Search business or owner..." value="${escapeHtml(view.search)}" style="min-width:220px;flex:1" />
        <select class="select" id="f-niche">
          <option value="">All niches</option>
          ${NICHES.map(n => `<option value="${escapeHtml(n)}" ${view.niche === n ? 'selected' : ''}>${escapeHtml(n)}</option>`).join('')}
        </select>
        <select class="select" id="f-city">
          <option value="">All cities</option>
          ${cities.map(c => `<option value="${escapeHtml(c)}" ${view.city === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
        </select>
        <select class="select" id="f-audit">
          <option value="">Any audit status</option>
          ${AUDIT_STATUSES.map(a => `<option value="${escapeHtml(a)}" ${view.audit === a ? 'selected' : ''}>${escapeHtml(a)}</option>`).join('')}
        </select>
        <button class="btn btn-ghost btn-sm" id="f-clear">Clear</button>
      </div>

      ${filtered.length === 0
        ? `<div class="empty">No prospects match these filters. Try clearing or adding a new prospect.</div>`
        : `<div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Business</th><th>Niche</th><th>Location</th><th>Stage</th>
                  <th>Audit</th><th>Reviews</th><th>Next follow-up</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(p => `
                  <tr data-id="${p.id}">
                    <td>
                      <strong>${escapeHtml(p.businessName)}</strong>
                      <div class="muted" style="font-size:11px">${escapeHtml(p.ownerName || '')}</div>
                    </td>
                    <td>${escapeHtml(p.niche || '—')}</td>
                    <td>${escapeHtml([p.city, p.state].filter(Boolean).join(', ') || '—')}</td>
                    <td><span class="badge ${STAGE_COLOR[p.stage] || ''}">${escapeHtml(p.stage || '—')}</span></td>
                    <td>${escapeHtml(p.auditStatus || '—')}</td>
                    <td>${p.googleReviews ?? '—'}</td>
                    <td>${fmtRelative(p.nextFollowUp)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>`
      }
    `;

    root.querySelector('#btn-new').addEventListener('click', () => openProspectForm());
    root.querySelector('#f-search').addEventListener('input', e => { view.search = e.target.value; renderAll(); });
    root.querySelector('#f-niche').addEventListener('change', e => { view.niche = e.target.value; renderAll(); });
    root.querySelector('#f-city').addEventListener('change', e => { view.city = e.target.value; renderAll(); });
    root.querySelector('#f-audit').addEventListener('change', e => { view.audit = e.target.value; renderAll(); });
    root.querySelector('#f-clear').addEventListener('click', () => { view = { search:'', niche:'', city:'', audit:'' }; renderAll(); });

    root.querySelectorAll('tbody tr').forEach(tr => {
      tr.addEventListener('click', () => openProspectDetail(tr.dataset.id));
    });

    // Keep search focused after re-render
    if (document.activeElement?.id === 'f-search') {
      const inp = root.querySelector('#f-search');
      inp.focus();
      inp.setSelectionRange(inp.value.length, inp.value.length);
    }
  };

  renderAll();
  const off = Store.subscribe(renderAll);

  // Deep link: open a specific prospect
  if (params.id) {
    queueMicrotask(() => openProspectDetail(params.id));
  }

  return off;
}

// ---------------- Detail view ----------------
function openProspectDetail(id) {
  const p = Store.get().prospects.find(x => x.id === id);
  if (!p) return;

  const body = el(`
    <div>
      <div class="grid grid-2 mb-12">
        <div>
          <div class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em">Business</div>
          <div style="font-size:18px;font-weight:700">${escapeHtml(p.businessName)}</div>
          <div class="muted">${escapeHtml(p.ownerName || '')}</div>
        </div>
        <div>
          <div class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em">Stage</div>
          <span class="badge ${STAGE_COLOR[p.stage] || ''}">${escapeHtml(p.stage || '—')}</span>
        </div>
      </div>

      <div class="grid grid-2 mb-12">
        ${kv('Phone', p.phone)}
        ${kv('Email', p.email)}
        ${kv('Website', p.website)}
        ${kv('Niche', p.niche)}
        ${kv('City', [p.city, p.state].filter(Boolean).join(', '))}
        ${kv('Google Reviews', p.googleReviews)}
        ${kv('Website Status', p.websiteStatus)}
        ${kv('Audit Status', p.auditStatus)}
        ${kv('Last Contacted', fmtDate(p.lastContacted))}
        ${kv('Next Follow-up', fmtDate(p.nextFollowUp))}
        ${kv('Package Recommended', p.packageRecommended)}
      </div>

      <div class="card-elev card mb-12">
        <h3 style="margin-top:0">Problem Found</h3>
        <div>${escapeHtml(p.problemFound || '—')}</div>
      </div>

      <div class="card-elev card">
        <h3 style="margin-top:0">Notes</h3>
        <div style="white-space:pre-wrap">${escapeHtml(p.notes || '—')}</div>
      </div>
    </div>
  `);

  openModal({
    title: p.businessName,
    body,
    footer: `
      <button class="btn btn-danger" data-del>Delete</button>
      <button class="btn" data-go-studio>Open in Studio</button>
      <button class="btn btn-ghost" data-close>Close</button>
      <button class="btn btn-primary" data-edit>Edit</button>
    `,
  });

  document.querySelector('[data-edit]')?.addEventListener('click', () => { closeModal(); openProspectForm(p); });
  document.querySelector('[data-del]')?.addEventListener('click', () => {
    confirmDialog(`Delete ${p.businessName}? Related tasks will also be removed.`, () => {
      deleteProspect(p.id);
      closeModal();
      toast('Prospect deleted');
    });
  });
  document.querySelector('[data-go-studio]')?.addEventListener('click', () => {
    closeModal();
    navigate('/studio?prospect=' + p.id);
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

// ---------------- Add / Edit form ----------------
function openProspectForm(existing = null) {
  const isEdit = !!existing;
  const p = existing || { stage: 'New Prospect', auditStatus: 'Needed' };

  const form = el(`
    <form id="prospect-form" class="form-grid">
      ${input('businessName', 'Business name *', p.businessName, 'Crystal Shine Detailing')}
      ${input('ownerName', 'Owner name', p.ownerName, 'Marcus Hall')}
      ${input('phone', 'Phone', p.phone, '(555) 123-4567')}
      ${input('email', 'Email', p.email, 'owner@business.com', 'email')}
      ${input('website', 'Website', p.website, 'business.com')}
      ${selectField('niche', 'Niche', p.niche, NICHES)}
      ${input('city', 'City', p.city, 'Austin')}
      ${input('state', 'State', p.state, 'TX')}
      ${input('googleReviews', 'Google review count', p.googleReviews, '0', 'number')}
      ${input('websiteStatus', 'Current website status', p.websiteStatus, 'Outdated / OK / Modern / None')}
      ${selectField('auditStatus', 'Audit status', p.auditStatus, AUDIT_STATUSES)}
      ${selectField('stage', 'Pipeline stage', p.stage, PIPELINE_STAGES)}
      ${input('lastContacted', 'Last contacted', p.lastContacted, '', 'date')}
      ${input('nextFollowUp', 'Next follow-up', p.nextFollowUp, '', 'date')}
      ${input('packageRecommended', 'Package recommended', p.packageRecommended, 'Core / Core + AI Voice')}
      <div class="field" style="grid-column: span 2">
        <label>Problem found</label>
        <textarea name="problemFound" class="textarea" placeholder="What's leaking in their funnel?">${escapeHtml(p.problemFound || '')}</textarea>
      </div>
      <div class="field" style="grid-column: span 2">
        <label>Notes</label>
        <textarea name="notes" class="textarea" placeholder="Anything that helps you sell or remember">${escapeHtml(p.notes || '')}</textarea>
      </div>
    </form>
  `);

  openModal({
    title: isEdit ? 'Edit Prospect' : 'Add Prospect',
    body: form,
    footer: `
      <button class="btn btn-ghost" data-close>Cancel</button>
      <button class="btn btn-primary" id="save-prospect">${isEdit ? 'Save Changes' : 'Add Prospect'}</button>
    `,
  });

  document.querySelector('#save-prospect').addEventListener('click', () => {
    const data = Object.fromEntries(new FormData(form));
    if (!data.businessName || !data.businessName.trim()) {
      toast('Business name is required');
      return;
    }
    if (data.googleReviews) data.googleReviews = Number(data.googleReviews);
    if (isEdit) {
      updateProspect(existing.id, data);
      toast('Prospect updated');
    } else {
      addProspect(data);
      toast('Prospect added');
    }
    closeModal();
  });
}

function input(name, label, value = '', placeholder = '', type = 'text') {
  return `
    <div class="field">
      <label>${escapeHtml(label)}</label>
      <input class="input" name="${name}" type="${type}" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(value ?? '')}" />
    </div>
  `;
}

function selectField(name, label, value, options) {
  return `
    <div class="field">
      <label>${escapeHtml(label)}</label>
      <select class="select" name="${name}">
        <option value="">—</option>
        ${options.map(o => `<option value="${escapeHtml(o)}" ${value === o ? 'selected' : ''}>${escapeHtml(o)}</option>`).join('')}
      </select>
    </div>
  `;
}
