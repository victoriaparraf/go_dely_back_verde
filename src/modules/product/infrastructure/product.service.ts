import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../application/dto/create-product.dto';
import { UpdateProductDto } from '../application/dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../domain/entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Image } from '../domain/entities/image.entity';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductService {

  private readonly logger = new Logger('ProductService');

  constructor (

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>

  ){}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images, ...productDetails } = createProductDto;
  
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.imageRepository.create({ image_url: image }))
    
      });
  
      await this.productRepository.save(product);
  
      return {
        ...product,
        images: images
      };
  
    } catch (error) {
      console.error('Error creating product:', error);
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({

      take: limit,
      skip: offset,
      relations: {
        images: true
      }

    })

    return products.map(products => ({
      ...products, 
      images: products.images.map( img => img.image_url)

    }))
  }

  async findOne(term: string) {

    let product: Product;

    if ( isUUID(term) ) {
      product = await this.productRepository.findOne({
        where: { product_id: term },
        relations: ['images']
      });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
        .leftJoinAndSelect('product.images', 'image')
        .where('product.product_name = :product_name', {
          product_name: term
        })
        .getOne();
    }

    if ( !product )
      throw new NotFoundException(`Product with ${term} not found`);
    
    return product;
  }

  async update(product_id: string, updateProductDto: UpdateProductDto) {
    
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.findOne({
        where: { product_id },
        relations: ['images']
    });

    if (!product) throw new NotFoundException(`Product with id: ${product_id} not found`);

    Object.assign(product, toUpdate);

    if (images) {

        await this.imageRepository.delete({ product: { product_id } });

        product.images = images.map(image => this.imageRepository.create({ image_url: image, product }));
    }

    return this.productRepository.save(product);
  }

  async remove(product_id: string) {
    const product = await this.findOne( product_id );
    await this.imageRepository.delete({ product: { product_id } });
    await this.productRepository.remove( product );
  }

  private handleDBExceptions (error:any){

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this. logger.error (error)
    throw new InternalServerErrorException ( 'Unexpected error, check server logs');

  }

}
