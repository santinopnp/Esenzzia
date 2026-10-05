# Esenzzia MCP Server — Claude Connector

Este servidor MCP permite que Claude gestione toda la operación de Esenzzia Colombia desde una sola interfaz conversacional.

## Herramientas disponibles

| Herramienta | Descripción |
|---|---|
| `get_dashboard` | Resumen del negocio: ventas, órdenes, alertas |
| `list_orders` | Lista órdenes filtradas por estado |
| `update_order_status` | Confirmar, enviar, entregar o cancelar órdenes |
| `list_products` | Catálogo con stock actual |
| `update_inventory` | Ajustar stock de variantes |
| `update_product_price` | Cambiar precio o precio de referencia |
| `list_customers` | Clientes con historial de compras |
| `get_revenue_report` | Ingresos desde Zoho Books |
| `list_support_tickets` | Tickets de soporte de Zoho Desk |
| `create_coupon` | Crear cupones de descuento |

## Instalación

```bash
cd mcp-server
npm install
```

## Variables de entorno

```env
ESENZZIA_API_URL=https://api.esenzzia.com/api
ESENZZIA_ADMIN_TOKEN=<jwt-token-admin>
DATABASE_URL=postgresql://user:pass@host/esenzzia
```

## Configurar en Claude Desktop

Edita `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "esenzzia": {
      "command": "node",
      "args": ["/ruta/al/proyecto/mcp-server/index.js"],
      "env": {
        "ESENZZIA_API_URL": "https://api.esenzzia.com/api",
        "ESENZZIA_ADMIN_TOKEN": "TU_ADMIN_JWT_TOKEN",
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}
```

Reinicia Claude Desktop y verás las herramientas de Esenzzia disponibles.

## Ejemplos de uso con Claude

- *"¿Cuántas órdenes pendientes hay hoy?"*
- *"Marca la orden #ESZ-001 como enviada con tracking TK123456"*
- *"¿Qué productos tienen stock bajo?"*
- *"Crea un cupón NOCHE20 con 20% de descuento, válido hasta el 31 de diciembre"*
- *"¿Cuáles son los ingresos de este mes?"*
- *"Lista los tickets de soporte abiertos"*
