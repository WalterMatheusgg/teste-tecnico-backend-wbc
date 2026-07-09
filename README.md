# E-commerce Backend API

API REST profissional para gerenciamento de categorias e produtos de um pequeno e-commerce, construída com Node.js 18+, TypeScript, Express, Prisma ORM e PostgreSQL.

## Tecnologias
- Node.js 18+
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Zod
- Vitest + Supertest
- Swagger/OpenAPI
- Docker Compose

## Arquitetura em camadas
- routes
- controllers
- services
- repositories
- schemas/validators
- middlewares

## Regras de negócio
- Categorias com nome obrigatório, único e soft delete.
- Produtos com preço maior que zero, estoque inteiro maior ou igual a zero e categoria obrigatória.
- Exclusão de categoria só é permitida se não houver produtos ativos vinculados.
- Listagens e buscas comuns ignoram registros com deletedAt preenchido.

## Configuração de ambiente
Crie um arquivo .env com base em .env.example:

```bash
cp .env.example .env
```

## Execução com Docker
```bash
docker compose up --build
```

A API ficará disponível em http://localhost:3000 e a documentação Swagger em http://localhost:3000/docs.

## Execução local
```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## Migrations
```bash
npm run prisma:migrate
```

## Testes
Os testes usam PostgreSQL real em um banco isolado.

```bash
cp .env.test.example .env.test
npm run test:integration
```

## Endpoints
### Categories
- POST /categories
- GET /categories?page=1&limit=10
- GET /categories/:id
- PUT /categories/:id
- DELETE /categories/:id

### Products
- POST /products
- GET /products?page=1&limit=10&categoryId=&priceMin=&priceMax=&name=
- GET /products/:id
- PUT /products/:id
- DELETE /products/:id

## Exemplos de chamadas
```bash
curl -X POST http://localhost:3000/categories -H 'Content-Type: application/json' -d '{"name":"Electronics"}'
curl http://localhost:3000/categories?page=1&limit=10
curl -X POST http://localhost:3000/products -H 'Content-Type: application/json' -d '{"name":"Laptop","price":999.99,"stock":10,"categoryId":"<category-id>"}'
```

## Observações
- O arquivo .env real não deve ser commitado.
- Os testes não usam mocks do Prisma e tampouco o mesmo banco do ambiente principal.
