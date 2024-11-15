import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateComboDto } from '../application/dto/create-combo.dto';
import { UpdateComboDto } from '../application/dto/update-combo.dto';
import { Product } from 'src/product/domain/entities/product.entity';
import { Combo } from '../domain/entities/combo.entity';

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
      products: productEntities,
    });

    await this.comboRepository.save(combo);
    return combo;
  }

  async findAll() {
    const combos = await this.comboRepository.find({
      relations: ['products', 'products.images'],
    });

    return combos.map(combo => ({
      ...combo,
      products: combo.products.map(product => ({
        ...product,
        images: product.images,
      })),
    }));
  }

  async findOne(id: number) {
    const combo = await this.comboRepository.findOne({
      where: { id: id.toString() },
      relations: ['products', 'products.images'],
    });

    if (!combo) {
      throw new NotFoundException(`Combo with id ${id} not found`);
    }

    return {
      ...combo,
      products: combo.products.map(product => ({
        ...product,
        images: product.images,
      })),
    };
  }

  async update(id: number, updateComboDto: UpdateComboDto) {
    const { products, ...comboDetails } = updateComboDto;

    const combo = await this.comboRepository.findOne({ where: { id: id.toString() } });
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
    const combo = await this.comboRepository.findOne({ where: { id: id.toString() } });
    if (!combo) {
      throw new NotFoundException(`Combo with id ${id} not found`);
    }
    await this.comboRepository.remove(combo);
  }
}