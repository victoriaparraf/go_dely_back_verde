import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateComboDto } from '../application/dto/create-combo.dto';
import { UpdateComboDto } from '../application/dto/update-combo.dto';
import { Combo } from './typeorm/combo-entity';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

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


  async findAll(paginationDto: PaginationDto) {
    const { page = 10, perpage = 0 } = paginationDto;
    
    const combos = await this.comboRepository.find({
      take: page,
      skip: perpage,
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

  async findOne(term: string) {
    let combo;
  
    if (isUUID(term)) {
      combo = await this.comboRepository.findOne({
        where: { combo_id: term },
        relations: ['products', 'products.images'],
      });
    } else {
      combo = await this.comboRepository
        .createQueryBuilder('combo')
        .leftJoinAndSelect('combo.products', 'product')
        .leftJoinAndSelect('product.images', 'image')
        .where('combo.combo_name = :combo_name', { combo_name: term })
        .getOne();
    }
  
    if (!combo) {
      throw new NotFoundException(`Combo with term ${term} not found`);
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