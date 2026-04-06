# Team Comunicaciones — Frontend

SPA (Single Page Application) del sistema interno de Team Comunicaciones. Incluye la landing pública, tienda y el portal intranet para asesores, supervisores y administradores.

**Stack:** Vue 3 / Vite / Bootstrap 5 / Bootstrap Vue Next / Axios / Chart.js

---

## Requisitos

- Node.js >= 18

---

## Configuración local

### Solo la primera vez

```bash
# 1. Instalar dependencias
npm install

# 2. Apuntar al backend local
# En src/components/BackendRouter/BackendRouter.js cambiar:
#
#   data : 'http://localhost:8000/api/v1.0/'
#   // data : 'https://api.teamcomunicaciones.com.co/api/v1.0/'
```

### Cada vez que se ejecuta en local

```bash
npm run dev
```

**URL local:** http://localhost:5173

> Asegurarse de que el backend Django esté corriendo en `http://localhost:8000` antes de usar el frontend.

---

## Despliegue en producción

El frontend se sirve como archivos estáticos desde `/var/www/TeamsComunicaciones/dist/` a través de Nginx.

### Antes de desplegar

Verificar que `src/components/BackendRouter/BackendRouter.js` apunte a producción:

```js
data : 'https://api.teamcomunicaciones.com.co/api/v1.0/'
// data : 'http://localhost:8000/api/v1.0/'
```

### Cada despliegue

```bash
cd /var/www/TeamsComunicaciones

# 1. Traer cambios
git pull

# 2. Instalar dependencias nuevas (si las hay)
npm install

# 3. Generar build de producción
npm run build
```

Nginx sirve el `dist/` automáticamente — no es necesario reiniciarlo.

### Verificar despliegue

Abrir https://teamcomunicaciones.com.co y confirmar que carga correctamente.

---

## Estructura principal

```
src/
├── views/
│   ├── Intranet/        # Portal interno (comisiones, reportes, turnos, admin)
│   └── MainPage/        # Landing pública y tienda
├── components/
│   ├── BackendRouter/   # URL base del backend
│   └── ...
└── router/              # Rutas de Vue Router
```

## Roles y acceso

| Rol | Acceso |
|---|---|
| Asesor | Consulta y pago de comisiones propias |
| Supervisor | Vista de comisiones de su ruta |
| Administrador | Gestión completa: cargas, pagos, precios, turnos, usuarios |
