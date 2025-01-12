import { Category } from 'src/category/domain/category-aggregate';
import { CreateCategoryResponseDto } from 'src/category/application/dto/response/create-category-response.dto';

export class CategoryMapper {
  static mapCategoryToResponse(category: Category): CreateCategoryResponseDto {
    return {
      id: category.getId().getValue(),
      name: category.getName().getValue(),
      image: category.getImage().getValue(),
    };
  }
}

