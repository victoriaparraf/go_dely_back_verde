import { CategoryID } from 'src/category/domain/value-objects/category-id.vo';
import { CategoryImage } from 'src/category/domain/value-objects/category-image.vo';
import { CategoryName } from 'src/category/domain/value-objects/category-name.vo';
import { UpdateCategoryDto } from 'src/category/infrastructure/dto/update-category.dto';
import { CategoryMapper } from 'src/category/infrastructure/mappers/category.mapper';
import { IApplicationService } from 'src/common/application/application-service.interface';
import { CreateCategoryResponseDto } from '../dto/response/create-category-response.dto';
import { CategoryRepository } from 'src/category/domain/repositories/category.repository.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeORMCategoryRepository } from 'src/category/infrastructure/typeorm/category-repository';

@Injectable()
export class UpdateCategoryService implements IApplicationService<{ id: string, updateCategoryDto: UpdateCategoryDto }, CreateCategoryResponseDto> {
  
  constructor(private readonly categoryRepository: TypeORMCategoryRepository) {}

  async execute({ id, updateCategoryDto }: { id: string, updateCategoryDto: UpdateCategoryDto }): Promise<CreateCategoryResponseDto> {
    const categoryId = new CategoryID(id); 
    const existingCategory = await this.categoryRepository.findById(categoryId);
  
    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  
    existingCategory.updateName(new CategoryName(updateCategoryDto.name));
    existingCategory.updateImage(new CategoryImage(updateCategoryDto.image)); 
  
    await this.categoryRepository.save(existingCategory);
  
    return CategoryMapper.mapCategoryToResponse(existingCategory);
  }
}