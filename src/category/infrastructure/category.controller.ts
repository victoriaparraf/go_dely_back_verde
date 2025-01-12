import { Controller, Post, Get, Delete, Param, Body, Put, Patch } from '@nestjs/common';
import { CreateCategoryDto } from '../application/dto/create-category.dto';
import { UpdateCategoryDto } from '../application/dto/update-category.dto';
import { CategoryService } from './category.service';
import { CategoryMapper } from './mappers/category.mapper';
import { CategoryResponseDto } from '../application/dto/response-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.createCategory(createCategoryDto);
    return {
      message: 'Category created successfully',
      data: category,
    };
  }

  @Get('one/:id')
  async getCategoryById(@Param('id') id: string) {
    const category = await this.categoryService.getCategoryById(id);
    if (!category) {
      return { message: 'Category not found', statusCode: 404 };
    }
    return CategoryMapper.toResponse(category);
  }

  @Get('many')
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }

  @Patch('update/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<{ message: string; data: CategoryResponseDto }> {
    const updatedCategory = await this.categoryService.updateCategory(id, updateCategoryDto);
    return {
      message: 'Category updated successfully',
      data: CategoryResponseDto.fromDomain(updatedCategory),
    };
  }

  @Delete('delete/:id')
  async deleteCategory(@Param('id') id: string) {
    await this.categoryService.deleteCategory(id);
    return { message: 'Category deleted successfully' };
  }
}
