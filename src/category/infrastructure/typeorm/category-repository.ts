import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './category-entity';
import { CategoryAggregate } from 'src/category/domain/category-aggregate';
import { CategoryMapper } from '../mappers/category.mapper';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async save(category: CategoryAggregate): Promise<void> {
    const categoryEntity = CategoryMapper.toPersistence(category);
    await this.categoryRepo.save(categoryEntity);
  }

  async findById(id: string): Promise<CategoryAggregate | null> {
    const categoryEntity = await this.categoryRepo.findOne({ where: { category_id: id }, relations: ['products'] });
    if (!categoryEntity) return null;
    return CategoryMapper.toDomain(categoryEntity);
  }

  async findAll(): Promise<CategoryAggregate[]> {
    const categoryEntities = await this.categoryRepo.find({ relations: ['products'] });
    return categoryEntities.map((entity) => CategoryMapper.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepo.delete(id);
  }
}
