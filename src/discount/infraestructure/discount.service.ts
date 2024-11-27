import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateDiscountDto } from '../application/dto/create-discount.dto';
import { UpdateDiscountDto } from '../application/dto/update-discount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discount } from './typeorm/discount.entity';
import { Product } from '../../product/domain/entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';



@Injectable()
export class DiscountService {

  private readonly logger = new Logger('DiscountService');

  constructor(

    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>

  ){}

  async create(createDiscountDto: CreateDiscountDto) {
    try {
      const { ...discountDetails } = createDiscountDto;

      const discount = new Discount();
      discount.discount_percentage = discountDetails.discount_percentage;
      discount.discount_start_date = discountDetails.discount_start_date;
      discount.discount_end_date = discountDetails.discount_end_date;

      const discountEntity = this.discountRepository.create(discount);
      await this.discountRepository.save(discountEntity);

      return {...discount};

    } catch (error) {
      console.error('Error creating discount:', error);
      this.handleDBExceptions(error);
    }


  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const discountEntities = await this.discountRepository.find({
      take: limit,
      skip: offset
    });

    return discountEntities.map(discount => ({
      ...discount
    }));
  }

  async findOne(term: string) {
    let discount : Discount;

    if (isUUID(term)) {
      discount = await this.discountRepository.findOne({
        where: { discount_id: term }
      });
    }

    return{...discount}
  }

  async update(discount_id: string, updateDiscountDto: UpdateDiscountDto) {
    const { ...toUpdate } = updateDiscountDto;

    const discountEntity = await this.discountRepository.findOne({
      where: { discount_id }
    });
    if ( !discountEntity ) throw new NotFoundException(`Product with id: ${discount_id} not found`);

    Object.assign(discountEntity, toUpdate);

    return this.discountRepository.save( discountEntity );
  }

  async remove(discount_id: string) {

    const discount = await this.findOne( discount_id );

    const discountEntity = await this.discountRepository.findOne({ where: { discount_id: discount.discount_id } });

    if ( !discountEntity ) throw new NotFoundException(`Discount with id: ${discount.discount_id} not found`);

    await this.discountRepository.remove( discountEntity );
  }

  private handleDBExceptions (error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
