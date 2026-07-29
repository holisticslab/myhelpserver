# CLAUDE.md

<!--LLM-CONTEXT
Stack: Laravel 8.12, PHP 7.3+/8.0+, React 16.x, MySQL, Sanctum
Domain: Simplified company/checklist backend for mobile auditors
Role: ⚠️ DEPRECATED — auth migration COMPLETE (see root CLAUDE.md#{migration}). Kept alive ONLY for public endpoints (theme/scheme).
-->

## Commands {#commands}

```bash
php artisan tinker               # serve/watch handled by Laragon — never start manually
php artisan cache:clear && config:clear && view:clear
```

## Critical Rules {#critical}

⚠️ **Active vs dead endpoints** — this repo has no other reason to be touched:

| Endpoint | Status | Rule |
|----------|--------|------|
| `GET /api/theme` | ✅ Active, public | Must stay accessible without auth — other repos depend on it |
| `GET /api/scheme` | ✅ Active, public | Must stay accessible without auth — other repos depend on it |
| `GET /api/getCustomLogin/{link}` | ✅ Active, public | Custom branded login, no auth |
| `POST /api/login`, `POST /api/mcdlogin` | ❌ Dead | Do not call from QuikHalalv4; do not delete (kept as fallback) |
| `GET /api/getchecklist`, `/getcompany`, `/getsubscription`, `POST /api/requestmeeting` | ⚠️ Protected, unused by mobile | Legacy, no longer exercised by the active auth flow |

| ❌ NEVER | ✅ INSTEAD |
|----------|-----------|
| Touch this repo for anything except `/theme`, `/scheme`, `/getCustomLogin` | Auth/checklist/subscription logic lives in `myhalalgig-duopharma` now |
| Remove or protect the public theme/scheme/getCustomLogin routes | Must stay accessible without auth — other repos call them directly |
| Change `POST /api/login` response structure | Kept only as reference/fallback; shape must not drift even though dead |
| Delete legacy auth routes | Keep functional as fallback per root migration policy |

## Reference: Legacy Mobile Contract {#mobile}

> ⚠️ DEAD — QuikHalalv4 no longer calls myhelpserver auth. Active contract: `myhalalgig-duopharma/CLAUDE.md#{mobile}`. Kept below only so the dead `/api/login` shape isn't accidentally changed.

```json
// POST /api/login response (legacy, do not call, do not change shape)
{
  "access_token": "token_string",
  "user": { "id", "name", "username", "roleFK" },
  "company": { "cmpnyPK", "cmpnyName" },
  "subscription": { "dateStart", "dateEnd", "subcrDetails" }
}
```

> 📖 Migration status, role hierarchy, and full auth architecture: root `CLAUDE.md#{migration}`. Do not duplicate that status here — check it before assuming this repo's auth is still relevant.

## Gotchas {#gotchas}

| Symptom | Cause | Fix |
|---------|-------|-----|
| Subscription save fails | Table has NO timestamp columns | Keep `$timestamps = false` in model |
