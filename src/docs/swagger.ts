import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: 'Professional REST API for products and categories',
    },
    servers: [{ url: 'http://localhost:3000' }],
    paths: {
      '/categories': {
        post: {
          summary: 'Create category',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'Category created' },
            '400': { description: 'Validation error' },
            '409': { description: 'Category already exists' },
          },
        },
        get: {
          summary: 'List categories',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          ],
          responses: {
            '200': { description: 'Categories paginated' },
            '400': { description: 'Validation error' },
          },
        },
      },
      '/categories/{id}': {
        get: {
          summary: 'Get category by id',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '200': { description: 'Category found' },
            '404': { description: 'Category not found' },
          },
        },
        put: {
          summary: 'Update category',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Category updated' },
            '400': { description: 'Validation error' },
            '404': { description: 'Category not found' },
            '409': { description: 'Category already exists' },
          },
        },
        delete: {
          summary: 'Delete category',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '204': { description: 'Category deleted' },
            '404': { description: 'Category not found' },
            '409': { description: 'Category has active products' },
          },
        },
      },
      '/products': {
        post: {
          summary: 'Create product',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'price', 'stock', 'categoryId'],
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    stock: { type: 'integer' },
                    categoryId: { type: 'string', format: 'uuid' },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'Product created' },
            '400': { description: 'Validation error' },
            '404': { description: 'Category not found' },
          },
        },
        get: {
          summary: 'List products',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'categoryId', in: 'query', schema: { type: 'string', format: 'uuid' } },
            { name: 'priceMin', in: 'query', schema: { type: 'number' } },
            { name: 'priceMax', in: 'query', schema: { type: 'number' } },
            { name: 'name', in: 'query', schema: { type: 'string' } },
          ],
          responses: {
            '200': { description: 'Products paginated' },
            '400': { description: 'Validation error' },
          },
        },
      },
      '/products/{id}': {
        get: {
          summary: 'Get product by id',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '200': { description: 'Product found' },
            '404': { description: 'Product not found' },
          },
        },
        put: {
          summary: 'Update product',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    stock: { type: 'integer' },
                    categoryId: { type: 'string', format: 'uuid' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Product updated' },
            '400': { description: 'Validation error' },
            '404': { description: 'Category or product not found' },
          },
        },
        delete: {
          summary: 'Delete product',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '204': { description: 'Product deleted' },
            '404': { description: 'Product not found' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
