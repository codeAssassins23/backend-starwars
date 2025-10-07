# Star Wars Movies Management API

Backend desarrollado en NestJS para la gestión de películas utilizando la API pública de Star Wars (SWAPI), implementado como parte del reto técnico de Conexa.

## Descripción

Sistema de gestión de películas con autenticación JWT, roles de usuario (Regular/Administrador) y sincronización automática con la API de Star Wars. El proyecto implementa arquitectura hexagonal (Clean Architecture) con separación clara de responsabilidades.

## Arquitectura

El proyecto sigue los principios de **Clean Architecture** con la siguiente estructura:

```
src/
├── application/              # Capa de Aplicación
│   └── use-cases/           # Casos de uso
│       ├── auth/            # Autenticación
│       └── movies/          # Gestión de películas
│
├── domain/                   # Capa de Dominio
│   ├── entities/            # Entidades del dominio
│   ├── interfaces/          # Interfaces de dominio
│   ├── ports/               # Puertos (interfaces de adaptadores)
│   │   ├── external_services/
│   │   ├── repository/
│   │   └── services/
│   └── tokens/              # Tokens de inyección
│
├── infrastructure/           # Capa de Infraestructura
│   ├── adapters/            # Adaptadores (JWT, Bcrypt)
│   ├── config/              # Configuración
│   │   ├── environments/
│   │   ├── logger/
│   │   ├── swagger/
│   │   └── typeorm/
│   ├── external_services/   # Servicios externos
│   │   ├── cron-swapi/     # Tareas programadas
│   │   └── swapi/          # Cliente SWAPI
│   └── persistence/         # Persistencia de datos
│       ├── entities/        # Entidades TypeORM
│       └── repositories/    # Repositorios
│
└── interfaces/               # Capa de Interfaces
    ├── controllers/         # Controladores HTTP
    │   ├── auth/
    │   └── movies/
    ├── decorators/          # Decoradores personalizados
    ├── filter/              # Filtros de excepción
    ├── guards/              # Guards de autenticación
    └── interceptors/        # Interceptores de respuesta
```

## Características

- **Autenticación JWT** con roles (Regular User/Admin)
- **Gestión de usuarios** (registro e inicio de sesión)
- **CRUD completo de películas** con control de acceso basado en roles
- **Sincronización automática** con SWAPI mediante cron jobs
- **Documentación Swagger** integrada
- **Testing** unitario y e2e
- **Validación de datos** con class-validator
- **Logging personalizado** para debugging
- **Arquitectura limpia** y escalable

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

- Node.js >= 22.x
- PostgreSQL >= 14.x
- npm

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

# Cobertura
npm run test:cov
```

### Linting

```bash
npm run lint
npm run format
```

## Documentación API

Una vez iniciada la aplicación, accede a la documentación Swagger en:

```
http://localhost:3000/api
```

### Endpoints principales

#### Autenticación

- **POST** `/auth/register` - Registro de usuario
- **POST** `/auth/login` - Inicio de sesión

#### Películas

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
    "username": "admin2",
    "password": "force123"
  }'
```

#### 2. Iniciar sesión

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin2",
    "password": "force123"
  }'
```

#### 3. Listar películas (con token)

```bash
curl -X GET http://localhost:3000/movies \
  -H "Authorization: Bearer <tu_token_jwt>"
```

## Roles y Permisos

| Acción                  | Usuario Regular | Administrador |
| ----------------------- | --------------- | ------------- |
| Ver lista de películas  | ✅              | ✅            |
| Ver detalle de película | ✅              | ❌            |
| Crear película          | ❌              | ✅            |
| Actualizar película     | ❌              | ✅            |
| Eliminar película       | ❌              | ✅            |
| Sincronizar con SWAPI   | ❌              | ✅            |

## Sincronización Automática

El sistema incluye un cron job que sincroniza automáticamente las películas de Star Wars cada hora.

## Testing

El proyecto incluye:

- Tests unitarios para servicios y casos de uso
- Tests de integración para repositorios
- Tests para guards, interceptors y filters

```bash
# Ejecutar todos los tests
npm test

# Ver cobertura
npm run test:cov
```

## Estructura de Base de Datos

### Tabla `users`

- `id` (number)
- `username` (string, único)
- `password` (string, hasheado)
- `role` (enum: 'user' | 'admin')
- `status` (boolean)

### Tabla `movies`

- `id` (UUID)
- `title` (string)
- `director` (string)
- `producer` (string)
- `releaseDate` (string)
- `status` (boolean)

## Contribución

Este es un proyecto de prueba técnica. Para el uso real, considera:

1. Implementar rate limiting
2. Agregar paginación en endpoints
3. Implementar caché (Redis)
4. Agregar logs más robustos (Winston, Pino)

## Notas del Desarrollador

- **Tiempo de desarrollo:** Aproximadamente 8 horas
- **Arquitectura:** Hexagonal/Clean Architecture para máxima escalabilidad
- **Seguridad:** JWT, bcrypt, validación de inputs, guards por roles
- **Testing:** Cobertura de casos críticos
- **Documentación:** Swagger completo y README detallado

## Autor

Victor Bravo Garcia

---

**¿Preguntas o problemas?** Abre un issue en el repositorio o contacta al desarrollador.
