import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateDiscountDto } from '../application/dto/create-discount.dto';
import { UpdateDiscountDto } from '../application/dto/update-discount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discount } from './typeorm/discount.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';



@Injectable()
export class DiscountService {

  private readonly logger = new Logger('DiscountService');

  constructor(

    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>

  ){}

  async create(createDiscountDto: CreateDiscountDto) {
    try {
      const { products, ...discountDetails } = createDiscountDto;

      const discount = this.discountRepository.create({
        discount_percentage: discountDetails.discount_percentage,
        discount_start_date: discountDetails.discount_start_date,
        discount_end_date: discountDetails.discount_end_date
      });

      const productEntities = await this.productRepository.findByIds( products );
      if (productEntities.length !== products.length) {
        throw new NotFoundException('One or more products not found');
      }
      discount.products = productEntities;

      return await this.discountRepository.save( discount );

    } catch (error) {
      console.error('Error creating discount:', error);
      this.handleDBExceptions(error);
    }


  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const discountEntities = await this.discountRepository.find({
      take: limit,
      skip: offset,
      relations: ['products'],
    });

    return discountEntities.map(discount => ({
      ...discount
    }));
  }

  async findOne(term: string) {
    let discount : Discount;

    if (isUUID(term)) {
      discount = await this.discountRepository.findOne({
        where: { discount_id: term },
        relations: ['products'],
      });
    }

    return{...discount}
  }

  async update(discount_id: string, updateDiscountDto: UpdateDiscountDto) {
    const { products, ...toUpdate } = updateDiscountDto;

    const discountEntity = await this.discountRepository.findOne({
      where: { discount_id },
      relations: ['products']
    });

    if ( !discountEntity ) throw new NotFoundException(`Product with id: ${discount_id} not found`);

    Object.assign(discountEntity, toUpdate);

    if (products) {
      const productEntities = await this.productRepository.findByIds(products);
      if (productEntities.length !== products.length) {
        throw new NotFoundException('One or more products not found');
      }
      discountEntity.products = productEntities;
    }

    await this.discountRepository.save(discountEntity);
    return discountEntity;
  }

  async remove(discount_id: string) {

    const discount = await this.discountRepository.findOne({
      where: { discount_id },
      relations: ['products'],
    });

    if (!discount) throw new NotFoundException(`Discount with id: ${discount_id} not found`);

    discount.products = [];
    await this.discountRepository.save(discount);

    await this.discountRepository.remove(discount);
  }

  private handleDBExceptions (error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
