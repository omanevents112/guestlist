# AGENTS.md — House rules for Codex and bots

This repo is the OmanEvents guest list page: static HTML/CSS/JS served by GitHub Pages at https://omanevents112.github.io/guestlist/, with a Google Apps Script backend in `apps-script/Code.gs`. It is the shared workspace between Codex (run locally by Mohammed) and the Oman Events bots (GitKeeper, WebMaster). Follow these rules on every session.

## Start of every session
1. Read `HANDOFF.md` first. Pick up tasks under **For Codex**.
2. When you finish a task, move it to **Done** with the date and the commit link.

## Security
- Never commit secrets: API keys, tokens, passwords, private keys, `.env` files, or connection strings. Keep `.env*` in `.gitignore` (commit only `.env.example` with placeholder values). This repo is public, so anything committed is visible to everyone.
- Do not change **DNS, payments, or auth**, or anything about the **Apps Script deployment** (the web app deployment and the `endpointUrl` in `config.json`), unless there is a matching entry in `HANDOFF.md` explaining the change. Add that entry first.
- Treat all form input as untrusted. Never write user-supplied values to the sheet without neutralising leading `=`, `+`, `-`, `@` (see `safeCell_` in `Code.gs`).

## Content and copy
- All user-facing copy is bilingual: **English and Arabic**. Every new string needs both, added through the existing `I18N` object in `index.html`. Arabic must render right-to-left correctly (`dir="rtl"`).
- No alcohol cues in copy or imagery (no drink names, bottles, "open bar", happy hour, etc.).
- No unverified claims. Do not use made-up numbers or superlatives such as "18+ Years", "4,600+ Events", "100K+ attendees", "#1", "official destination". Do not imply events, tickets, sponsors, venues, artists, licences, or partnerships are confirmed unless there is current primary evidence.

## Static page rules
- Links and asset paths must work under `/guestlist/` (GitHub Pages project path). Use relative paths or `/guestlist/...`, never root-absolute `/...` paths.
- Mobile-first. Check the page at 320 px and 390 px wide in both English and Arabic: no horizontal scroll, tap targets at least 44 x 44 px.

## Git
- Never force-push or rewrite history.
- Keep commits small and focused. Prefer messages like `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`.
- Open a pull request for anything beyond small safe fixes; do not merge your own risky changes.
