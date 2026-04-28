/**
 * Pipeline — Kanban board with drag/drop between stages.
 */
import { Store, updateProspect } from '../store.js';
import { escapeHtml, fmtRelative, toast } from '../ui.js';
import { PIPELINE_STAGES, STAGE_COLOR } from '../constants.js';
import { navigate } from '../router.js';

export function renderPipeline(root) {
  const renderAll = () => {
    const s = Store.get();
    const cols = PIPELINE_STAGES.map(stage => ({
      stage,
      items: s.prospects.filter(p => (p.stage || 'New Prospect') === stage),
    }));

    root.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Pipeline</h1>
          <div class="page-subtitle">Drag prospects between stages · ${s.prospects.length} total</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" data-go="/contacts">+ Add Prospect</button>
        </div>
      </div>

      <div class="kanban">
        ${cols.map(col => `
          <div class="kanban-col" data-stage="${escapeHtml(col.stage)}">
            <h4>
              <span><span class="badge ${STAGE_COLOR[col.stage] || ''}" style="margin-right:6px">●</span>${escapeHtml(col.stage)}</span>
              <span class="count">${col.items.length}</span>
            </h4>
            ${col.items.length === 0
              ? `<div class="muted" style="font-size:12px;padding:6px 4px">— empty —</div>`
              : col.items.map(p => kanbanCard(p)).join('')
            }
          </div>
        `).join('')}
      </div>
    `;

    root.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => navigate(b.dataset.go)));

    // Drag/drop
    let dragId = null;
    root.querySelectorAll('.kanban-card').forEach(card => {
      card.addEventListener('dragstart', e => {
        dragId = card.dataset.id;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', dragId);
      });
      card.addEventListener('dragend', () => card.classList.remove('dragging'));
      card.addEventListener('click', () => navigate('/contacts?id=' + card.dataset.id));
    });

    root.querySelectorAll('.kanban-col').forEach(col => {
      col.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        col.classList.add('drag-over');
      });
      col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
      col.addEventListener('drop', e => {
        e.preventDefault();
        col.classList.remove('drag-over');
        const id = e.dataTransfer.getData('text/plain') || dragId;
        const newStage = col.dataset.stage;
        const cur = Store.get().prospects.find(p => p.id === id);
        if (cur && cur.stage !== newStage) {
          updateProspect(id, { stage: newStage });
          toast(`Moved to ${newStage}`);
        }
      });
    });
  };

  renderAll();
  return Store.subscribe(renderAll);
}

function kanbanCard(p) {
  return `
    <div class="kanban-card" draggable="true" data-id="${p.id}">
      <div class="biz">${escapeHtml(p.businessName)}</div>
      <div class="meta">${escapeHtml([p.niche, p.city].filter(Boolean).join(' · '))}</div>
      ${p.problemFound ? `<div class="meta" style="margin-top:6px">${escapeHtml(p.problemFound)}</div>` : ''}
      <div class="row">
        ${p.packageRecommended ? `<span class="badge purple">${escapeHtml(p.packageRecommended)}</span>` : ''}
        ${p.nextFollowUp ? `<span class="badge">${fmtRelative(p.nextFollowUp)}</span>` : ''}
      </div>
    </div>
  `;
}
