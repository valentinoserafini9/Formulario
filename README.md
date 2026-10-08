# Sistema de Gestión Académica (SGA)

Proyecto desarrollado durante la materia Programación IV.

## Descripción

Aplicación para administrar alumnos y docentes. El proyecto conserva el frontend original, incorpora una API REST con Express y MongoDB para alumnos, y agrega el frontend de prácticas React + Vite utilizado en clase.

## Estructura

- `backend/`: API de alumnos, modelos Mongoose y conexión a MongoDB.
- `frontend/`: sitio clásico; el módulo de alumnos consume la API y docentes conserva el almacenamiento local.
- `frontend-react/`: aplicación React con ejercicios de componentes, estado y `useEffect`.

## Requisitos

- Node.js y npm.
- MongoDB local o una instancia accesible mediante `MONGO_URI`.

## Ejecutar el backend

Desde `backend/`, instalar dependencias, copiar `.env.example` como `.env` y ejecutar:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

El servidor usa `PORT=3000` y `MONGO_URI=mongodb://127.0.0.1:27017/SGA` en la configuración de ejemplo. No subir el archivo `.env`; contiene configuración local.

La API de alumnos está disponible en `http://localhost:3000/alumnos`.

## Ejecutar el frontend React

Desde `frontend-react/`:

```powershell
npm ci
npm run dev
```

El servidor de Vite muestra la URL local en la consola.

## Frontend clásico

Abrir `frontend/index.html` con Live Server. El backend debe estar iniciado para listar y administrar alumnos. El módulo de docentes continúa usando `localStorage`.

## Tecnologías

- HTML, CSS y JavaScript.
- React 19 y Vite.
- Node.js, Express y Mongoose.
- MongoDB.

## Autor

Valentino Serafini
Programación IV
