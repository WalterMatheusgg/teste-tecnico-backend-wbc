import { AppError } from '../../errors/AppError.js';
import { ProductRepository } from './product.repository.js';

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(data: { name: string; description?: string; price: number; stock: number; categoryId: string }) {
    const categoryExists = await this.productRepository.categoryExists(data.categoryId);
    if (!categoryExists) {
      throw new AppError('Category not found', 404);
    }

    return this.productRepository.create(data);
  }

  async listProducts(filters: { page: number; limit: number; categoryId?: string; priceMin?: number; priceMax?: number; name?: string }) {
    const { items, total } = await this.productRepository.findMany(filters);
    return { items, total, page: filters.page, limit: filters.limit };
  }

  async getProduct(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async updateProduct(id: string, data: Record<string, unknown>) {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new AppError('Product not found', 404);
    }

    if (data.categoryId) {
      const categoryExists = await this.productRepository.categoryExists(String(data.categoryId));
      if (!categoryExists) {
        throw new AppError('Category not found', 404);
      }
    }

    return this.productRepository.update(id, data);
  }

  async deleteProduct(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await this.productRepository.softDelete(id, new Date());
    return null;
  }
}
