// استيراد جميع الـ decorators والـ guards المطلوبة من NestJS
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
// استيراد خدمة المنتجات والـ DTOs
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// استيراد الـ guards للحماية والصلاحيات
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { UserRoles } from 'src/utility/common/user-roles.enum';
import { AuthorizeRoles } from 'src/utility/decorators/authorize-roles.decorator';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
// استيراد الـ entities المطلوبة
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from './entities/product.entity';

// تعريف الـ controller للمنتجات مع route prefix '/products'
@Controller('products')
export class ProductsController {
  // حقن خدمة المنتجات عبر constructor injection
  constructor(private readonly productsService: ProductsService) {}

  /**
   * إنشاء منتج جديد
   * - محمي بـ Authentication Guard (المستخدم يجب أن يكون مسجل دخول)
   * - محمي بـ Authorization Guard (المستخدم يجب أن يكون ADMIN)
   * - يستقبل بيانات المنتج من الـ body
   * - يحصل على المستخدم الحالي من الـ token
   */
  @AuthorizeRoles(UserRoles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizeGuard)
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ProductEntity> {
    return await this.productsService.create(createProductDto, currentUser);
  }

  /**
   * جلب جميع المنتجات
   * - endpoint عام بدون حماية (يمكن لأي شخص الوصول إليه)
   * - يعيد قائمة بجميع المنتجات الموجودة في قاعدة البيانات
   */
  @Get()
  async findAll(@Query() query: any): Promise<any> {
    return await this.productsService.findAll(query);
  }

  /**
   * جلب منتج واحد بالـ ID
   * - endpoint عام بدون حماية
   * - يستقبل ID المنتج من الـ URL parameters
   * - يحول الـ ID من string إلى number باستخدام +id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductEntity> {
    return await this.productsService.findOne(+id);
  }

  /**
   * تعديل منتج موجود
   * - محمي بـ Authentication Guard (المستخدم يجب أن يكون مسجل دخول)
   * - محمي بـ Authorization Guard (المستخدم يجب أن يكون ADMIN)
   * - يستقبل ID المنتج من URL parameters
   * - يستقبل البيانات المحدثة من الـ body
   * - يحصل على المستخدم الحالي من الـ token
   */
  @AuthorizeRoles(UserRoles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizeGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ProductEntity> {
    return await this.productsService.update(
      +id,
      updateProductDto,
      currentUser,
    );
  }

  /**
   * حذف منتج
   * - بدون حماية حالياً (يجب إضافة حماية ADMIN)
   * - يستقبل ID المنتج من URL parameters
   * - يحول الـ ID من string إلى number
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
