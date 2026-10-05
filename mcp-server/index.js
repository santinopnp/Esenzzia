#!/usr/bin/env node
/**
 * Esenzzia MCP Server
 * Allows Claude to manage the entire Esenzzia business from a single interface.
 * Tools: orders, products, customers, inventory, Zoho Books revenue, support tickets.
 */
const { Server } = require('@anthropic-ai/mcp-server-sdk');
const { StdioServerTransport } = require('@anthropic-ai/mcp-server-sdk/server/stdio');
const axios = require('axios');

const API_BASE = process.env.ESENZZIA_API_URL || 'http://localhost:3000/api';
const ADMIN_TOKEN = process.env.ESENZZIA_ADMIN_TOKEN;

const api = axios.create({
  baseURL: API_BASE,
  headers: { Authorization: `Bearer ${ADMIN_TOKEN}`, 'Content-Type': 'application/json' },
});

const server = new Server(
  { name: 'esenzzia-admin', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'get_dashboard',
      description: 'Obtiene el resumen del negocio: ventas del día/mes, órdenes pendientes, alertas de inventario bajo, top productos.',
      inputSchema: { type: 'object', properties: {}, required: [] },
    },
    {
      name: 'list_orders',
      description: 'Lista órdenes con filtros por estado (pending, confirmed, shipped, delivered, cancelled) y fechas.',
      inputSchema: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] },
          limit: { type: 'number', default: 20 },
          page: { type: 'number', default: 1 },
        },
      },
    },
    {
      name: 'update_order_status',
      description: 'Actualiza el estado de una orden (confirmar, marcar como enviada, entregada, cancelar). Incluye tracking_number para envíos.',
      inputSchema: {
        type: 'object',
        properties: {
          order_id: { type: 'string' },
          status: { type: 'string', enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] },
          tracking_number: { type: 'string' },
          notes: { type: 'string' },
        },
        required: ['order_id', 'status'],
      },
    },
    {
      name: 'list_products',
      description: 'Lista productos con su inventario actual. Detecta agotados y bajo stock.',
      inputSchema: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          low_stock: { type: 'boolean', description: 'Solo mostrar productos con stock < 5' },
          limit: { type: 'number', default: 50 },
        },
      },
    },
    {
      name: 'update_inventory',
      description: 'Actualiza el stock de una variante de producto. Registra el movimiento de inventario.',
      inputSchema: {
        type: 'object',
        properties: {
          variant_id: { type: 'string' },
          quantity: { type: 'number', description: 'Nueva cantidad en stock' },
          reason: { type: 'string', description: 'Motivo del ajuste (recepción, conteo, merma)' },
        },
        required: ['variant_id', 'quantity'],
      },
    },
    {
      name: 'update_product_price',
      description: 'Actualiza el precio de una variante de producto.',
      inputSchema: {
        type: 'object',
        properties: {
          variant_id: { type: 'string' },
          price: { type: 'number' },
          compare_price: { type: 'number', description: 'Precio tachado (precio original para mostrar descuento)' },
        },
        required: ['variant_id', 'price'],
      },
    },
    {
      name: 'list_customers',
      description: 'Lista clientes con su historial de compras y valor de lifetime.',
      inputSchema: {
        type: 'object',
        properties: {
          search: { type: 'string', description: 'Buscar por nombre o email' },
          limit: { type: 'number', default: 20 },
        },
      },
    },
    {
      name: 'get_revenue_report',
      description: 'Obtiene reporte de ingresos desde Zoho Books: ventas, facturas, pagos pendientes.',
      inputSchema: {
        type: 'object',
        properties: {
          period: { type: 'string', enum: ['today', 'this_week', 'this_month', 'last_month', 'this_year'], default: 'this_month' },
        },
      },
    },
    {
      name: 'list_support_tickets',
      description: 'Lista tickets de soporte de Zoho Desk pendientes de respuesta.',
      inputSchema: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['open', 'on_hold', 'pending', 'closed'], default: 'open' },
          limit: { type: 'number', default: 10 },
        },
      },
    },
    {
      name: 'create_coupon',
      description: 'Crea un cupón de descuento para campañas de marketing.',
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string', description: 'Código del cupón (ej: PROMO20)' },
          discount_percent: { type: 'number', description: 'Porcentaje de descuento (1-100)' },
          expires_at: { type: 'string', description: 'Fecha de expiración ISO 8601 (opcional)' },
          usage_limit: { type: 'number', description: 'Máximo de usos (opcional)' },
        },
        required: ['code', 'discount_percent'],
      },
    },
  ],
}));

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_dashboard': {
        const { data } = await api.get('/admin/dashboard');
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'list_orders': {
        const params = new URLSearchParams();
        if (args.status) params.set('status', args.status);
        if (args.limit) params.set('limit', String(args.limit));
        if (args.page) params.set('page', String(args.page));
        const { data } = await api.get(`/admin/orders?${params}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'update_order_status': {
        const { data } = await api.patch(`/admin/orders/${args.order_id}`, {
          status: args.status,
          tracking_number: args.tracking_number,
          notes: args.notes,
        });
        return { content: [{ type: 'text', text: `Orden actualizada a "${args.status}". ${JSON.stringify(data)}` }] };
      }

      case 'list_products': {
        const params = new URLSearchParams();
        if (args.category) params.set('category', args.category);
        if (args.limit) params.set('limit', String(args.limit));
        const { data } = await api.get(`/admin/products?${params}`);
        const products = args.low_stock ? data.products?.filter((p) => p.total_stock < 5) : data.products;
        return { content: [{ type: 'text', text: JSON.stringify({ products, total: products?.length }, null, 2) }] };
      }

      case 'update_inventory': {
        const { data } = await api.patch(`/admin/products/variants/${args.variant_id}/inventory`, {
          quantity: args.quantity,
          reason: args.reason || 'Ajuste manual',
        });
        return { content: [{ type: 'text', text: `Stock actualizado. ${JSON.stringify(data)}` }] };
      }

      case 'update_product_price': {
        const { data } = await api.patch(`/admin/products/variants/${args.variant_id}/price`, {
          price: args.price,
          compare_price: args.compare_price,
        });
        return { content: [{ type: 'text', text: `Precio actualizado. ${JSON.stringify(data)}` }] };
      }

      case 'list_customers': {
        const params = new URLSearchParams();
        if (args.search) params.set('search', args.search);
        if (args.limit) params.set('limit', String(args.limit));
        const { data } = await api.get(`/admin/customers?${params}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'get_revenue_report': {
        const { data } = await api.get(`/admin/zoho/revenue?period=${args.period || 'this_month'}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'list_support_tickets': {
        const { data } = await api.get(`/admin/support/tickets?status=${args.status || 'open'}&limit=${args.limit || 10}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'create_coupon': {
        const { query } = require('pg');
        const { Pool } = require('pg');
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const result = await pool.query(
          `INSERT INTO coupons (code, discount_percent, expires_at, usage_limit, is_active)
           VALUES ($1, $2, $3, $4, true) RETURNING *`,
          [args.code.toUpperCase(), args.discount_percent, args.expires_at || null, args.usage_limit || null]
        );
        await pool.end();
        return { content: [{ type: 'text', text: `Cupón "${args.code.toUpperCase()}" creado con ${args.discount_percent}% de descuento.` }] };
      }

      default:
        return { content: [{ type: 'text', text: `Herramienta desconocida: ${name}` }], isError: true };
    }
  } catch (err) {
    return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Esenzzia MCP Server iniciado');
}

main().catch(console.error);
