import { Controller, Post, Get, Delete, Param, Body, Put } from '@nestjs/common';
import { CreateCategoryDto } from '../application/dto/create-category.dto';
import { UpdateCategoryDto } from '../application/dto/update-category.dto';
import { CategoryService } from './category.service';
import { CategoryMapper } from './mappers/category.mapper';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.createCategory(createCategoryDto);
    return {
      message: 'Category created successfully',
      data: category,
    };
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    const category = await this.categoryService.getCategoryById(id);
    if (!category) {
      return { message: 'Category not found', statusCode: 404 };
    }
    return CategoryMapper.toResponse(category);
  }

  @Get()
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const updatedCategory = await this.categoryService.updateCategory(id, updateCategoryDto);
    return {
      message: 'Category updated successfully',
      data: updatedCategory,
    };
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    await this.categoryService.deleteCategory(id);
    return { message: 'Category deleted successfully' };
  }
}
