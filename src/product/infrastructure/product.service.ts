import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../application/dto/create-product.dto';
import { UpdateProductDto } from '../application/dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { ClientProxy } from '@nestjs/microservices';
import { Product } from './typeorm/product-entity'; 
import { Image } from './typeorm/image-entity';

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
  ) {}

  async create(createProductDto: CreateProductDto, imageUrls: string[]) {
    try {
      const { images, ...productDetails } = createProductDto;
  
      const imageEntities = await Promise.all(
        images.map(async (imagePath) => {
          const imageUrl = await this.cloudinaryService.uploadImage(imagePath,'products');
          const image = new Image();
          image.image_url = imageUrl;
          return image;
        }),
      );
  
      const product = new Product();
      product.product_name = productDetails.product_name;
      product.product_description = productDetails.product_description;
      product.product_price = productDetails.product_price;
      product.product_currency = productDetails.product_currency;
      product.product_weight = productDetails.product_weight;
      product.product_stock = productDetails.product_stock;
      product.product_category = productDetails.product_category;
      product.images = imageEntities;

      const productEntity = this.productRepository.create(product);
      await this.productRepository.save(productEntity);

      // Emitir el evento a RabbitMQ
      await this.client.send('product_notification', {
        productImages: createProductDto.images,
        productName: createProductDto.product_name,
        productCategory: createProductDto.product_category,
        productWeight: createProductDto.product_weight,
        productDescription: createProductDto.product_description,
        message: 'Check out our new products and their offers!',
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

    const productEntities = await this.productRepository.find({

      take: limit,
      skip: offset,
      relations: ['images', 'discount'],
      
    });

    return productEntities.map(product => ({
      ...product,
      images: product.images.map(img => img.image_url),
      discount: product.discount ? product.discount.discount_percentage: null,
    }));
  }

  async findOne(term: string) {
    let product: Product;
  
    if (isUUID(term)) {
      product = await this.productRepository.findOne({
        where: { product_id: term },
        relations: ['images', 'discount'],
      });
    } else {
      product = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.images', 'image')
        .leftJoinAndSelect('product.discount', 'discount')
        .where('product.product_name = :product_name', { product_name: term })
        .getOne();
    }
  
    if (!product) {
      throw new NotFoundException(`Product with ${term} not found`);
    }
  
    return {
      ...product,
      images: product.images.map(img => img.image_url),
      discount: product.discount ? product.discount.discount_percentage : null,
    };
  }

  async update(product_id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;

    const productEntity = await this.productRepository.findOne({
      where: { product_id },
      relations: ['images'],
    });
    if (!productEntity) throw new NotFoundException(`Product with id: ${product_id} not found`);

    Object.assign(productEntity, toUpdate);

    if (images) {
      await this.imageRepository.delete({ product: { product_id } });
      // Subir las nuevas imágenes a Cloudinary y guardarlas en la base de datos
      productEntity.images = await Promise.all(
        images.map(async (imagePath) => {
          const imageUrl = await this.cloudinaryService.uploadImage(imagePath,'products');
          const imageEntity = new Image();
          imageEntity.image_url = imageUrl;
          return imageEntity;
        }),
      );
    }

    return this.productRepository.save(productEntity);
  }

  async remove(product_id: string) {
    const product = await this.findOne(product_id);

    // Eliminar las imágenes de Cloudinary antes de borrar los registros
    for (const image of product.images) {
      const publicId = image.split('/').slice(-2).join('/').split('.')[0];
      if (publicId) {
        try {
          await this.cloudinaryService.deleteImage(publicId);
        } catch (error) {
          this.logger.error(`Failed to delete image from Cloudinary: ${error.message}`);
        }
      }
    }

    await this.imageRepository.delete({ product: { product_id } });
    const productEntity = await this.productRepository.findOne({ where: { product_id: product.product_id } });
    if (!productEntity) throw new NotFoundException(`Product with id: ${product.product_id} not found`);
    await this.productRepository.remove(productEntity);
  }

  private handleDBExceptions (error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
