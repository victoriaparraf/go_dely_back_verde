import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDiscountDto } from '../application/dto/create-discount.dto';
import { UpdateDiscountDto } from '../application/dto/update-discount.dto';
import { Repository } from 'typeorm';
import { Discount } from './typeorm/discount.entity';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { DiscountPercentage } from '../domain/value-objects/discount-percentage.vo';
import { DiscountStartDate } from '../domain/value-objects/discount-start-date.vo';
import { DiscountEndDate } from '../domain/value-objects/discount-end-date.vo';


@Injectable()
export class DiscountService {
  private readonly logger = new Logger('DiscountService');

  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

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
      images: product.images.map(img => img.image_url),
    };
  }

  private mapDiscountToResponse(discount: Discount) {
    return {
      discount_id: discount.discount_id,
      discount_percentage: discount.discount_percentage,
      discount_start_date: discount.discount_start_date,
      discount_end_date: discount.discount_end_date,
      products: discount.products ? discount.products.map(product => this.mapProductToResponse( product )) : [],
    };
  }

  async create(createDiscountDto: CreateDiscountDto) {
    try {
      const { products, ...discountDetails } = createDiscountDto;

      const discountPercetage = new DiscountPercentage(discountDetails.discount_percentage);
      const discountStartDate = new DiscountStartDate(discountDetails.discount_start_date);
      const discountEndtDate = new DiscountEndDate(discountDetails.discount_end_date);


      const productEntities = await this.productRepository.findByIds(products);
      if (productEntities.length !== products.length) {
        throw new BadRequestException('Some products not found');
      }

      const discount = this.discountRepository.create({
        discount_percentage: discountPercetage,
        discount_start_date: discountStartDate,
        discount_end_date: discountEndtDate
      });

      discount.products = productEntities;

      await this.discountRepository.save( discount );
      return this.mapDiscountToResponse( discount );

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 10, perpage = 0 } = paginationDto;

    const discounts = await this.discountRepository.find({
      take: page,
      skip: perpage,
      relations: ['products'],
    });

    return discounts.map(discount => this.mapDiscountToResponse(discount));
  }

  async findOne(term: string) {
    let discount: Discount;

    if (isUUID(term)) {
      discount = await this.discountRepository.findOne({
        where: { discount_id: term },
        relations: ['products'],
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
    const { products, ...toUpdate } = updateDiscountDto;

    const discount = await this.discountRepository.findOne({
      where: { discount_id },
      relations: ['products'],
    });

    if (!discount) throw new NotFoundException(`Discount with id ${discount_id} not found`);

    Object.assign(discount, toUpdate);

    if (products) {
      const productEntities = await this.productRepository.findByIds(products);
      if (productEntities.length !== products.length) {
        throw new BadRequestException('Some products not found');
      }
      discount.products = productEntities;
    }

    await this.discountRepository.save(discount);
    return this.mapDiscountToResponse(discount);
  }

  async remove(discount_id: string) {
    const discount = await this.discountRepository.findOne({ where: { discount_id } });

    if (!discount) throw new NotFoundException(`Discount with id ${discount_id} not found`);

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