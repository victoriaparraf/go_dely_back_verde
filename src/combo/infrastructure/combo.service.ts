import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateComboDto } from '../application/dto/create-combo.dto';
import { UpdateComboDto } from '../application/dto/update-combo.dto';
import { Combo } from './typeorm/combo-entity';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';

@Injectable()
export class ComboService {
  constructor(
    @InjectRepository(Combo)
    private readonly comboRepository: Repository<Combo>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createComboDto: CreateComboDto) {
    const { products, ...comboDetails } = createComboDto;

    const productEntities = await this.productRepository.findByIds(products);
    if (productEntities.length !== products.length) {
      throw new BadRequestException('Some products not found');
    }

    const combo = this.comboRepository.create({
      ...comboDetails,
    });

    combo.products = productEntities;

    return await this.comboRepository.save(combo);
  }


  async findAll() {
    const combos = await this.comboRepository.find({
      relations: ['products', 'products.images'],
    });

    return combos.map(combo => ({
      ...combo,
      products: combo.products.map(product => ({
        ...product,
        images: product.images.map(img => img.image_url),
      })),
    }));
  }

  async findOne(id: number) {
    const combo = await this.comboRepository.findOne({
      where: { combo_id: id.toString() },
      relations: ['products', 'products.images'],
    });

    if (!combo) {
      throw new NotFoundException(`Combo with id ${id} not found`);
    }

    return {
      ...combo,
      products: combo.products.map(product => ({
        ...product,
        images: product.images.map(img => img.image_url),
      })),
    };
  }

  async update(id: number, updateComboDto: UpdateComboDto) {
    const { products, ...comboDetails } = updateComboDto;

    const combo = await this.comboRepository.findOne({ where: { combo_id: id.toString() } });
    if (!combo) {
      throw new NotFoundException(`Combo with id ${id} not found`);
    }

    if (products) {
      const productEntities = await this.productRepository.findByIds(products);
      if (productEntities.length !== products.length) {
        throw new BadRequestException('Some products not found');
      }
      combo.products = productEntities;
    }

    Object.assign(combo, comboDetails);
    await this.comboRepository.save(combo);
    return combo;
  }

  async remove(id: number) {
    const combo = await this.comboRepository.findOne({ where: { combo_id: id.toString() } });
    if (!combo) {
      throw new NotFoundException(`Combo with id ${id} not found`);
    }
    await this.comboRepository.remove(combo);
  }
}