import { Category } from "src/category/domain/category-aggregate";

export class CategoryResponseDto {
  constructor(
    public id: string,
    public name: string,
    public description?: string,
  ) {}

  static fromDomain(category: Category): CategoryResponseDto {
    return new CategoryResponseDto(
      category.getId().getValue(),
      category.getName().getValue(),
      category.getDescription().getValue(),
    );
  }
}