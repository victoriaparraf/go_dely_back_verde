import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../application/dto/create-product.dto';
import { UpdateProductDto } from '../application/dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { ClientProxy } from '@nestjs/microservices';
import { Product } from './typeorm/product-entity';
import { Image } from './typeorm/image-entity';
import { ProductDescription } from '../domain/value-objects/product-description.vo';
import { ProductMeasurement } from '../domain/value-objects/product-measurement.vo';
import { ProductName } from '../domain/value-objects/product-name.vo';
import { ProductPrice } from '../domain/value-objects/product-price.vo';
import { ProductWeight } from '../domain/value-objects/product-weight.vo';
import { ProductStock } from '../domain/value-objects/product-stock.vo';
import { ProductRepository } from './typeorm/product-repositoy';
import { ProductCurrency } from '../domain/value-objects/poduct-currency.vo';
import { CategoryEntity } from 'src/category/infrastructure/typeorm/category-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  private readonly logger = new Logger('ProductService');

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cloudinaryService: CloudinaryService,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) {}

  async create(createProductDto: CreateProductDto, imageUrls: string[]) {
    try {
      const { product_category, images, ...productDetails } = createProductDto;

      const category = await this.categoryRepository.findOne({ where: { category_id: product_category as any } });
      if (!category) {
        throw new NotFoundException(`Category with ID ${product_category} not found`);
      }

      const productName = new ProductName(productDetails.product_name);
      const productDescription = new ProductDescription(productDetails.product_description);
      const productPrice = new ProductPrice(productDetails.product_price);
      const productCurrency = new ProductCurrency(productDetails.product_currency);
      const productWeight = new ProductWeight(productDetails.product_weight);
      const productMeasurement = new ProductMeasurement(productDetails.product_measurement);
      const productStock = new ProductStock(productDetails.product_stock);

      const imageEntities = await Promise.all(
        images.map(async (imagePath) => {
          const imageUrl = await this.cloudinaryService.uploadImage(imagePath, 'products');
          const image = new Image();
          image.image_url = imageUrl;
          return image;
        }),
      );

      const product = new Product();
      product.product_name = productName;
      product.product_description = productDescription;
      product.product_price = productPrice;
      product.product_currency = productCurrency;
      product.product_weight = productWeight;
      product.product_measurement = productMeasurement;
      product.product_stock = productStock;
      product.product_category = category;
      product.images = imageEntities;

      const productEntity = this.productRepository.createProduct(product);
      await this.productRepository.saveProduct(await productEntity);

      this.client.send('product_notification', {
        productImages: createProductDto.images,
        productName: createProductDto.product_name,
        productCategory: category.category_name,
        productWeight: createProductDto.product_weight,
        productMeasurement: createProductDto.product_measurement,
        productDescription: createProductDto.product_description,
        message: 'Check out our new products and their offers!',
      }).subscribe();

      return {
        ...product,
        images: product.images.map((img) => img.image_url),
      };
    } catch (error) {
      console.error('Error creating product:', error);
      this.handleDBExceptions(error);
    }
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
      product_category: product.product_category?.category_name,
      images: product.images.map((img) => img.image_url),
      discount: product.discount ? product.discount.discount_percentage : null,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, perpage = 10 } = paginationDto;
    const productEntities = await this.productRepository.findAll({
      page,
      perpage,
    });
    return productEntities.map((product) => this.mapProductToResponse(product));
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOne(term);
    } else {
      product = await this.productRepository.findOne(term);
    }

    if (!product) {
      throw new NotFoundException(`Product with ${term} not found`);
    }

    return this.mapProductToResponse(product);
  }

  async update(product_id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;

    const productEntity = await this.productRepository.findOne(product_id);
    if (!productEntity) throw new NotFoundException(`Product with id: ${product_id} not found`);

    Object.assign(productEntity, toUpdate);

    if (images) {
      await this.productRepository.deleteImagesByProduct(product_id);
      productEntity.images = await Promise.all(
        images.map(async (imagePath) => {
          const imageUrl = await this.cloudinaryService.uploadImage(imagePath, 'products');
          const imageEntity = new Image();
          imageEntity.image_url = imageUrl;
          return imageEntity;
        }),
      );
    }

    return this.productRepository.saveProduct(productEntity);
  }

  async remove(product_id: string) {
    const product = await this.findOne(product_id);

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

    await this.productRepository.deleteImagesByProduct(product_id);
    const productEntity = await this.productRepository.findOne(product_id);
    if (!productEntity) throw new NotFoundException(`Product with id: ${product.product_id} not found`);
    await this.productRepository.removeProduct(productEntity);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
