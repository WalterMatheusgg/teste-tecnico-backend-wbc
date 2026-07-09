import { Prisma, PrismaClient } from '@prisma/client';

export class ProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: string;
  }) {
    return this.prisma.product.create({ data });
  }

  async findById(id: string) {
    return this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: { category: true },
    });
  }

  async findMany(filters: {
    page: number;
    limit: number;
    categoryId?: string;
    priceMin?: number;
    priceMax?: number;
    name?: string;
  }) {
    const { page, limit, categoryId, priceMin, priceMax, name } = filters;
    const where: Prisma.ProductWhereInput = { deletedAt: null };

    if (categoryId) where.categoryId = categoryId;
    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) where.price = { ...where.price, gte: priceMin };
      if (priceMax !== undefined) where.price = { ...where.price, lte: priceMax };
    }
    if (name) where.name = { contains: name, mode: 'insensitive' };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total };
  }

  async update(id: string, data: Record<string, unknown>) {
    return this.prisma.product.update({ where: { id }, data });
  }

  async softDelete(id: string, deletedAt: Date) {
    return this.prisma.product.update({ where: { id }, data: { deletedAt } });
  }

  async categoryExists(id: string) {
    const category = await this.prisma.category.findFirst({ where: { id, deletedAt: null } });
    return Boolean(category);
  }
}
