import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { UserRoles } from 'src/utility/common/user-roles.enum';
import { AuthorizeRoles } from 'src/utility/decorators/authorize-roles.decorator';
import { CategoryEntity } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // controller start here

  @AuthorizeRoles(UserRoles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizeGuard)
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.create(createCategoryDto, currentUser);
  }

  @Get()
  async asyncfindAll(): Promise<CategoryEntity[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CategoryEntity> {
    return await this.categoriesService.findOne(+id);
  }

  @AuthorizeRoles(UserRoles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizeGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
