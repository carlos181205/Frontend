# 🛒 Order Management System — Frontend

Este proyecto es la interfaz web del sistema de gestión de órdenes de compra, construida con **Next.js**, **KendoReact** y **Tailwind CSS**.

## 📋 Requisitos

- **Node.js** v20 o superior
- **npm** o **yarn**
- **Backend API** (FastAPI) corriendo en `http://localhost:8000`

## 🚀 Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repo>
   cd frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 16 (App Router)
- **UI Components:** KendoReact (Grid, Form, Inputs)
- **Estilos:** Tailwind CSS
- **Iconos:** Lucide React
- **Lenguaje:** TypeScript

## 📁 Estructura del Proyecto

```
src/
├── app/            # Rutas y páginas (Dashboard, Pedidos, Clientes, etc.)
├── components/     # Componentes reutilizables (Navbar, OrderGrid, OrderForm)
├── services/       # Cliente de API para conexión con el backend
└── types/          # Interfaces de TypeScript del dominio
```

## 📋 Funcionalidades Implementadas

- **Dashboard:** Resumen visual de estadísticas.
- **Gestión de Pedidos:** CRUD completo con Kendo Grid (paginación y ordenamiento).
- **Gestión de Clientes:** Listado y administración básica.
- **Gestión de Productos:** Catálogo completo.
- **Estado del Sistema:** Verificación de salud de la API y links a Swagger.

---
Proyecto académico para el programa **ADSO — SENA 2026**.
