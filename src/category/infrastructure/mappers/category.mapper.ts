import { CategoryEntity } from '../typeorm/category-entity';
import { CategoryName } from '../../domain/value-objects/category-name.vo';
import { CategoryDescription } from '../../domain/value-objects/category-description.vo';
import { CategoryAggregate } from 'src/category/domain/category-aggregate';

export class CategoryMapper {
  
  static toDomain(entity: CategoryEntity): CategoryAggregate {
    return new CategoryAggregate(
      entity.category_id,
      new CategoryName(entity.category_name),
      new CategoryDescription(entity.category_description)
    );
  }

  static toPersistence(aggregate: CategoryAggregate): CategoryEntity {
    const entity = new CategoryEntity();
    entity.category_id = aggregate.getId();
    entity.category_name = aggregate.getName();
    entity.category_description = aggregate.getDescription();
    return entity;
  }
}
