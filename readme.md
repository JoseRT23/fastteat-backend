
# Fastteat 

Project developed with Express - Node - Prisma

- Node.js >= 22
- Prisma

## Installation

Clone the project

```bash
  git clone https://github.com/JoseRT23/fastteat-backend.git
```

Go to the project directory

```bash
  cd fastteat-backend
```

Install dependencies

```bash
  npm install
```

Generate Prisma Client

```bash
  npx prisma generate
```

Create a index.ts file into src/generated/prisma and add the follow code

```bash
  export * from './client';
```

Run docker-compose to create Postgres database

```bash
  docker-compose up -d
```

Start the server

```bash
  npm run dev
```

