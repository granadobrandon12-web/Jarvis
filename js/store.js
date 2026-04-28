/**
 * Titan HQ — Local Storage Store
 * Single source of truth for all app data. Persists to localStorage.
 * Pub/sub so pages can re-render when data changes.
 */

import { seed } from './seed.js';

const KEY = 'titan_hq_v1';

let state = null;
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Store: failed to load, reseeding', e);
  }
  return structuredClone(seed);
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Store: failed to persist', e);
  }
}

function notify() {
  listeners.forEach(fn => {
    try { fn(state); } catch (e) { console.error(e); }
  });
}

export const Store = {
  init() {
    state = load();
    return state;
  },
  get() {
    if (!state) state = load();
    return state;
  },
  set(updater) {
    const next = typeof updater === 'function' ? updater(structuredClone(state)) : updater;
    state = next;
    persist();
    notify();
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  reset() {
    state = structuredClone(seed);
    persist();
    notify();
  },
  exportJson() {
    return JSON.stringify(state, null, 2);
  },
  importJson(json) {
    const parsed = JSON.parse(json);
    state = parsed;
    persist();
    notify();
  },
};

// ---------------- Helpers ----------------
export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export const todayISO = () => new Date().toISOString().slice(0, 10);

// ---------------- Prospect helpers ----------------
export function addProspect(p) {
  Store.set(s => {
    s.prospects.unshift({
      id: uid(),
      createdAt: new Date().toISOString(),
      stage: 'New Prospect',
      ...p,
    });
    return s;
  });
}
export function updateProspect(id, patch) {
  Store.set(s => {
    const i = s.prospects.findIndex(p => p.id === id);
    if (i >= 0) s.prospects[i] = { ...s.prospects[i], ...patch };
    return s;
  });
}
export function deleteProspect(id) {
  Store.set(s => {
    s.prospects = s.prospects.filter(p => p.id !== id);
    s.tasks = s.tasks.filter(t => t.prospectId !== id);
    return s;
  });
}

// ---------------- Task helpers ----------------
export function addTask(t) {
  Store.set(s => {
    s.tasks.unshift({
      id: uid(),
      createdAt: new Date().toISOString(),
      status: 'Open',
      ...t,
    });
    return s;
  });
}
export function updateTask(id, patch) {
  Store.set(s => {
    const i = s.tasks.findIndex(t => t.id === id);
    if (i >= 0) s.tasks[i] = { ...s.tasks[i], ...patch };
    return s;
  });
}
export function deleteTask(id) {
  Store.set(s => {
    s.tasks = s.tasks.filter(t => t.id !== id);
    return s;
  });
}

// ---------------- Client helpers ----------------
export function addClient(c) {
  Store.set(s => {
    s.clients.unshift({ id: uid(), createdAt: new Date().toISOString(), ...c });
    return s;
  });
}
export function updateClient(id, patch) {
  Store.set(s => {
    const i = s.clients.findIndex(c => c.id === id);
    if (i >= 0) s.clients[i] = { ...s.clients[i], ...patch };
    return s;
  });
}
export function deleteClient(id) {
  Store.set(s => {
    s.clients = s.clients.filter(c => c.id !== id);
    return s;
  });
}

// ---------------- Brain notes ----------------
export function addNote(n) {
  Store.set(s => {
    s.notes.unshift({ id: uid(), updatedAt: new Date().toISOString(), ...n });
    return s;
  });
}
export function updateNote(id, patch) {
  Store.set(s => {
    const i = s.notes.findIndex(n => n.id === id);
    if (i >= 0) s.notes[i] = { ...s.notes[i], ...patch, updatedAt: new Date().toISOString() };
    return s;
  });
}
export function deleteNote(id) {
  Store.set(s => {
    s.notes = s.notes.filter(n => n.id !== id);
    return s;
  });
}
