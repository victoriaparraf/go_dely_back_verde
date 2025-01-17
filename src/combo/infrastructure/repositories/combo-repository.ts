import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Combo } from '../typeorm/combo-entity';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { CategoryEntity } from 'src/category/infrastructure/typeorm/category-entity';
import { IComboRepository } from 'src/combo/domain/repositories/combo-repository-interface';
import { isUUID } from 'class-validator';
import { Discount } from 'src/discount/infraestructure/typeorm/discount.entity';

@Injectable()
export class ComboRepository implements IComboRepository {
  constructor(
    @InjectRepository(Combo)
    private readonly comboRepository: Repository<Combo>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>
  ) {}

  async createCombo(comboData: Combo) {
    const comboEntity = this.comboRepository.create(comboData);
    return comboEntity;
  }

  async saveCombo(combo: Combo) {
    return this.comboRepository.save(combo);
  }

  async findCombosByIds(comboIds: string[]): Promise<Combo[]> {
    return this.comboRepository.find({
      where: { combo_id: In(comboIds) },
      relations: ['combo_categories', 'products', 'discount'],
    });
  }

  async countCombosByIds(comboIds: string[]): Promise<number> {
    return this.comboRepository.count({ where: { combo_id: In(comboIds) } });
  }

  async findOne(term: string) {

    let combo: Combo;
    if (isUUID(term)) {
        combo = await this.comboRepository.findOne({
            where: { combo_id: term },
            relations: ['products', 'products.images', 'combo_categories', 'discount'],
        });
    } else {
        combo = await this.comboRepository
            .createQueryBuilder('combo')
            .leftJoinAndSelect('combo.products', 'product')
            .leftJoinAndSelect('product.images', 'image')
            .leftJoinAndSelect('combo.discount', 'discount')
            .leftJoinAndSelect('combo.combo_categories', 'categories')
            .where('combo.combo_name = :combo_name', { combo_name: term })
            .getOne();
    }
    return combo;

}

  async findAll(paginationDto: { page: number; perpage: number }) {

    const { page, perpage } = paginationDto;
    return this.comboRepository.find({
      take: perpage,
      skip: (page - 1) * perpage,
      relations: ['products', 'products.images', 'combo_categories', 'discount'],
    });

  }

  async updateCombo(combo: Combo) {
    return this.comboRepository.save(combo);
  }

  async removeCombo(combo: Combo) {
    return this.comboRepository.remove(combo);
  }
  
}
