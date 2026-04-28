/**
 * Tasks — task list with filters, CRUD, complete, link to prospect.
 */
import { Store, addTask, updateTask, deleteTask } from '../store.js';
import { el, escapeHtml, fmtRelative, openModal, closeModal, toast, confirmDialog, todayISO, isToday, isOverdue } from '../ui.js';
import { TASK_TYPES, TASK_PRIORITIES, TASK_STATUSES } from '../constants.js';

let view = { filter: 'all', type: '', prospectId: '' };

export function renderTasks(root) {
  const draw = () => {
    const s = Store.get();
    const all = s.tasks.slice().sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));

    const matched = all.filter(t => {
      if (view.filter === 'today' && (!t.dueDate || !isToday(t.dueDate))) return false;
      if (view.filter === 'overdue' && (!(t.dueDate && isOverdue(t.dueDate) && t.status !== 'Done'))) return false;
      if (view.filter === 'open' && t.status === 'Done') return false;
      if (view.type && t.type !== view.type) return false;
      if (view.prospectId && t.prospectId !== view.prospectId) return false;
      return true;
    });

    root.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Tasks</h1>
          <div class="page-subtitle">${all.length} total · ${matched.length} shown</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" id="btn-new">+ New Task</button>
        </div>
      </div>

      <div class="toolbar">
        ${chip('All', 'all')}
        ${chip('Today', 'today')}
        ${chip('Overdue', 'overdue')}
        ${chip('Open', 'open')}
        <div style="width:1px;height:22px;background:var(--border)"></div>
        <select class="select" id="f-type">
          <option value="">Any type</option>
          ${TASK_TYPES.map(t => `<option value="${escapeHtml(t)}" ${view.type === t ? 'selected':''}>${escapeHtml(t)}</option>`).join('')}
        </select>
        <select class="select" id="f-prospect">
          <option value="">Any prospect</option>
          ${s.prospects.map(p => `<option value="${p.id}" ${view.prospectId === p.id ? 'selected':''}>${escapeHtml(p.businessName)}</option>`).join('')}
        </select>
        <button class="btn btn-ghost btn-sm" id="f-clear">Clear</button>
      </div>

      ${matched.length === 0
        ? `<div class="empty">No tasks match this filter.</div>`
        : `<div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style="width:40px"></th>
                  <th>Task</th>
                  <th>Type</th>
                  <th>Prospect</th>
                  <th>Due</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${matched.map(t => {
                  const p = s.prospects.find(pr => pr.id === t.prospectId);
                  const overdue = isOverdue(t.dueDate) && t.status !== 'Done';
                  return `
                    <tr data-id="${t.id}">
                      <td><input type="checkbox" class="t-check" ${t.status === 'Done' ? 'checked' : ''} aria-label="Mark complete" /></td>
                      <td>
                        <div style="font-weight:600;${t.status === 'Done' ? 'opacity:0.55;text-decoration:line-through' : ''}">${escapeHtml(t.title)}</div>
                        ${t.description ? `<div class="muted" style="font-size:11px">${escapeHtml(t.description)}</div>` : ''}
                      </td>
                      <td><span class="badge ${typeColor(t.type)}">${escapeHtml(t.type || '—')}</span></td>
                      <td>${p ? escapeHtml(p.businessName) : '<span class="muted">—</span>'}</td>
                      <td class="${overdue ? '' : ''}" style="${overdue ? 'color:#fca5a5' : ''}">${fmtRelative(t.dueDate)}</td>
                      <td><span class="badge ${priorityColor(t.priority)}">${escapeHtml(t.priority || '—')}</span></td>
                      <td>${escapeHtml(t.status)}</td>
                      <td><button class="btn btn-sm" data-edit>Edit</button></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>`
      }
    `;

    root.querySelector('#btn-new').addEventListener('click', () => openTaskForm());
    root.querySelectorAll('[data-chip]').forEach(c => {
      c.addEventListener('click', () => { view.filter = c.dataset.chip; draw(); });
    });
    root.querySelector('#f-type').addEventListener('change', e => { view.type = e.target.value; draw(); });
    root.querySelector('#f-prospect').addEventListener('change', e => { view.prospectId = e.target.value; draw(); });
    root.querySelector('#f-clear').addEventListener('click', () => { view = { filter: 'all', type: '', prospectId: '' }; draw(); });

    root.querySelectorAll('.t-check').forEach(chk => {
      chk.addEventListener('click', e => e.stopPropagation());
      chk.addEventListener('change', e => {
        const id = chk.closest('tr').dataset.id;
        updateTask(id, { status: chk.checked ? 'Done' : 'Open' });
        toast(chk.checked ? 'Marked done' : 'Reopened');
      });
    });
    root.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.closest('tr').dataset.id;
        const t = Store.get().tasks.find(x => x.id === id);
        if (t) openTaskForm(t);
      });
    });
  };

  draw();
  return Store.subscribe(draw);
}

function chip(label, value) {
  const active = view.filter === value;
  return `<button class="btn ${active ? 'btn-primary' : 'btn-ghost'} btn-sm" data-chip="${value}">${escapeHtml(label)}</button>`;
}

function typeColor(t) {
  return ({
    Call: 'pink', 'Follow-Up': 'blue', Audit: 'cyan', Proposal: 'purple',
    Onboarding: 'green', 'Client Work': 'amber', Content: '',
  })[t] || '';
}
function priorityColor(p) {
  return ({ High: 'red', Medium: 'amber', Low: '' })[p] || '';
}

function openTaskForm(existing = null) {
  const isEdit = !!existing;
  const t = existing || { priority: 'Medium', status: 'Open', type: 'Follow-Up', dueDate: todayISO() };
  const prospects = Store.get().prospects;

  const form = el(`
    <form id="task-form" class="form-grid">
      <div class="field" style="grid-column: span 2">
        <label>Title *</label>
        <input class="input" name="title" value="${escapeHtml(t.title || '')}" placeholder="What needs to happen?" />
      </div>
      <div class="field" style="grid-column: span 2">
        <label>Description</label>
        <textarea class="textarea" name="description" placeholder="Details, context, link...">${escapeHtml(t.description || '')}</textarea>
      </div>
      <div class="field">
        <label>Related prospect</label>
        <select class="select" name="prospectId">
          <option value="">— None —</option>
          ${prospects.map(p => `<option value="${p.id}" ${t.prospectId === p.id ? 'selected':''}>${escapeHtml(p.businessName)}</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label>Type</label>
        <select class="select" name="type">
          ${TASK_TYPES.map(x => `<option value="${escapeHtml(x)}" ${t.type === x ? 'selected':''}>${escapeHtml(x)}</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label>Due date</label>
        <input class="input" name="dueDate" type="date" value="${escapeHtml(t.dueDate || '')}" />
      </div>
      <div class="field">
        <label>Priority</label>
        <select class="select" name="priority">
          ${TASK_PRIORITIES.map(p => `<option value="${escapeHtml(p)}" ${t.priority === p ? 'selected':''}>${escapeHtml(p)}</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label>Status</label>
        <select class="select" name="status">
          ${TASK_STATUSES.map(p => `<option value="${escapeHtml(p)}" ${t.status === p ? 'selected':''}>${escapeHtml(p)}</option>`).join('')}
        </select>
      </div>
    </form>
  `);

  openModal({
    title: isEdit ? 'Edit Task' : 'New Task',
    body: form,
    footer: `
      ${isEdit ? '<button class="btn btn-danger" id="del-task">Delete</button>' : ''}
      <button class="btn btn-ghost" data-close>Cancel</button>
      <button class="btn btn-primary" id="save-task">${isEdit ? 'Save' : 'Add Task'}</button>
    `,
  });

  document.querySelector('#save-task').addEventListener('click', () => {
    const data = Object.fromEntries(new FormData(form));
    if (!data.title.trim()) { toast('Title required'); return; }
    if (isEdit) { updateTask(existing.id, data); toast('Task updated'); }
    else { addTask(data); toast('Task created'); }
    closeModal();
  });
  if (isEdit) {
    document.querySelector('#del-task').addEventListener('click', () => {
      confirmDialog(`Delete task "${existing.title}"?`, () => {
        deleteTask(existing.id);
        closeModal();
        toast('Task deleted');
      });
    });
  }
}
