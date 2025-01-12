import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './infrastructure/controllers/category.controller';
import { CreateCategoryService } from './application/command/create-category-service';
import { DeleteCategoryService } from './application/command/delete-category-service';
import { UpdateCategoryService } from './application/command/update-category-service';
import { GetAllCategoriesService } from './application/query/get-all-categories-service';
import { GetCategoryByIdService } from './application/query/get-category-by-id-service';
import { TypeORMCategoryRepository } from './infrastructure/typeorm/category-repository';
import { CategoryEntity } from './infrastructure/typeorm/category-entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [
    CreateCategoryService,
    UpdateCategoryService,
    DeleteCategoryService,
    GetCategoryByIdService,
    GetAllCategoriesService,
    TypeORMCategoryRepository,
  ],
  exports: [
    CreateCategoryService,
    UpdateCategoryService,
    DeleteCategoryService,
    GetCategoryByIdService,
    GetAllCategoriesService,
    TypeORMCategoryRepository,
  ],
  controllers: [CategoryController],
})
export class CategoryModule {}