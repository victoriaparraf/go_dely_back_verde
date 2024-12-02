import { CategoryRepository } from '../../domain/repositories/category.repository.interface';
import { Category } from '../../domain/category-aggregate';
import { CategoryID } from '../../domain/value-objects/category-id.vo';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CategoryEntity } from './category-entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TypeORMCategoryRepository implements CategoryRepository {

    constructor(
        @InjectRepository(CategoryEntity)
        private readonly ormRepository: Repository<CategoryEntity>,
    ) {}

    async save(category: Category): Promise<void> {
      const entity = new CategoryEntity();
      entity.category_id = category.getId().getValue();
      entity.category_name = category.getName().getValue();
      entity.category_description = category.getDescription().getValue();
  
      await this.ormRepository.save(entity);
    }

    async findById(id: CategoryID): Promise<Category | null> {
        const entity = await this.ormRepository.findOne({ where: { category_id: id.value } });
        if (!entity) return null;

        return Category.reconstitute(
            new CategoryID(entity.category_id),
            entity.category_name,
            entity.category_description
        );
    }

    async findAll(): Promise<Category[]> {
        const entities = await this.ormRepository.find();
        return entities.map(entity => 
            Category.reconstitute(
                new CategoryID(entity.category_id),
                entity.category_name,
                entity.category_description
            )
        );
    }

    async update(category: Category): Promise<void> {
        const entity = await this.ormRepository.findOne({
            where: { category_id: category.getId().getValue() },
        });
    
        if (!entity) {
            throw new Error(`Category with ID ${category.getId().getValue()} not found`);
        }
    
        entity.category_name = category.getName().getValue();
        entity.category_description = category.getDescription().getValue();
    
        await this.ormRepository.save(entity);
    }
    

    async delete(id: CategoryID): Promise<void> {
        await this.ormRepository.delete({ category_id: id.value });
    }
}
