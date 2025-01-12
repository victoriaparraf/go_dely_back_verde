import { Controller, Post, Get, Delete, Param, Body, Patch } from '@nestjs/common';
import { CreateCategoryService } from 'src/category/application/command/create-category-service';
import { DeleteCategoryService } from 'src/category/application/command/delete-category-service';
import { UpdateCategoryService } from 'src/category/application/command/update-category-service';
import { CreateCategoryResponseDto } from 'src/category/application/dto/response/create-category-response.dto';
import { GetAllCategoriesService } from 'src/category/application/query/get-all-categories-service';
import { GetCategoryByIdService } from 'src/category/application/query/get-category-by-id-service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly createCategoryService: CreateCategoryService,
    private readonly updateCategoryService: UpdateCategoryService,
    private readonly deleteCategoryService: DeleteCategoryService,
    private readonly getCategoryByIdService: GetCategoryByIdService,
    private readonly getAllCategoriesService: GetAllCategoriesService,
  ) {}

  @Post('create')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.createCategoryService.execute(createCategoryDto);
    return {
      message: 'Category created successfully',
      data: category,
    };
  }

  @Get('one/:id')
  async getCategoryById(@Param('id') id: string) {
    const category = await this.getCategoryByIdService.execute(id);
    if (!category) {
      return { message: 'Category not found', statusCode: 404 };
    }
    return category;
  }

  @Get('many')
  async getAllCategories() {
    const categories = await this.getAllCategoriesService.execute();
    return categories;
  }

  @Patch('update/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<{ message: string; data: CreateCategoryResponseDto }> {
    const updatedCategory = await this.updateCategoryService.execute({ id, updateCategoryDto });
    return {
      message: 'Category updated successfully',
      data: updatedCategory,
    };
  }

  @Delete('delete/:id')
  async deleteCategory(@Param('id') id: string) {
    await this.deleteCategoryService.execute(id);
    return { message: 'Category deleted successfully' };
  }
  
}