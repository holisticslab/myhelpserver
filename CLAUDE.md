# CLAUDE.md

<!--LLM-CONTEXT
Stack: Laravel 8.12, PHP 7.3+/8.0+, React 16.x, MySQL, Sanctum
Domain: Simplified company/checklist for mobile auditors
Role: Legacy API - auth migrating TO myhalalgig-duopharma
-->

## Critical Rules {#critical}

| ❌ NEVER | ✅ INSTEAD |
|----------|-----------|
| Read migrations for schema | MCP MySQL: `describe_table` |
| Use `grep`/`find`/`cat` | `rg`, Glob, Grep, Read tools |
| Remove public theme/scheme endpoints | Must stay accessible without auth |
| Change login response structure | QuikHalalv4 depends on exact shape |
| Delete auth before migration complete | Keep functional as fallback |

## Public Endpoints (DO NOT PROTECT) {#public}

```
GET /api/theme              → Public theme config
GET /api/scheme             → Public scheme data
GET /api/getCustomLogin/{link} → Custom branded login
```

## Commands {#commands}

```bash
php artisan serve|test|tinker    npm run watch|hot
php artisan cache:clear && config:clear && view:clear
```

## Simplified Model (vs duopharma) {#model}

| Feature | myhelpserver | myhalalgig-duopharma |
|---------|--------------|----------------------|
| Advisors | ❌ | ✅ |
| Suppliers | ❌ | ✅ |
| Products | ❌ | ✅ |
| HALAL/HAS (40+ types) | ❌ | ✅ |
| Basic checklists | ✅ | ✅ |

## API Routes {#api}

```
# Auth
POST /api/login|mcdlogin    GET /api/user

# Public (NO AUTH)
GET /api/theme|scheme|getCustomLogin/{link}

# Protected (auth:sanctum)
GET /api/getchecklist|getcompany|getsubscription
POST /api/requestmeeting
```

## Migration Context {#migration}

```
Current: QuikHalalv4 → myhelpserver (primary)
Target:  QuikHalalv4 → myhalalgig-duopharma (primary) → myhelpserver (deprecated fallback)
```

**During migration**: Keep both auth systems functional | Test mobile against both | Preserve public endpoints

## Mobile Contract {#mobile}

```json
// POST /api/login response (DO NOT CHANGE)
{
  "accessToken": "token_string",
  "user": { "id", "name", "username", "roleFK" },
  "company": { "cmpnyPK", "cmpnyName" },
  "subscription": { "dateStart", "dateEnd", "subcrDetails" }
}
```
