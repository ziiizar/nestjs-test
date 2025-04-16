# NestJS Authentication API

API de autenticación construida con NestJS, Prisma, y JWT.

## Tecnologías

- NestJS
- PostgreSQL (Neon.tech)
- Prisma ORM
- JWT Authentication
- TypeScript

## Configuración

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
Crear archivo `.env` con:
```env
DATABASE_URL='postgresql://neondb_owner:npg_cSNw03zVXjRy@ep-delicate-mode-a4ck9jcf-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require'
SESSION_SECRET='jnluMVwFpR'
```

3. Ejecutar migraciones de Prisma:
```bash
npx prisma migrate dev
```

4. Iniciar el servidor:
```bash
npm run start:dev
```


