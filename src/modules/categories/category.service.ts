import { AppError } from '../../errors/AppError.js';
import { prisma } from '../../database/prisma.js';
import { CategoryRepository } from './category.repository.js';

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(name: string) {
    const existing = await this.categoryRepository.findByName(name);
    if (existing) {
      throw new AppError('Category already exists', 409);
    }

    return this.categoryRepository.create({ name });
  }

  async listCategories(page: number, limit: number) {
    const { items, total } = await this.categoryRepository.findMany(page, limit);
    return { items, total, page, limit };
  }

  async getCategory(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    return category;
  }

  async updateCategory(id: string, data: { name?: string }) {
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new AppError('Category not found', 404);
    }

    if (data.name && data.name !== existing.name) {
      const duplicate = await this.categoryRepository.findByName(data.name);
      if (duplicate && duplicate.id !== id) {
        throw new AppError('Category already exists', 409);
      }
    }

    return this.categoryRepository.update(id, data);
  }

  async deleteCategory(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return prisma.$transaction(async (tx) => {
      const hasActiveProducts = await tx.product.count({
        where: { categoryId: id, deletedAt: null },
      });

      if (hasActiveProducts > 0) {
        throw new AppError('Cannot delete category with active products', 409);
      }

      await tx.category.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return null;
    });
  }
}
