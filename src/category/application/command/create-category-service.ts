import { Injectable } from '@nestjs/common';
import { IApplicationService } from 'src/common/application/application-service.interface';
import { CreateCategoryDto } from '../../infrastructure/dto/create-category.dto';
import { CreateCategoryResponseDto } from '../dto/response/create-category-response.dto';
import { Category } from '../../domain/category-aggregate';
import { CategoryID } from '../../domain/value-objects/category-id.vo';
import { CategoryName } from '../../domain/value-objects/category-name.vo';
import { CategoryImage } from '../../domain/value-objects/category-image.vo';
import { CategoryMapper } from 'src/category/infrastructure/mappers/category.mapper';
import { TypeORMCategoryRepository } from 'src/category/infrastructure/typeorm/category-repository';

@Injectable()
export class CreateCategoryService implements IApplicationService<CreateCategoryDto, CreateCategoryResponseDto> {
  
  constructor(private readonly repository: TypeORMCategoryRepository) {}

  async execute(createCategoryDto: CreateCategoryDto): Promise<CreateCategoryResponseDto> {
    const { name, image } = createCategoryDto;

    const categoryId = new CategoryID();
    const categoryName = new CategoryName(name);
    const categoryImage = new CategoryImage(image);

    const categoryAggregate = new Category(
      categoryId,
      categoryName,
      categoryImage
    );

    await this.repository.save(categoryAggregate);
    return CategoryMapper.mapCategoryToResponse(categoryAggregate);
  }
}