/**
 * Studio — template-based generators (cold call scripts, audits, proposals, content).
 */
import { GENERATORS, getGenerator } from '../generators/templates.js';
import { Store } from '../store.js';
import { escapeHtml, toast } from '../ui.js';

export function renderStudio(root, params = {}) {
  const initialId = params.gen || 'cold-call';
  let activeId = GENERATORS.find(g => g.id === initialId) ? initialId : 'cold-call';
  let lastOutput = '';

  // Optional: prefill from a prospect
  const prospectId = params.prospect;
  const prospect = prospectId ? Store.get().prospects.find(p => p.id === prospectId) : null;

  const draw = () => {
    const g = getGenerator(activeId);
    root.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Studio</h1>
          <div class="page-subtitle">Generate scripts, audits, proposals, and content</div>
        </div>
      </div>

      <div class="studio-grid">
        <div>
          <div class="section-title">Generators</div>
          <div class="studio-list">
            ${GENERATORS.map(item => `
              <div class="studio-item ${item.id === activeId ? 'active' : ''}" data-id="${item.id}">
                <span class="dot"></span>
                <span>${escapeHtml(item.label)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div>
          <div class="card mb-12">
            <div class="card-row mb-12">
              <div>
                <h3 style="margin:0">${escapeHtml(g.label)}</h3>
                <div class="muted" style="font-size:13px">${escapeHtml(g.description)}</div>
              </div>
              <button class="btn btn-primary" id="generate-btn">Generate</button>
            </div>
            <form id="gen-form" class="form-grid">
              ${g.fields.map(f => `
                <div class="field">
                  <label>${escapeHtml(f.label)}</label>
                  <input class="input" name="${f.key}" placeholder="${escapeHtml(f.placeholder || '')}" value="${escapeHtml(prefill(f.key, prospect))}" />
                </div>
              `).join('')}
            </form>
          </div>

          <div class="card">
            <div class="card-row mb-12">
              <h3 style="margin:0">Output</h3>
              <div class="row gap-8">
                <button class="btn btn-sm" id="copy-btn">Copy</button>
                <button class="btn btn-sm btn-ghost" id="clear-btn">Clear</button>
              </div>
            </div>
            <pre class="studio-output" id="output">${escapeHtml(lastOutput) || 'Fill in the fields and click Generate.'}</pre>
          </div>
        </div>
      </div>
    `;

    root.querySelectorAll('.studio-item').forEach(item => {
      item.addEventListener('click', () => { activeId = item.dataset.id; lastOutput = ''; draw(); });
    });

    const form = root.querySelector('#gen-form');
    root.querySelector('#generate-btn').addEventListener('click', () => {
      const values = Object.fromEntries(new FormData(form));
      lastOutput = g.render(values);
      root.querySelector('#output').textContent = lastOutput;
      toast('Generated');
    });
    root.querySelector('#copy-btn').addEventListener('click', async () => {
      const text = root.querySelector('#output').textContent;
      if (!text || text === 'Fill in the fields and click Generate.') {
        toast('Nothing to copy yet');
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        toast('Copied to clipboard');
      } catch {
        toast('Copy failed — select and copy manually');
      }
    });
    root.querySelector('#clear-btn').addEventListener('click', () => {
      form.reset();
      lastOutput = '';
      root.querySelector('#output').textContent = 'Fill in the fields and click Generate.';
    });
  };

  draw();
}

function prefill(key, prospect) {
  if (!prospect) return '';
  const map = {
    businessName: prospect.businessName,
    ownerName:    prospect.ownerName,
    niche:        prospect.niche,
    website:      prospect.website,
    problem:      prospect.problemFound,
    problems:     prospect.problemFound,
    reviews:      prospect.googleReviews,
    package:      prospect.packageRecommended,
  };
  return map[key] != null ? String(map[key]) : '';
}
