import { Prisma, PrismaClient } from '@prisma/client';

export class CategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: { name: string }) {
    return this.prisma.category.create({ data });
  }

  async findById(id: string) {
    return this.prisma.category.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByName(name: string) {
    return this.prisma.category.findFirst({
      where: { name, deletedAt: null },
    });
  }

  async findMany(page: number, limit: number) {
    const [items, total] = await Promise.all([
      this.prisma.category.findMany({
        where: { deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.category.count({ where: { deletedAt: null } }),
    ]);

    return { items, total };
  }

  async update(id: string, data: { name?: string }) {
    return this.prisma.category.update({ where: { id }, data });
  }

  async softDelete(id: string, deletedAt: Date) {
    return this.prisma.category.update({
      where: { id },
      data: { deletedAt },
    });
  }

  async hasActiveProducts(id: string) {
    const count = await this.prisma.product.count({
      where: { categoryId: id, deletedAt: null },
    });

    return count > 0;
  }

  async findByIdWithProducts(id: string) {
    return this.prisma.category.findFirst({
      where: { id, deletedAt: null },
      include: { products: { where: { deletedAt: null } } },
    });
  }
}
