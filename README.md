# Mundial Full-Stack (Next.js + Prisma + PostgreSQL)

## Requisitos
- Node.js 20+
- PostgreSQL

## Configuración
1. Copia variables: `cp .env.example .env`
2. Instala dependencias: `npm install`
3. Genera Prisma Client: `npx prisma generate`
4. Migra base de datos: `npx prisma migrate dev --name init`
5. Ejecuta seed obligatorio: `npm run seed`
6. Inicia app: `npm run dev`

## API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET/PATCH /api/matches`
- `GET /api/standings`
- `GET /api/third-places`
- `POST /api/simulate`

## Demo seed
- usuario: `demo@worldcup.local`
- password: `password123`

La semilla incluye **todos** los equipos y **todos** los partidos de la fase de grupos definidos, y genera eliminatorias dinámicamente a partir de resultados.
