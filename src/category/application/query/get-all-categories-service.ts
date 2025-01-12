import { CategoryMapper } from 'src/category/infrastructure/mappers/category.mapper';
import { TypeORMCategoryRepository } from 'src/category/infrastructure/typeorm/category-repository';
import { IApplicationService } from 'src/common/application/application-service.interface';
import { CreateCategoryResponseDto } from '../dto/response/create-category-response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetAllCategoriesService implements IApplicationService<void, CreateCategoryResponseDto[]> {
  
  constructor(private readonly categoryRepository: TypeORMCategoryRepository) {}

  async execute(): Promise<CreateCategoryResponseDto[]> {
    const categories = await this.categoryRepository.findAll();
    return categories.map(category => CategoryMapper.mapCategoryToResponse(category));
  }
  
}
