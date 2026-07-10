
# E-commerce Backend API

API REST para gerenciamento de categorias e produtos, construída com Node.js 18+, TypeScript, Express, Prisma ORM e PostgreSQL.

## Tecnologias

Node.js 18+ · TypeScript · Express · Prisma ORM · PostgreSQL · Zod · Vitest + Supertest · Swagger/OpenAPI · Docker Compose

## Arquitetura

O projeto segue uma arquitetura em camadas:

`routes` → `controllers` → `services` → `repositories`

As validações são feitas com Zod em `schemas`, e o tratamento de erros é centralizado em `middlewares`.

O `repository` é o único ponto de acesso direto ao Prisma.

## Regras de negócio

- Categoria possui nome obrigatório e único.
- Produto possui preço maior que zero.
- Produto possui estoque inteiro e não negativo.
- Produto deve estar vinculado a uma categoria existente.
- Categoria com produtos ativos vinculados não pode ser excluída.
- A exclusão é feita com soft delete.
- Registros com `deletedAt` preenchido são ignorados em listagens e buscas comuns.

---

## Como rodar

### Opção A: Docker

Forma recomendada para executar o projeto.

```bash
cp .env.example .env
docker compose up --build
````

Esse comando sobe:

* API
* PostgreSQL de desenvolvimento
* PostgreSQL de teste
* migrations do Prisma
* aplicação em modo desenvolvimento

A API ficará disponível em:

```txt
http://localhost:3000
```

Swagger:

```txt
http://localhost:3000/docs/
```

Para parar os containers:

```bash
docker compose down
```

Para parar os containers e apagar os volumes do banco:

```bash
docker compose down -v
```

---

### Opção B: Local sem Docker

Pré-requisitos:

* Node.js 18+
* PostgreSQL rodando localmente
* Banco `ecommerce` criado no PostgreSQL

Instale as dependências:

```bash
npm install
```

Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

Ajuste a `DATABASE_URL` no `.env`, se necessário:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce?schema=public
```

Se o banco ainda não existir, crie com:

```bash
createdb ecommerce
```

Gere o Prisma Client:

```bash
npm run prisma:generate
```

Aplique as migrations:

```bash
npm run prisma:migrate
```

Inicie a aplicação:

```bash
npm run dev
```

A API ficará disponível em:

```txt
http://localhost:3000
```

---

## Migrations

As migrations já estão versionadas em `prisma/migrations`.

Para aplicar migrations existentes:

```bash
npm run prisma:migrate
```

Para criar/aplicar migrations durante desenvolvimento:

```bash
npm run prisma:migrate:dev
```

Para gerar o Prisma Client:

```bash
npm run prisma:generate
```

---

## Testes

Os testes de integração rodam contra um PostgreSQL real, isolado do banco de desenvolvimento.

Banco de teste:

```txt
ecommerce_test
```

Porta:

```txt
5433
```

Crie o arquivo `.env.test`:

```bash
cp .env.test.example .env.test
```

Suba o banco de teste:

```bash
docker compose up -d db-test
```

Aplique as migrations no banco de teste:

```bash
npm run prisma:migrate:test
```

Execute os testes de integração:

```bash
npm run test:integration
```

O código de teste recusa rodar caso a `DATABASE_URL` não aponte para um banco de teste. Essa proteção evita sobrescrever ou limpar dados do banco de desenvolvimento por engano.

---

## Endpoints

### Categories

* `POST /categories`
* `GET /categories?page=&limit=`
* `GET /categories/:id`
* `PUT /categories/:id`
* `DELETE /categories/:id`

### Products

* `POST /products`
* `GET /products?page=&limit=&categoryId=&priceMin=&priceMax=&name=`
* `GET /products/:id`
* `PUT /products/:id`
* `DELETE /products/:id`

---

## Exemplos de chamadas

### Criar categoria

```bash
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Electronics"}'
```

### Criar produto

Substitua `<category-id>` pelo ID de uma categoria existente.

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 999.99,
    "stock": 10,
    "categoryId": "<category-id>"
  }'
```

### Listar produtos com filtros

```bash
curl "http://localhost:3000/products?page=1&limit=10&name=lap&priceMin=100&priceMax=2000"
```

---

## Scripts disponíveis

Iniciar a aplicação em desenvolvimento:

```bash
npm run dev
```

Compilar o projeto TypeScript:

```bash
npm run build
```

Iniciar a versão compilada:

```bash
npm start
```

Gerar Prisma Client:

```bash
npm run prisma:generate
```

Aplicar migrations existentes:

```bash
npm run prisma:migrate
```

Criar/aplicar migrations em desenvolvimento:

```bash
npm run prisma:migrate:dev
```

Aplicar migrations no banco de teste:

```bash
npm run prisma:migrate:test
```

Executar testes de integração:

```bash
npm run test:integration
```

---

## Observações

* O arquivo `.env` real não é commitado.
* O arquivo `.env.test` real não é commitado.
* Apenas `.env.example` e `.env.test.example` devem estar no repositório.
* Os testes usam PostgreSQL real, sem mock do Prisma.
* O banco de teste é separado do banco de desenvolvimento.
* O projeto utiliza soft delete com `deletedAt`.
