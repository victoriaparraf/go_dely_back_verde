import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './infrastructure/typeorm/category-entity';
import { CategoryService } from './infrastructure/category.service';
import { TypeORMCategoryRepository } from './infrastructure/typeorm/category-repository';
import { CategoryController } from './infrastructure/category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [CategoryService, TypeORMCategoryRepository],
  exports: [CategoryService, TypeORMCategoryRepository],
  controllers: [CategoryController]
})
export class CategoryModule {}
