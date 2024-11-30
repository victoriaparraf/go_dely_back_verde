import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDiscountDto } from '../application/dto/create-discount.dto';
import { UpdateDiscountDto } from '../application/dto/update-discount.dto';
import { In, Repository } from 'typeorm';
import { Discount } from './typeorm/discount.entity';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { DiscountPercentage } from '../domain/value-objects/discount-percentage.vo';
import { DiscountStartDate } from '../domain/value-objects/discount-start-date.vo';
import { DiscountEndDate } from '../domain/value-objects/discount-end-date.vo';
import { Combo } from 'src/combo/infrastructure/typeorm/combo-entity';


@Injectable()
export class DiscountService {
  private readonly logger = new Logger('DiscountService');

  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Combo)
    private readonly comboRepository: Repository<Combo>,
  ) {}


  private mapComboToResponse(combo: Combo) {
    console.log('Mapping Combo:', combo);
    return {
      combo_id: combo.combo_id,
      combo_name: combo.combo_name.getValue(),
      combo_price: combo.combo_price.getValue(),
      combo_description: combo.combo_description.getValue(),
      combo_currency: combo.combo_currency.getValue(),
      combo_category: combo.combo_category,
      combo_stock: combo.combo_stock.getValue(),
    };
  }

  private mapProductToResponse(product: Product) {
    return {
      product_id: product.product_id,
      product_name: product.product_name.getValue(),
      product_description: product.product_description.getValue(),
      product_price: product.product_price.getValue(),
      product_currency: product.product_currency.getValue(),
      product_weight: product.product_weight.getValue(),
      product_measurement: product.product_measurement.getValue(),
      product_stock: product.product_stock.getValue(),
      product_category: product.product_category,
      images: product.images ? product.images.map(img => img.image_url) : [],
    };
  }
  

  private mapDiscountToResponse(discount: Discount) {
    console.log('Mapping Discount to Response:', discount);
    return {
        discount_id: discount.discount_id,
        discount_percentage: discount.discount_percentage.getValue(),
        discount_start_date: discount.discount_start_date.getValue().toISOString().split('T')[0], 
        discount_end_date: discount.discount_end_date.getValue().toISOString().split('T')[0],
        products: discount.products ? discount.products.map(product => this.mapProductToResponse(product)) : [],
        combos: discount.combos ? discount.combos.map(combo => this.mapComboToResponse(combo)) : [],
    };
  }

  async create(createDiscountDto: CreateDiscountDto) {
    try {
      const { products, combos, ...discountDetails } = createDiscountDto;

      const discountPercentage = new DiscountPercentage(discountDetails.discount_percentage);
      const discountStartDate = new DiscountStartDate(discountDetails.discount_start_date);
      const discountEndDate = new DiscountEndDate(discountDetails.discount_end_date);

      const discount = this.discountRepository.create({
        discount_percentage: discountPercentage,
        discount_start_date: discountStartDate,
        discount_end_date: discountEndDate,
      });

    if (products && Array.isArray(products)) {
      const productEntities = await this.productRepository.findByIds(products);
      if (productEntities.length !== products.length) {
        throw new BadRequestException('Some products not found');
      }
      discount.products = productEntities;
    }

    if (combos && Array.isArray(combos)) {
      const comboEntities = await this.comboRepository.findByIds(combos);
      if (comboEntities.length !== combos.length) {
        throw new BadRequestException('Some combos not found');
      }
      discount.combos = comboEntities;
    }

      await this.discountRepository.save(discount);
      return this.mapDiscountToResponse(discount);

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, perpage = 10 } = paginationDto;

    const discounts = await this.discountRepository.find({
      take: perpage,
      skip: (page - 1) * perpage,
      relations: ['products', 'products.images', 'combos'],
    });

    return discounts.map(discount => this.mapDiscountToResponse(discount));
  }

  async findOne(term: string) {
    let discount: Discount;

    if (isUUID(term)) {
      discount = await this.discountRepository.findOne({
        where: { discount_id: term },
        relations: ['products','combos'],
      });
    } else {
      throw new NotFoundException(`Invalid discount identifier: ${term}`);
    }

    if (!discount) {
      throw new NotFoundException(`Discount with term ${term} not found`);
    }

    return this.mapDiscountToResponse(discount);
  }

  async update(discount_id: string, updateDiscountDto: UpdateDiscountDto) {
    try {
        const discount = await this.discountRepository.findOne({
            where: { discount_id },
            relations: ['products', 'products.images', 'combos'],
        });

        if (!discount) {
            throw new NotFoundException(`Discount with id ${discount_id} not found`);
        }

        console.log('Original Discount:', discount);

        if (updateDiscountDto.discount_percentage) {
          discount.discount_percentage = new DiscountPercentage(updateDiscountDto.discount_percentage);
        }

        if (updateDiscountDto.discount_start_date) {
            discount.discount_start_date = new DiscountStartDate(updateDiscountDto.discount_start_date);
        }

        if (updateDiscountDto.discount_end_date) {
            discount.discount_end_date = new DiscountEndDate(updateDiscountDto.discount_end_date);
        }
        console.log('Updated Discount:', discount);
        if (updateDiscountDto.products) {
            const productEntities = await this.productRepository.findByIds(updateDiscountDto.products);
            if (productEntities.length !== updateDiscountDto.products.length) {
                throw new BadRequestException('Some products not found');
            }
            discount.products = productEntities;
        }

        await this.discountRepository.save(discount);

        const response = this.mapDiscountToResponse(discount);
        console.log('Response:', response);

        return response;

    } catch (error) {
        this.handleDBExceptions(error);
    }
}


  async remove(discount_id: string) {
    const discount = await this.discountRepository.findOne({ where: { discount_id } });

    if (!discount) throw new NotFoundException(`Discount with id ${discount_id} not found`);

    if (discount.products) {
      discount.products.forEach(product => {
        product.discount = null;
      });
      await this.productRepository.save(discount.products);
    }

    await this.discountRepository.remove(discount);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}