# TeamPulse TCG

Marketplace/editorial para TCG (Yu‑Gi‑Oh) con flujo de compra por WhatsApp y un panel privado de administración.

## Stack

- TanStack Start (SSR) + TanStack Router (file-based routes)
- React + TypeScript
- TailwindCSS + componentes UI (Radix/shadcn)
- Persistencia local (localStorage) para carrito y datos demo del admin

## Requisitos

- Node.js (recomendado: LTS)

## Comandos

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Rutas principales

- `/` Home
- `/catalog` Catálogo
- `/producto/:slug` Detalle de producto
- `/carrito` Carrito (checkout por WhatsApp)
- `/noticias` Noticias & Artículos
- `/como-comprar` Guía de compra

## Admin Panel

Rutas:

- `/admin`
- `/admin/products` · `/admin/products/new` · `/admin/products/edit/:id`
- `/admin/articles` · `/admin/articles/new` · `/admin/articles/edit/:id`
- `/admin/inventory`
- `/admin/media`
- `/admin/settings`

Autenticación:

- Password por variable de entorno `VITE_ADMIN_PASSWORD`
- Si no está definida, el password por defecto es `admin`

## Notas

- La web es light-theme only.
- Las imágenes subidas en admin quedan guardadas como data URLs en localStorage (mock) hasta integrar storage real.
