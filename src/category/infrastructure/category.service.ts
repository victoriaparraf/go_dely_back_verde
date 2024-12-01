import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryName } from '../domain/value-objects/category-name.vo';
import { CategoryDescription } from '../domain/value-objects/category-description.vo';
import { CreateCategoryDto } from '../application/dto/create-category.dto';
import { UpdateCategoryDto } from '../application/dto/update-category.dto';
import { CategoryAggregate } from '../domain/category-aggregate';
import { CategoryRepository } from './typeorm/category-repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryAggregate> {
    const { name, description } = createCategoryDto;

    const categoryName = new CategoryName(name);
    const categoryDescription = new CategoryDescription(description);

    const categoryAggregate = new CategoryAggregate(
      null,
      categoryName,
      categoryDescription,
      []
    );

    await this.categoryRepository.save(categoryAggregate);
    return categoryAggregate;
  }

  async getCategoryById(id: string): Promise<CategoryAggregate> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }
    return category;
  }

  async getAllCategories(): Promise<CategoryAggregate[]> {
    return await this.categoryRepository.findAll();
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryAggregate> {
    const category = await this.getCategoryById(id);

    const { name, description } = updateCategoryDto;

    if (name) {
      category.updateName(new CategoryName(name));
    }

    if (description) {
      category.updateDescription(new CategoryDescription(description));
    }

    await this.categoryRepository.save(category);
    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    await this.getCategoryById(id);
    await this.categoryRepository.delete(id);
  }
}
