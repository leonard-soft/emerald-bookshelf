# Emerald Bookshelf 

[![Deployment Status](https://img.shields.io/badge/deployment-live-success?style=flat-square)](https://emerald-bookshelf-tm8y.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Aplicación web Single Page Application (SPA) desarrollada como proyecto capstone para la gestión y consulta de libros en un entorno universitario. Consume la API de catálogos bibliográficos para la navegación y utiliza una arquitectura basada en contexto para la gestión de sesiones y préstamos en el cliente.

## Enlaces

- **Repositorio GitHub:** [github.com/leonard-soft/emerald-bookshelf](https://github.com/leonard-soft/emerald-bookshelf)
- **Despliegue en Vivo:** [Ver Aplicación en Producción](https://emerald-bookshelf-tm8y.vercel.app/)

## Stack

- **Core:** React 18 + TypeScript (Vite)
- **Enrutamiento:** React Router DOM v6
- **Gestión de Estado:** Context API (`AuthContext`, `LoansContext`)
- **Testing:** Jest + React Testing Library (RTL)
- **Estilos:** CSS personalizado con diseño adaptativo (Tema Emerald & Obsidian, *mobile-first*)

## Configuración y Ejecución Local

Asegúrate de tener **Node.js 18+** instalado en tu entorno.

**Clonar el repositorio:**

```bash
   git clone [https://github.com/leonard-soft/emerald-bookshelf.git](https://github.com/leonard-soft/emerald-bookshelf.git)
   cd emerald-bookshelf
```
**Instalar dependencias:**

```Bash
   npm install
```
   
**Ejecutar en modo de desarrollo:**

```Bash
   npm run dev
```

**Construir para producción:**

```Bash
   npm run build
```

**Testing**

```Bash
   npm test
```

**Flujo de Autenticación**

- El usuario envía credenciales en la vista de inicio de sesión.
- Se realiza una validación en el cliente y AuthContext genera un token de acceso sintético (Bearer emerald-token-123).
- El estado de la sesión se persiste en localStorage bajo la clave emerald_session para mantener la sesión activa tras recargar.
- Las rutas privadas están encapsuladas por ProtectedRoute, redirigiendo al login si no se detecta sesión.
- El historial de préstamos se asocia directamente al identificador del usuario activo.


**Arquitectura del Proyecto**

```Plaintext
src/
├── components/     # Componentes de interfaz (Navbar, BookCard, BorrowTracker, ProtectedRoute)
├── context/        # Estado global para sesión y préstamos (AuthContext, LoansContext)
├── hooks/          # Custom hooks para la integración con la API (useBooks)
├── pages/          # Vistas principales de la SPA (Catalog, BookDetail, Login, Profile)
├── services/       # Mapeo y llamadas a la API bibliográfica (booksApi)
└── __tests__/      # Pruebas unitarias e integración con Jest y RTL
```


Desarrollado por **Leonardo David Bermúdez** Forero para Lab Semana 7.

Este proyecto está bajo la licencia **MIT**.
