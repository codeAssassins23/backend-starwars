# 🎬 Star Wars Movies Management API

Backend desarrollado en NestJS para la gestión de películas utilizando la API pública de Star Wars (SWAPI), implementado como parte del reto técnico de Conexa.

## 📋 Descripción

Sistema de gestión de películas con autenticación JWT, roles de usuario (Regular/Administrador) y sincronización automática con la API de Star Wars. El proyecto implementa arquitectura hexagonal (Clean Architecture) con separación clara de responsabilidades.

## 🏗️ Arquitectura

El proyecto sigue los principios de **Clean Architecture** con la siguiente estructura:

```
src/
├── domain/              # Lógica de negocio pura
│   ├── entities/        # Entidades del dominio
│   ├── ports/           # Interfaces/Contratos
│   └── interfaces/      # Tipos e interfaces compartidas
├── application/         # Casos de uso
│   ├── use-cases/       # Lógica de aplicación
│   └── services/        # Servicios de aplicación
├── infrastructure/      # Detalles de implementación
│   ├── adapters/        # Implementaciones de puertos
│   ├── config/          # Configuración
│   ├── persistence/     # Base de datos (TypeORM)
│   └── external_services/ # Integraciones externas (SWAPI, Cron)
└── interfaces/          # Capa de presentación
    ├── controllers/     # Controladores REST
    ├── dto/             # Data Transfer Objects
    ├── guards/          # Guards de autenticación/autorización
    ├── interceptors/    # Interceptores
    └── filters/         # Filtros de excepciones
```

## ✨ Características

- 🔐 **Autenticación JWT** con roles (Regular User/Admin)
- 👥 **Gestión de usuarios** (registro e inicio de sesión)
- 🎬 **CRUD completo de películas** con control de acceso basado en roles
- 🤖 **Sincronización automática** con SWAPI mediante cron jobs
- 📚 **Documentación Swagger** integrada
- ✅ **Testing** unitario y e2e
- 🛡️ **Validación de datos** con class-validator
- 🔍 **Logging personalizado** para debugging
- 🎨 **Arquitectura limpia** y escalable

## 🚀 Tecnologías

- **Framework:** NestJS 10.x
- **Base de datos:** PostgreSQL con TypeORM
- **Autenticación:** JWT (jsonwebtoken)
- **Encriptación:** Bcrypt
- **Validación:** class-validator, class-transformer
- **Documentación:** Swagger/OpenAPI
- **Testing:** Jest
- **Linting:** ESLint + Prettier

## 📦 Instalación

### Requisitos previos

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm o yarn

### Pasos

1. **Clonar el repositorio**

```bash
git clone <tu-repositorio>
cd <nombre-proyecto>
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crear un archivo `.env` en la raíz del proyecto:

```env
# Application
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=movies_db

# JWT
JWT_SECRET=tu_secret_super_seguro_aqui
JWT_EXPIRATION=1d

# SWAPI
SWAPI_BASE_URL=https://www.swapi.tech/api

# Cron (opcional)
ENABLE_CRON=true
```

4. **Crear la base de datos**

```bash
# Conéctate a PostgreSQL y ejecuta:
CREATE DATABASE movies_db;
```

5. **Ejecutar migraciones** (TypeORM las genera automáticamente)

```bash
npm run start:dev
```

## 🎯 Uso

### Desarrollo

```bash
npm run start:dev
```

### Producción

```bash
npm run build
npm run start:prod
```

### Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

### Linting

```bash
npm run lint
npm run format
```

## 📖 Documentación API

Una vez iniciada la aplicación, accede a la documentación Swagger en:

```
http://localhost:3000/api/docs
```

### Endpoints principales

#### 🔐 Autenticación

- **POST** `/auth/register` - Registro de usuario
- **POST** `/auth/login` - Inicio de sesión

#### 🎬 Películas

- **GET** `/movies` - Listar películas (Requiere autenticación)
- **GET** `/movies/:id` - Obtener película por ID (Solo usuarios regulares)
- **POST** `/movies` - Crear película (Solo administradores)
- **PUT** `/movies/:id` - Actualizar película (Solo administradores)
- **DELETE** `/movies/:id` - Eliminar película (Solo administradores)
- **POST** `/movies/sync` - Sincronizar con SWAPI (Solo administradores)

### Ejemplo de uso

#### 1. Registrar usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Password123!",
    "name": "Admin User",
    "role": "admin"
  }'
```

#### 2. Iniciar sesión

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Password123!"
  }'
```

#### 3. Listar películas (con token)

```bash
curl -X GET http://localhost:3000/movies \
  -H "Authorization: Bearer <tu_token_jwt>"
```

## 🔑 Roles y Permisos

| Acción                  | Usuario Regular | Administrador |
| ----------------------- | --------------- | ------------- |
| Ver lista de películas  | ✅              | ✅            |
| Ver detalle de película | ✅              | ✅            |
| Crear película          | ❌              | ✅            |
| Actualizar película     | ❌              | ✅            |
| Eliminar película       | ❌              | ✅            |
| Sincronizar con SWAPI   | ❌              | ✅            |

## 🤖 Sincronización Automática

El sistema incluye un cron job que sincroniza automáticamente las películas de Star Wars cada hora. Esta funcionalidad puede deshabilitarse estableciendo `ENABLE_CRON=false` en el archivo `.env`.

## 🧪 Testing

El proyecto incluye:

- ✅ Tests unitarios para servicios y casos de uso
- ✅ Tests de integración para repositorios
- ✅ Tests e2e para endpoints
- ✅ Tests para guards, interceptors y filters

```bash
# Ejecutar todos los tests
npm test

# Ver cobertura
npm run test:cov
```

## 📂 Estructura de Base de Datos

### Tabla `users`

- `id` (UUID)
- `email` (string, único)
- `password` (string, hasheado)
- `name` (string)
- `role` (enum: 'user' | 'admin')
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### Tabla `movies`

- `id` (UUID)
- `title` (string)
- `episodeId` (number)
- `openingCrawl` (text)
- `director` (string)
- `producer` (string)
- `releaseDate` (date)
- `url` (string)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## 🚀 Deployment

### Opciones sugeridas (gratuitas):

- **Railway** (recomendado)
- **Render**
- **Fly.io**
- **Heroku** (con PostgreSQL addon)

### Variables de entorno para producción:

Asegúrate de configurar todas las variables del `.env` en tu plataforma de deployment.

## 🤝 Contribución

Este es un proyecto de prueba técnica. Para el uso real, considera:

1. Implementar rate limiting
2. Agregar paginación en endpoints
3. Implementar caché (Redis)
4. Agregar logs más robustos (Winston, Pino)
5. Implementar health checks
6. Agregar más tests

## 📝 Notas del Desarrollador

- ⏱️ **Tiempo de desarrollo:** Aproximadamente 8 horas
- 🎨 **Arquitectura:** Hexagonal/Clean Architecture para máxima escalabilidad
- 🔐 **Seguridad:** JWT, bcrypt, validación de inputs, guards por roles
- ✅ **Testing:** Cobertura de casos críticos
- 📚 **Documentación:** Swagger completo y README detallado

## 📄 Licencia

Este proyecto es parte de una prueba técnica para Conexa.

## 👤 Autor

Desarrollado como parte del reto técnico de Backend SSR para Conexa.

---

**¿Preguntas o problemas?** Abre un issue en el repositorio o contacta al desarrollador.
