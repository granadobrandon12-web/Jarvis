/**
 * Brain — knowledge base. Add, edit, delete, save notes by category.
 */
import { Store, addNote, updateNote, deleteNote } from '../store.js';
import { escapeHtml, toast, confirmDialog, fmtDate } from '../ui.js';

const CATEGORIES = ['Offer', 'Pricing', 'Niches', 'Scripts', 'Objections', 'SOPs', 'Onboarding', 'Reports', 'Content', 'General'];

export function renderBrain(root) {
  let activeId = null;
  let editing = false;

  const draw = () => {
    const s = Store.get();
    const notes = s.notes;
    if (!activeId && notes[0]) activeId = notes[0].id;
    const active = notes.find(n => n.id === activeId);

    root.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Brain</h1>
          <div class="page-subtitle">Your agency's knowledge base · ${notes.length} notes</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" id="btn-new">+ New Note</button>
        </div>
      </div>

      <div class="brain-grid">
        <div>
          <div class="section-title">Notes</div>
          <div class="brain-list">
            ${notes.map(n => `
              <div class="brain-item ${n.id === activeId ? 'active' : ''}" data-id="${n.id}">
                <div class="ttl">${escapeHtml(n.title)}</div>
                <div class="preview">${escapeHtml(n.category || 'General')} · ${escapeHtml((n.body || '').slice(0, 60))}</div>
              </div>
            `).join('') || '<div class="empty">No notes yet</div>'}
          </div>
        </div>

        <div>
          ${active ? activeView(active, editing) : `<div class="empty">Select or create a note</div>`}
        </div>
      </div>
    `;

    root.querySelectorAll('.brain-item').forEach(item => {
      item.addEventListener('click', () => { activeId = item.dataset.id; editing = false; draw(); });
    });
    root.querySelector('#btn-new').addEventListener('click', () => {
      addNote({ category: 'General', title: 'New Note', body: '' });
      // addNote unshifts to the top — grab it
      activeId = Store.get().notes[0].id;
      editing = true;
      draw();
    });

    if (active && editing) {
      const form = root.querySelector('#note-form');
      root.querySelector('#save-note').addEventListener('click', () => {
        const data = Object.fromEntries(new FormData(form));
        if (!data.title.trim()) { toast('Title required'); return; }
        updateNote(active.id, data);
        editing = false;
        toast('Saved');
        draw();
      });
      root.querySelector('#cancel-edit').addEventListener('click', () => { editing = false; draw(); });
    } else if (active) {
      root.querySelector('#edit-note')?.addEventListener('click', () => { editing = true; draw(); });
      root.querySelector('#del-note')?.addEventListener('click', () => {
        confirmDialog(`Delete "${active.title}"?`, () => {
          deleteNote(active.id);
          activeId = null;
          editing = false;
          toast('Deleted');
          draw();
        });
      });
    }
  };

  draw();
  return Store.subscribe(() => draw());
}

function activeView(n, editing) {
  if (editing) {
    return `
      <form id="note-form" class="card">
        <div class="form-grid">
          <div class="field" style="grid-column: span 2">
            <label>Title</label>
            <input class="input" name="title" value="${escapeHtml(n.title || '')}" placeholder="Title" />
          </div>
          <div class="field">
            <label>Category</label>
            <select class="select" name="category">
              ${CATEGORIES.map(c => `<option value="${escapeHtml(c)}" ${n.category === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
            </select>
          </div>
          <div class="field" style="grid-column: span 2">
            <label>Body</label>
            <textarea class="textarea" name="body" style="min-height:280px">${escapeHtml(n.body || '')}</textarea>
          </div>
        </div>
        <div class="row mt-12" style="justify-content:flex-end;gap:8px">
          <button type="button" class="btn btn-ghost" id="cancel-edit">Cancel</button>
          <button type="button" class="btn btn-primary" id="save-note">Save</button>
        </div>
      </form>
    `;
  }
  return `
    <div class="card">
      <div class="card-row mb-12">
        <div>
          <span class="badge purple">${escapeHtml(n.category || 'General')}</span>
          <h2 style="margin:6px 0 0;font-size:20px">${escapeHtml(n.title)}</h2>
          <div class="muted" style="font-size:11px">Updated ${fmtDate(n.updatedAt)}</div>
        </div>
        <div class="row gap-8">
          <button class="btn btn-sm" id="edit-note">Edit</button>
          <button class="btn btn-sm btn-danger" id="del-note">Delete</button>
        </div>
      </div>
      <pre style="white-space:pre-wrap;font-family:inherit;line-height:1.6;font-size:14px;margin:0;color:var(--text)">${escapeHtml(n.body || '')}</pre>
    </div>
  `;
}
