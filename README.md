# Emerald Bookshelf

Aplicación web desarrollada como proyecto capstone para la gestión y consulta de libros en un entorno universitario. Consume la API pública de Google Books para la navegación de catálogo y utiliza una arquitectura basada en contexto para la gestión de sesiones y préstamos en el cliente.

## Enlaces

* Demo en vivo: https://tu-app.netlify.app
* Repositorio GitHub: https://github.com/tu-usuario/emerald-bookshelf

## Pila Tecnológica

* React + TypeScript (Vite)
* React Router DOM v6
* Context API (Autenticación y Estado de Préstamos)
* Jest + React Testing Library
* CSS personalizado (Tema Emerald & Obsidian, mobile-first)

## Configuración y Ejecución

Asegúrate de tener Node.js 18 o superior instalado.

1. Instalar dependencias:
   npm install

2. Modo de desarrollo:
   npm run dev

3. Construcción para producción:
   npm run build

## Suite de Pruebas

Para ejecutar las pruebas unitarias y de integración:

npm test

Las pruebas están estructuradas bajo la filosofía de React Testing Library (evaluar la interfaz desde la perspectiva de interacción del usuario en lugar de la implementación interna):

* Login.test.tsx: Valida el comportamiento del formulario, mensajes de error accesibles y persistencia del token simulado.
* BookCard.test.tsx: Revisa el renderizado de metadatos del libro, enlaces dinámicos y estados de disponibilidad.
* Navbar.test.tsx: Verifica la renderización condicional de la barra según el estado de la sesión y el flujo de salida.
* useBooks.test.tsx: Prueba el custom hook de búsqueda aislando la capa de red mediante mocks de fetch (casos de éxito, error y refetch).

## Flujo de Autenticación

1. El usuario envía credenciales en la vista de inicio de sesión (/login).
2. Se realiza una validación básica en el cliente y `AuthContext` genera un token de acceso sintético (`Bearer emerald-token-123`).
3. El estado de la sesión se persiste en `localStorage` bajo la clave `emerald_session` para mantener la sesión tras recargar.
4. Las rutas privadas (/profile) están encapsuladas por `ProtectedRoute`, redirigiendo al login si no se detecta una sesión activa.
5. El historial de préstamos se asocia directamente al identificador del usuario activo (`emerald_loans_<email>`).

Nota: El token generado es puramente simulado para cumplir con los requisitos del frontend sin depender de un servidor de autenticación dedicado.

## Arquitectura del Proyecto

* src/components/ : Componentes de interfaz (Navbar, BookCard, BorrowTracker, ProtectedRoute).
* src/context/    : Estado global para sesión y préstamos (AuthContext, LoansContext).
* src/hooks/      : Custom hooks para la integración con la API (useBooks).
* src/pages/      : Vistas principales de la SPA (Catalog, BookDetail, Login, Profile).
* src/services/   : Mapeo y llamadas a la API de Google Books (booksApi).
* src/__tests__/  : Pruebas unitarias e integración con Jest y RTL.

## Despliegue

La SPA está configurada para desplegarse mediante plataformas serverless (Vercel o Netlify) utilizando los comandos estándar de Vite (`npm run build` con salida en `dist`). Se incluye la regla de reescritura de rutas en `public/_redirects` para soportar el enrutado en el cliente.
