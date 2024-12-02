import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryName } from '../domain/value-objects/category-name.vo';
import { CategoryDescription } from '../domain/value-objects/category-description.vo';
import { CreateCategoryDto } from '../application/dto/create-category.dto';
import { UpdateCategoryDto } from '../application/dto/update-category.dto';
import { Category } from '../domain/category-aggregate';
import { TypeORMCategoryRepository } from './typeorm/category-repository';
import { CategoryID } from '../domain/value-objects/category-id.vo';
import { CategoryMapper } from './mappers/category.mapper';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: TypeORMCategoryRepository) {}

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, description } = createCategoryDto;

    const categoryId = new CategoryID();
    const categoryName = new CategoryName(name);
    const categoryDescription = new CategoryDescription(description);

    const categoryAggregate = new Category(
      categoryId,
      categoryName,
      categoryDescription
    );

    await this.categoryRepository.save(categoryAggregate);
    return categoryAggregate;
  }

  async getCategoryById(id: string): Promise<Category> {
    const categoryId = new CategoryID(id);
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }
    return category;
  }

  async getAllCategories(): Promise<Category[]> {
    const categories = await this.categoryRepository.findAll();
    return categories.map(category => CategoryMapper.toResponse(category));
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {

    const categoryId = new CategoryID(id); 
    const existingCategory = await this.categoryRepository.findById(categoryId);
  
    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  
    existingCategory.updateName(new CategoryName(updateCategoryDto.name));
    existingCategory.updateDescription(new CategoryDescription(updateCategoryDto.description)); 
  
    await this.categoryRepository.save(existingCategory);
  
    return existingCategory;
  }
  

  async deleteCategory(id: string): Promise<void> {
    await this.getCategoryById(id);
    const categoryId = new CategoryID(id);
    await this.categoryRepository.delete(categoryId);
  }
}
