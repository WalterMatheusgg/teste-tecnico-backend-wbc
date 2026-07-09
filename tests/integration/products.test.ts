import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import app from '../../src/app.js';
import { prisma } from '../../src/database/prisma.js';
import { cleanDatabase } from '../helpers/cleanDatabase.js';

beforeEach(async () => {
  await cleanDatabase();
});

describe('Products integration', () => {
  it('creates a product with an existing category', async () => {
    const category = await prisma.category.create({ data: { name: 'Tech' } });
    const response = await request(app).post('/products').send({
      name: 'Laptop',
      price: 999.99,
      stock: 10,
      categoryId: category.id,
    });
    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe('Laptop');
  });

  it('does not create a product with nonexistent category', async () => {
    const response = await request(app).post('/products').send({
      name: 'Phone',
      price: 100,
      stock: 5,
      categoryId: '00000000-0000-0000-0000-000000000000',
    });
    expect(response.status).toBe(404);
  });

  it('does not create a product with price <= 0', async () => {
    const category = await prisma.category.create({ data: { name: 'Tools' } });
    const response = await request(app).post('/products').send({ name: 'Hammer', price: 0, stock: 2, categoryId: category.id });
    expect(response.status).toBe(400);
  });

  it('does not create a product with negative stock', async () => {
    const category = await prisma.category.create({ data: { name: 'Tools' } });
    const response = await request(app).post('/products').send({ name: 'Hammer', price: 10, stock: -1, categoryId: category.id });
    expect(response.status).toBe(400);
  });

  it('does not create a product with decimal stock', async () => {
    const category = await prisma.category.create({ data: { name: 'Tools' } });
    const response = await request(app).post('/products').send({ name: 'Hammer', price: 10, stock: 1.5, categoryId: category.id });
    expect(response.status).toBe(400);
  });

  it('lists products with pagination', async () => {
    const category = await prisma.category.create({ data: { name: 'Desk' } });
    await prisma.product.createMany({ data: [{ name: 'Mouse', price: 10, stock: 5, categoryId: category.id }, { name: 'Keyboard', price: 20, stock: 3, categoryId: category.id }] });
    const response = await request(app).get('/products?page=1&limit=1');
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.meta.total).toBe(2);
  });

  it('filters products by category', async () => {
    const first = await prisma.category.create({ data: { name: 'A1' } });
    const second = await prisma.category.create({ data: { name: 'A2' } });
    await prisma.product.create({ data: { name: 'Item', price: 10, stock: 3, categoryId: first.id } });
    await prisma.product.create({ data: { name: 'Item 2', price: 10, stock: 3, categoryId: second.id } });
    const response = await request(app).get(`/products?categoryId=${first.id}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it('filters products by price range', async () => {
    const category = await prisma.category.create({ data: { name: 'Range' } });
    await prisma.product.create({ data: { name: 'Cheap', price: 10, stock: 2, categoryId: category.id } });
    await prisma.product.create({ data: { name: 'Expensive', price: 50, stock: 2, categoryId: category.id } });
    const response = await request(app).get('/products?priceMin=15&priceMax=60');
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it('searches products by partial name case-insensitive', async () => {
    const category = await prisma.category.create({ data: { name: 'Search' } });
    await prisma.product.create({ data: { name: 'Blue Mug', price: 15, stock: 4, categoryId: category.id } });
    const response = await request(app).get('/products?name=mug');
    expect(response.status).toBe(200);
    expect(response.body.data[0].name).toContain('Mug');
  });

  it('gets product by id with category', async () => {
    const category = await prisma.category.create({ data: { name: 'Details' } });
    const product = await prisma.product.create({ data: { name: 'Table', price: 30, stock: 1, categoryId: category.id } });
    const response = await request(app).get(`/products/${product.id}`);
    expect(response.status).toBe(200);
    expect(response.body.data.category.id).toBe(category.id);
  });

  it('updates a product', async () => {
    const category = await prisma.category.create({ data: { name: 'Update' } });
    const product = await prisma.product.create({ data: { name: 'Chair', price: 20, stock: 3, categoryId: category.id } });
    const response = await request(app).put(`/products/${product.id}`).send({ name: 'Desk Chair', price: 25 });
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe('Desk Chair');
  });

  it('soft deletes a product', async () => {
    const category = await prisma.category.create({ data: { name: 'Delete' } });
    const product = await prisma.product.create({ data: { name: 'Bottle', price: 8, stock: 4, categoryId: category.id } });
    const response = await request(app).delete(`/products/${product.id}`);
    expect(response.status).toBe(204);
    const updated = await prisma.product.findUnique({ where: { id: product.id } });
    expect(updated?.deletedAt).not.toBeNull();
  });
});
