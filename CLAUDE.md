# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An offline-first mobile web app for **RAM Handling** (Royal Air Maroc ground handling) airport quality control. It is **multi-task**: a left **sidebar** lists several control plans ("tâches de contrôle"), each its own page. A control agent runs one **shared session** (vacation) and logs infractions/anomalies per task, then exports a report per task. UI and output are in **French**.

Current tasks (in `CONTROL_PLANS`): Circulation (id `ss-piste`, the original), Contrôle engins, Contrôle EPI, Contrôle mise pick-up, Contrôle zones, Contrôle cales/cônes. **Tasks 2–6 ship with starter field/category configs meant to be refined** with real terminology.

## Files

- [index.html](index.html) — markup + all CSS (themes, sidebar, layout). Loads the logic via `<script src="app.js?v=N">`.
- [app.js](app.js) — all JavaScript: the `CONTROL_PLANS` config and the whole app.

**Why JS is external, not inline:** an inline `<script>` was mis-decoded by Live Server (emoji/em-dash bytes in template literals broke a backtick → `Unexpected end of input`). External `.js` is decoded as UTF-8 by the browser regardless of how the page is served. Keep the logic in `app.js`. The `?v=N` on the script tag is a cache-buster — **bump N** when you change app.js and the browser seems to serve a stale copy. There is also a tiny build-marker `<script>` near `<body>` that logs the build id; bump it when you want to confirm a fresh load.

Note: Node and the browser (Edge/Chrome) share the V8 engine, so `node --check app.js` (or `new vm.Script`) is an exact parse check for the browser. If node accepts it but the browser throws a parse error, the browser is serving different bytes (cache/encoding), not invalid code.

## Running / developing

No build step, package manager, dependencies, or tests. Serve the folder (don't rely on `file://` for everything):

```bash
python -m http.server 8000   # then open http://localhost:8000
```

Phone-first; the sidebar is a drawer on mobile (hamburger ☰ + backdrop) and **permanent** at `min-width: 900px` (content gets `margin-left: 280px`).

## Architecture — data-driven, config per task

Adding a task = adding one object to `CONTROL_PLANS` in [app.js](app.js); no other code changes. Everything (form fields, chips, badges, colors, stats, reports, sidebar entry) is generated from that config. The field/category schema is documented in the comment block atop `CONTROL_PLANS` — read it before editing.

- A field's **`role`** (`primary`/`meta`/`description`/`context`/`action`/`note`) drives how it renders in cards, stats, and reports, independent of which form section it sits in (code looks fields up via `fieldsByRole`). `primary` is the card title and the grouping key for the "par …" stats. The `autofillTarget` field is pre-filled from a chosen category's `autofill` text.
- A category is `{ id, label, emoji, color (hex), autofill }`. Chip/badge/stat colors are computed at runtime from `color` via `rgba()`/`textOn()` — there are no per-category CSS classes. `records[].category` stores the category **id**.

## State & persistence

- Globals: `currentPlan` (active config object), `session` (shared), `records` (current task's), `selectedCategoryId`.
- The **session is shared across all tasks**; records are **per task**. localStorage keys: `ssqc:session` (global), `ssqc:{planId}:records`, `ssqc:lastPlan`, `ssqc:theme`. Helpers: `kSession`, `kRecords(id)`, `kLastPlan`, `kTheme`.
- `migrate()` chains old layouts forward: v1 fixed keys (`ssPisteSession`/`ssPisteRecords`) → `ssqc:ss-piste:*`, then per-plan session → the shared `ssqc:session`. Leave it in place.
- After mutating `records` you must call the matching `saveRecords()` **and** re-render (`updateRecordCount`, `renderNav`, plus `renderRecords`/`renderStats` if visible) — there is no reactivity.

## App flow

`init()` applies the theme, then if `ssqc:session` exists → `startApp()` (shows sidebar + `#appMain`, opens `lastPlan` or the first task); otherwise the setup overlay collects agent/date/vacation once, and `startSession()` proceeds. `openPlan(id)` loads that task's records, rebuilds the form, and refreshes the banner/sidebar. The sidebar (`renderNav`) lists tasks with live counts; `switchPlan` changes task. `newSession()` clears the shared session **and every task's records**, returning to setup.

Screens within a task: `saisie`, `liste`, `stats`, `rapport` via `showTab(name)` — its tab-to-index `map` must stay in sync with the `.tab-btn` order. Theme toggle (`toggleTheme`/`applyTheme`) flips `html[data-theme]` (CSS vars do the rest) and persists to `ssqc:theme`; all `.theme-btn` buttons are updated together (don't reintroduce a duplicate `id`).

## Rendering & export

UI is template-literal + `innerHTML`; route every config/user value through `esc()`. `buildReportText()` (copy / Web Share / WhatsApp), `printReport()` (standalone HTML to a print window), and `exportCSV()` all iterate `allFields()` + category + time, so they adapt to each task automatically.

## Conventions

- French strings and output throughout.
- Inline `onclick="…"` handlers are the wiring pattern; functions live in app.js at top level.
- Stored text fields flagged `uppercase` are upper-cased on save.
