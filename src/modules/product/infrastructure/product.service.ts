import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../application/dto/create-product.dto';
import { UpdateProductDto } from '../application/dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../domain/entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Image } from '../domain/entities/image.entity';
import { validate as isUUID } from 'uuid';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Injectable()
export class ProductService {

  private readonly logger = new Logger('ProductService');

  constructor (

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly cloudinaryService: CloudinaryService

  ){}

  async create(createProductDto: CreateProductDto, imageUrls: string[]) {
    try {
      const { images, ...productDetails } = createProductDto
      
      const imageUrls = await Promise.all(
        images.map(async (imagePath) => {
          const imageUrl = await this.cloudinaryService.uploadImage(imagePath);
          return this.imageRepository.create({ image_url: imageUrl });
        }),
      );
  
      const product = this.productRepository.create({
        ...productDetails,
        images: imageUrls,
      });
  
      await this.productRepository.save(product);
  
      return {
        ...product,
        images: product.images.map((img) => img.image_url),
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
