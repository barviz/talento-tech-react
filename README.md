
# 🛒 Talento Tech React – Ecommerce

Proyecto desarrollado en React para simular una tienda online con carrito de compras, autenticación de usuarios y gestión de productos.

---

## Local
```bash
npm install  
```
```bash
npm run dev
```

## Deploy
```bash
npm run deploy
```

https://barviz.github.io/talento-tech-react

### 🛍️ Compras
- Navegá por el catálogo de productos.
- Usá la barra de búsqueda o el paginador para encontrar artículos.
- Hacé clic en "Agregar al carrito" para guardar productos.

### 🔐 Autenticación
- Ingresá desde el botón de "Login".
- Se simula una sesión almacenada en localStorage.

### 🛒 Carrito
- Solo usuarios autenticados pueden acceder al carrito.
- Desde ahí podés ver productos, eliminar uno o vaciar todo.

### 🛠️ CRUD de productos (Admin)
Si el usuario tiene rol de administrador (simulado), puede:
- Agregar productos nuevos.
- Editar o eliminar productos existentes.
- Confirmar eliminaciones y ver alertas de errores.

### 📦 Tecnologías Usadas
- React + Vite
- React Router DOM
- Context API
- Axios
- React Bootstrap + Styled-components
- React Icons + Toastify
- MockAPI

### ✅ Funcionalidades clave
- Carrito de compras global
- Rutas protegidas por autenticación
- CRUD completo de productos
- Diseño responsivo
- Notificaciones con Toastify
- Búsqueda y paginación de productos
