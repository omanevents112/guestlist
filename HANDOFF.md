# HANDOFF.md — Shared task queue

Read this at the start of every session. One line per task:
`- [YYYY-MM-DD] owner: task — commit: <link or "pending">`

Move finished tasks to **Done** with the commit link.

## For Codex

## For WebMaster
- [2026-11-17] WebMaster: Code.gs changed (age gate replaced by `rulesAccepted` / error `rules_required`, column 'Rules accepted (Yes/No)'). Mohammed must paste the latest raw Code.gs (https://raw.githubusercontent.com/omanevents112/guestlist/main/apps-script/Code.gs) into Apps Script and deploy a New version BEFORE setting endpointUrl — commit: https://github.com/omanevents112/guestlist/commit/b7c0e8f
- [2026-11-17] WebMaster: Deploy the Apps Script web app and set endpointUrl in config.json — commit: pending
- [2026-11-17] WebMaster: Consider rate limiting / spam protection on the Apps Script endpoint — commit: pending

## For GitKeeper
- [2026-11-17] GitKeeper: Enable branch protection on main after Thursday's deploys (needs Mohammed's OK) — commit: pending

## Done
- [2026-11-18] WebMaster: Standalone THURSDAY TAKEOVER event page (EN + AR) at /thursday-takeover/, auteur commit-sheet + gates; interim canonical page while omanevents.live is on Manus — commit: this commit
- [2026-11-17] GitKeeper: Neutralise spreadsheet formula injection in Code.gs (`safeCell_`) — commit: this PR
- [2026-11-17] GitKeeper: 404 page back link now points to /guestlist/ — commit: this PR
- [2026-11-17] GitKeeper: 44px tap targets for language toggle and consent checkboxes — commit: this PR
- [2026-11-17] GitKeeper: Arabic placeholders for all inputs, via the existing i18n object — commit: this PR
- [2026-11-17] GitKeeper: Arabic "القست ليست" replaced with "قائمة الضيوف" — commit: this PR
- [2026-11-17] GitKeeper: EN/AR privacy line under the form — commit: this PR
- [2026-11-17] GitKeeper: Added .gitignore, AGENTS.md and HANDOFF.md — commit: this PR

## Notes (DNS / payments / auth changes, autogit undo events)
<!-- autogit 'undo' rewinds the remote. That is Mohammed's tool, not a policy breach; log each occurrence here with date and the SHAs before/after. Mohammed works on Windows (mind CRLF line endings and path casing). -->
