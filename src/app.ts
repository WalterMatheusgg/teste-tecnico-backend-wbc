import express from 'express';
import cors from 'cors';
import categoryRoutes from './modules/categories/category.routes.js';
import productRoutes from './modules/products/product.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.status(200).json({ success: true, data: { status: 'ok' } }));
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorMiddleware);

export default app;
