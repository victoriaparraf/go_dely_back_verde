import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryID } from 'src/category/domain/value-objects/category-id.vo';
import { TypeORMCategoryRepository } from 'src/category/infrastructure/typeorm/category-repository';
import { IApplicationService } from 'src/common/application/application-service.interface';

@Injectable()
export class DeleteCategoryService implements IApplicationService<string, void> {

  constructor(private readonly repository: TypeORMCategoryRepository) {}

  async execute(id: string): Promise<void> {
    const categoryId = new CategoryID(id);
    const category = await this.repository.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }
    await this.repository.delete(categoryId);
  }
}