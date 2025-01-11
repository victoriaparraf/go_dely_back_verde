import { CategoryEntity } from '../typeorm/category-entity';
import { CategoryName } from '../../domain/value-objects/category-name.vo';
import { CategoryDescription } from '../../domain/value-objects/category-description.vo';
import { Category } from 'src/category/domain/category-aggregate';
import { CategoryID } from 'src/category/domain/value-objects/category-id.vo';

export class CategoryMapper {
  
  static toDomain(entity: CategoryEntity): Category {
    return new Category(
      new CategoryID(entity.id),
      new CategoryName(entity.name),
      new CategoryDescription(entity.description)
    );
  }

  static toPersistence(aggregate: Category): CategoryEntity {
    const entity = new CategoryEntity();
    entity.id = aggregate.getId().getValue();
    entity.name = aggregate.getName().getValue();
    entity.description = aggregate.getDescription().getValue();
    return entity;
  }

  static toResponse(aggregate: Category): any {
    return {
      id: aggregate.getId().getValue(),
      name: aggregate.getName().getValue(),
      description: aggregate.getDescription().getValue(),
    };
  }
}

