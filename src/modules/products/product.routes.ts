import { Router } from 'express';
import { prisma } from '../../database/prisma.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { ProductController } from './product.controller.js';
import { ProductRepository } from './product.repository.js';
import { ProductService } from './product.service.js';
import { productCreateSchema, productIdParamSchema, productListSchema, productUpdateSchema } from './product.schemas.js';

const router = Router();
const productRepository = new ProductRepository(prisma);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

router.post('/', validate(productCreateSchema), productController.create);
router.get('/', validate(productListSchema), productController.list);
router.get('/:id', validate(productIdParamSchema), productController.getById);
router.put('/:id', validate(productUpdateSchema), productController.update);
router.delete('/:id', validate(productIdParamSchema), productController.delete);

export default router;
