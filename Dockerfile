# ========================
# BUILD STAGE
# ========================
FROM node:22-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y lock
COPY package*.json ./

# Instalar dependencias de desarrollo
RUN npm ci

# Copiar el resto del código
COPY . .

# Compilar el proyecto (TypeScript → JavaScript)
RUN npm run build

# ========================
# RUNTIME STAGE
# ========================
FROM node:22-alpine AS runner

WORKDIR /app

# Copiar package.json y lock
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# Copiar solo el código compilado
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 3000

# Comando de arranque
CMD ["node", "dist/main.js"]
