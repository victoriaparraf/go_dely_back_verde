import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Combo } from '../domain/combo.entity';
import { CreateComboDto } from '../application/dto/create-combo.dto';
import { UpdateComboDto } from '../application/dto/update-combo.dto';
import { Product } from 'src/modules/product/domain/entities/product.entity';

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
    return this.comboRepository.find({ relations: ['products'] });
  }

  async findOne(id: number) {
    const combo = await this.comboRepository.findOne({
      where: { combo_id: id },
      relations: ['products'],
    });

    if (!combo) {
      throw new NotFoundException(`Combo with id ${id} not found`);
    }

    return combo;
  }

  async update(id: number, updateComboDto: UpdateComboDto) {
    const { products, ...comboDetails } = updateComboDto;

    const combo = await this.comboRepository.findOne({ where: { combo_id: id } });
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
    const combo = await this.findOne(id);
    await this.comboRepository.remove(combo);
  }
}