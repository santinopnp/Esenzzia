# Esenzzia Colombia — Plataforma E-commerce

Tienda online de perfumes y esencias con IA para atención al cliente, integración completa con Zoho y pasarelas de pago colombianas.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Base de datos | PostgreSQL 16 |
| Caché / Carrito | Redis 7 |
| IA Atención al cliente | Claude (claude-sonnet-4-6) |
| Pagos Colombia | Wompi (PSE, tarjetas, efectivo) |
| Pagos internacional | Stripe |
| CRM / Contabilidad | Zoho CRM + Zoho Books |
| Soporte | Zoho Desk |
| Marketing | Zoho Campaigns |
| Conector Claude | MCP Server propio |

## Estructura del proyecto

```
esenzzia/
├── apps/
│   ├── backend/          # API REST Express
│   │   ├── config/       # PostgreSQL, Redis
│   │   ├── middleware/   # Auth, rate limiter
│   │   ├── migrations/   # Schema SQL + seed catálogo
│   │   ├── routes/       # auth, products, cart, orders, payment, chat, admin, webhooks
│   │   └── services/     # Zoho, Valentina AI, payments, orders, users...
│   └── web/              # React SPA
│       └── src/
│           ├── components/  # Header, ProductCard, ChatWidget
│           ├── context/     # AuthContext, CartContext
│           └── pages/       # Landing, Shop, Product, Cart, Checkout, Account, Admin
├── mcp-server/           # Claude MCP connector para gestión del negocio
└── docker-compose.yml
```

## Inicio rápido

```bash
# 1. Clonar y configurar variables
cp .env.example .env
# Editar .env con tus credenciales

# 2. Iniciar con Docker
docker-compose up -d

# 3. Ejecutar migraciones
docker exec esenzzia-backend node -e "require('./migrations/run')" 
# O directamente:
psql $DATABASE_URL < apps/backend/migrations/001_initial.sql
psql $DATABASE_URL < apps/backend/migrations/002_seed_catalog.sql

# 4. Frontend en desarrollo
cd apps/web && npm run dev
```

## IA — Valentina

Valentina es la asesora virtual de fragancias de Esenzzia. Está entrenada para:
- Recomendar perfumes según preferencias personales
- Explicar familias olfativas y notas de fragancia  
- Gestionar dudas sobre pedidos y envíos
- Escalar automáticamente a soporte humano vía Zoho Desk cuando detecta situaciones complejas

## Catálogo incluido

33 perfumes de marcas como Armani, Lancôme, Lattafa, Orientica, Paco Rabanne, CH, Burberry, Valentino, y más. Organizados en 5 categorías: Hombre, Mujer, Unisex, Árabes, Nicho.

## Conector Claude MCP

Ver [`mcp-server/README.md`](mcp-server/README.md) para instrucciones de configuración del conector que permite gestionar el negocio completo desde Claude Desktop.
