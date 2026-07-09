import { Router } from 'express';
import { prisma } from '../../database/prisma.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { CategoryController } from './category.controller.js';
import { CategoryRepository } from './category.repository.js';
import { CategoryService } from './category.service.js';
import { categoryCreateSchema, categoryListSchema, categoryUpdateSchema, categoryIdParamSchema } from './category.schemas.js';

const router = Router();
const categoryRepository = new CategoryRepository(prisma);
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

router.post('/', validate(categoryCreateSchema), categoryController.create);
router.get('/', validate(categoryListSchema), categoryController.list);
router.get('/:id', validate(categoryIdParamSchema), categoryController.getById);
router.put('/:id', validate(categoryUpdateSchema), categoryController.update);
router.delete('/:id', validate(categoryIdParamSchema), categoryController.delete);

export default router;
