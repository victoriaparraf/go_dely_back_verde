import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../domain/category-aggregate';
import { CategoryID } from '../../domain/value-objects/category-id.vo';
import { CategoryRepository } from '../../domain/repositories/category.repository.interface';
import { CategoryEntity } from './category-entity';
import { Injectable } from '@nestjs/common';
import { CategoryName } from 'src/category/domain/value-objects/category-name.vo';
import { CategoryImage } from 'src/category/domain/value-objects/category-image.vo';

@Injectable()
export class TypeORMCategoryRepository implements CategoryRepository {
    
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
    ) {}

    async save(category: Category): Promise<void> {
        const categoryEntity = new CategoryEntity();
        categoryEntity.category_id = category.id.getValue();
        categoryEntity.category_name = category.getName().getValue();
        categoryEntity.category_image = category.getImage().getValue();
        await this.categoryRepository.save(categoryEntity);
    }

    async findById(id: CategoryID): Promise<Category | undefined> {
        const categoryEntity = await this.categoryRepository.findOne({
          where: { category_id: id.getValue() },
        });
      
        if (!categoryEntity) {
          return undefined;
        }
      
        return new Category(
          new CategoryID(categoryEntity.category_id),
          new CategoryName(categoryEntity.category_name),
          new CategoryImage(categoryEntity.category_image)
        );
    }
      

    async findAll(): Promise<Category[]> {
        const categoryEntities = await this.categoryRepository.find();
        return categoryEntities.map(entity => new Category(
            new CategoryID(entity.category_id),
            new CategoryName(entity.category_name),
            new CategoryImage(entity.category_image),
        ));
    }

    async delete(id: CategoryID): Promise<void> {
        await this.categoryRepository.delete(id.toString());
    }
}