import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { OrderStatus } from 'src/orders/enums/order-status.enum';

// Interface للـ query parameters
interface FindAllQuery {
  limit?: string | number;
  page?: string | number;
}

// Interface للـ response
interface FindAllResponse {
  products: ProductEntity[];
  totalProducts: number;
  limit: number;
  currentPage: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoriesService: CategoriesService,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    const category = await this.categoriesService.findOne(
      +createProductDto.categoryId,
    );
    const product = this.productRepository.create(createProductDto);
    product.category = category;
    product.addedBy = currentUser;
    return await this.productRepository.save(product);
  }

  async findAll(query: FindAllQuery): Promise<FindAllResponse> {
    let limit: number;
    let page: number;

    // تحديد الـ limit (عدد المنتجات في الصفحة)
    if (!query.limit) {
      limit = 4;
    } else {
      limit = parseInt(String(query.limit));
    }

    // تحديد رقم الصفحة
    if (!query.page) {
      page = 1;
    } else {
      page = parseInt(String(query.page));
    }

    // حساب الـ offset
    const offset = (page - 1) * limit;

    // إنشاء query builder
    const queryBuilder = this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.reviews', 'review')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.addedBy', 'addedBy')
      .select([
        'products.id',
        'products.title',
        'products.price',
        'products.stock',
        'products.createdAt',
        'products.updatedAt',
        'category.id',
        'category.title',
        'addedBy.id',
        'addedBy.name',
      ])
      .addSelect('COUNT(review.id)', 'reviewCount')
      .addSelect(
        'COALESCE(AVG(review.ratings), 0)::DECIMAL(10,2)',
        'averageRating',
      )
      .groupBy('products.id, category.id, addedBy.id')
      .orderBy('products.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);

    // الحصول على المنتجات والعدد الإجمالي
    const [products, totalProducts] = await Promise.all([
      queryBuilder.getRawAndEntities(),
      this.productRepository.count(),
    ]);

    // تحويل البيانات إلى الشكل المطلوب
    const productsWithStats = products.entities.map((product, index) => {
      const rawData = products.raw[index] as {
        reviewCount?: string;
        averageRating?: string;
      };
      return {
        ...product,
        reviewCount: parseInt(String(rawData?.reviewCount || 0)) || 0,
        averageRating: parseFloat(String(rawData?.averageRating || 0)) || 0,
      };
    });

    return {
      products: productsWithStats,
      totalProducts,
      limit,
      currentPage: page,
    };
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { addedBy: true, category: true },
      select: {
        addedBy: { id: true, name: true },
        category: { id: true, title: true },
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: Partial<UpdateProductDto>,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    product.addedBy = currentUser;
    if (updateProductDto.categoryId) {
      const category = await this.categoriesService.findOne(
        +updateProductDto.categoryId,
      );
      product.category = category;
    }
    return await this.productRepository.save(product);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async updateStock(id: number, stock: number, status: string) {
    let product = await this.findOne(id);
    if (status === OrderStatus.DELIVERED.toString()) {
      product.stock -= stock;
    } else {
      product.stock += stock;
    }
    product = await this.productRepository.save(product);
    return product;
  }
}
