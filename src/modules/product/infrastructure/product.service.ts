import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../application/dto/create-product.dto';
import { UpdateProductDto } from '../application/dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../domain/entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Image } from '../domain/entities/image.entity';
import { validate as isUUID } from 'uuid';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductService {

  private readonly logger = new Logger('ProductService');

  constructor (
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly cloudinaryService: CloudinaryService,

    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
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

      // Emite el evento a RabbitMQ
      await this.client.send('product_notification', {
        productImages: createProductDto.images,
        productName: createProductDto.product_name,
        productCategory: createProductDto.product_category,
        message: '¡Revisa nuestros nuevos productos y sus ofertas!',
    }).toPromise();
  
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
      // Subimos las nuevas imágenes a Cloudinary y las guardamos en la base de datos
      product.images = await Promise.all(
        images.map(async (imagePath) => {
          const imageUrl = await this.cloudinaryService.uploadImage(imagePath);
          return this.imageRepository.create({ image_url: imageUrl, product });
        })
      );
    }

    return this.productRepository.save(product);
  }

  async remove(product_id: string) {
    const product = await this.findOne( product_id );

    // Eliminar las imágenes de Cloudinary antes de borrar los registros
    for (const image of product.images) {
      // Extraer el public_id
      const publicId = image.image_url.split('/').slice(-2).join('/').split('.')[0];
      console.log('Public ID:', publicId);


      if (publicId) {
        try {
          await this.cloudinaryService.deleteImage(publicId);

        } catch (error) {
          this.logger.error(`Failed to delete image from Cloudinary: ${error.message}`);

        }
      }
    }

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
