import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../application/dto/create-product.dto';
import { UpdateProductDto } from '../application/dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../domain/entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductService {

  private readonly logger = new Logger('ProductService');

  constructor (

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

  ){}

  async create(createProductDto: CreateProductDto) {

    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;

    } catch (error) {

      this.handleDBExceptions(error);
      
    }
    
  }

  findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    return this.productRepository.find({

      take: limit,
      skip: offset,
      //todo:

    });
  }

  async findOne(term: string) {

    let product: Product;

    if ( isUUID(term) ) {
      product = await this.productRepository.findOneBy({ product_id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where('product_name =:product_name', {
          product_name: term
        })
        .getOne();
    }

    if ( !product )
      throw new NotFoundException(`Product with ${term} not found`)
    return product;
  }

  update(product_id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${product_id} product`;
  }

  async remove(product_id: string) {
    const product = await this.findOne( product_id );
    await this.productRepository.remove( product );
  }

  private handleDBExceptions (error:any){

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this. logger.error (error)
    throw new InternalServerErrorException ( 'Unexpected error, check server logs');

  }

}
