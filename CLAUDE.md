# Claude Project Configuration for Esenzzia

## Project Overview

Esenzzia es una plataforma de e-commerce para perfumes y esencias con integración profunda de IA.

### Stack
- **Backend**: Node.js + Express.js + PostgreSQL + Redis + BullMQ
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **IA**: Claude API — asistente Valentina (servicio al cliente)
- **Zoho**: CRM, Books, Campaigns, Desk
- **Pagos**: Stripe (internacional) + Wompi (Colombia)

## Service Architecture — SINGLE SOURCE OF TRUTH

**`apps/backend/services/`** is the ONLY services directory.

### Import rules

| File location | Correct require path |
|---|---|
| `routes/*.js` | `require('../services/X')` |
| `controllers/*.js` | `require('../services/X')` |
| `middleware/*.js` | `require('../services/X')` |
| `workers/*.js` | `require('../services/X')` |

### Within `services/` itself
- Use `./X` for sibling services (NOT `../services/X`)
- Use `../config/X` to reach config files
- Use `../models/X` to reach models

## Context Ignored

### Excluded Directories
- `node_modules/`
- `dist/`
- `build/`
- `.next/`
- `coverage/`
- `logs/`
- `public/`

### Excluded File Patterns
- `*.min.js`, `*.min.css`
- `package-lock.json`, `yarn.lock`
- `*.svg`, `*.png`, `*.jpg`, `*.jpeg`, `*.gif`, `*.webp`
- `*.log`, `*.lock`
