import type { NextFunction, Request, Response } from 'express';
import { successResponse } from '../../utils/api-response.js';
import { buildPaginationMeta } from '../../utils/pagination.js';
import { CategoryService } from './category.service.js';

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.createCategory(req.body.name);
      return res.status(201).json(successResponse(category));
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);
      const result = await this.categoryService.listCategories(page, limit);
      return res.status(200).json(successResponse(result.items, buildPaginationMeta(result.page, result.limit, result.total)));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.getCategory(String(req.params.id));
      return res.status(200).json(successResponse(category));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.updateCategory(String(req.params.id), req.body);
      return res.status(200).json(successResponse(category));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.categoryService.deleteCategory(String(req.params.id));
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
