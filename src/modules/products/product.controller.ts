import type { NextFunction, Request, Response } from 'express';
import { successResponse } from '../../utils/api-response.js';
import { buildPaginationMeta } from '../../utils/pagination.js';
import { ProductService } from './product.service.js';

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.createProduct(req.body);
      return res.status(201).json(successResponse(product));
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = {
        page: Number(req.query.page ?? 1),
        limit: Number(req.query.limit ?? 10),
        categoryId: req.query.categoryId ? String(req.query.categoryId) : undefined,
        priceMin: req.query.priceMin ? Number(req.query.priceMin) : undefined,
        priceMax: req.query.priceMax ? Number(req.query.priceMax) : undefined,
        name: req.query.name ? String(req.query.name) : undefined,
      };
      const result = await this.productService.listProducts(filters);
      return res.status(200).json(successResponse(result.items, buildPaginationMeta(result.page, result.limit, result.total)));
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.getProduct(String(req.params.id));
      return res.status(200).json(successResponse(product));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.updateProduct(String(req.params.id), req.body);
      return res.status(200).json(successResponse(product));
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.productService.deleteProduct(String(req.params.id));
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
