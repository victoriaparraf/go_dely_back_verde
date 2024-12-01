import { Controller, Post, Get, Delete, Param, Body, Put } from '@nestjs/common';
import { CreateCategoryDto } from '../application/dto/create-category.dto';
import { UpdateCategoryDto } from '../application/dto/update-category.dto';
import { CategoryService } from './category.service';

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
    if (category !== null) {
      return { data: category };
    } else {
      return { message: 'Category not found', statusCode: 404 };
    }
  }

  @Get()
  async getAllCategories() {
    const categories = await this.categoryService.getAllCategories();
    return { data: categories };
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
