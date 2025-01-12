import { Injectable, NotFoundException } from '@nestjs/common';
import { IApplicationService } from 'src/common/application/application-service.interface';
import { CreateCategoryResponseDto } from '../dto/response/create-category-response.dto';
import { TypeORMCategoryRepository } from 'src/category/infrastructure/typeorm/category-repository';
import { CategoryID } from 'src/category/domain/value-objects/category-id.vo';
import { CategoryMapper } from 'src/category/infrastructure/mappers/category.mapper';

@Injectable()
export class GetCategoryByIdService implements IApplicationService<string, CreateCategoryResponseDto> {
  
  constructor(private readonly categoryRepository: TypeORMCategoryRepository) {}

  async execute(id: string): Promise<CreateCategoryResponseDto> {
    const categoryId = new CategoryID(id);
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }
    return CategoryMapper.mapCategoryToResponse(category);
  }
}