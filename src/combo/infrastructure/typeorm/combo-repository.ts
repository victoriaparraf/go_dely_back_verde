import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Combo } from './combo-entity';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { CategoryEntity } from 'src/category/infrastructure/typeorm/category-entity';

@Injectable()
export class ComboRepository {
  constructor(
    @InjectRepository(Combo)
    private readonly comboRepository: Repository<Combo>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findComboById(id: string) {
    return this.comboRepository.findOne({
      where: { combo_id: id },
      relations: ['products', 'products.images', 'discount', 'combo_category'],
    });
  }

  async findAllCombos(take: number, skip: number) {
    return this.comboRepository.find({
      take,
      skip,
      relations: ['products', 'products.images', 'discount', 'combo_category'],
    });
  }

  async createCombo(comboData: Partial<Combo>, productEntities: Product[], category: CategoryEntity, imageUrl: string) {
    const combo = this.comboRepository.create({
      ...comboData,
      combo_image: imageUrl,
      products: productEntities,
      combo_category: category,
    });
    return this.comboRepository.save(combo);
  }

  async updateCombo(combo: Combo) {
    return this.comboRepository.save(combo);
  }

  async removeCombo(combo: Combo) {
    return this.comboRepository.remove(combo);
  }

  async findProductsByIds(productIds: string[]) {
    return this.productRepository.find({
      where: { product_id: In(productIds) },
      relations: ['images'],
    });
  }

  async findCategoryById(categoryId: string) {
    return this.categoryRepository.findOne({
      where: { category_id: categoryId },
    });
  }
}
