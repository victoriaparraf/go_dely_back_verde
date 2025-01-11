import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CategoryEntity } from 'src/category/infrastructure/typeorm/category-entity';
import { UpdateProductServiceEntryDto } from '../dto/entry/update-product-service-entry.dto';
import { Image } from 'src/product/infrastructure/typeorm/image-entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCurrency } from 'src/product/domain/value-objects/poduct-currency.vo';
import { ProductDescription } from 'src/product/domain/value-objects/product-description.vo';
import { ProductMeasurement } from 'src/product/domain/value-objects/product-measurement.vo';
import { ProductName } from 'src/product/domain/value-objects/product-name.vo';
import { ProductPrice } from 'src/product/domain/value-objects/product-price.vo';
import { ProductStock } from 'src/product/domain/value-objects/product-stock.vo';
import { ProductWeight } from 'src/product/domain/value-objects/product-weight.vo';
import { ProductRepository } from 'src/product/infrastructure/repositories/product-repositoy';
import { CloudinaryService } from 'src/common/infraestructure/cloudinary/cloudinary.service';

@Injectable()
export class UpdateProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(updateProductDto: UpdateProductServiceEntryDto): Promise<void> {
    const { product_id, product_category, images, ...productDetails } = updateProductDto;

    const product = await this.productRepository.findOne(product_id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${product_id} not found`);
    }

    if (product_category) {
      const category = await this.categoryRepository.findOne({ where: { id: product_category } });
      if (!category) {
        throw new NotFoundException(`Category with ID ${product_category} not found`);
      }
      product.categories = [category];
    }

    if (images && images.length) {
      const imageEntities = await Promise.all(
        images.map(async (imagePath) => {
          const imageUrl = await this.cloudinaryService.uploadImage(imagePath, 'products');
          const image = new Image();
          image.image_url = imageUrl;
          return image;
        }),
      );
      product.images = imageEntities;
    }

    if (productDetails.product_name) product.name = new ProductName(productDetails.product_name);
    if (productDetails.product_description) product.description = new ProductDescription(productDetails.product_description);
    if (productDetails.product_price) product.price = new ProductPrice(productDetails.product_price);
    if (productDetails.product_currency) product.currency = new ProductCurrency(productDetails.product_currency);
    if (productDetails.product_weight) product.weight = new ProductWeight(productDetails.product_weight.toString());
    if (productDetails.product_measurement) product.measurement = new ProductMeasurement(productDetails.product_measurement);
    if (productDetails.product_stock) product.stock = new ProductStock(productDetails.product_stock);

    try {
      await this.productRepository.saveProduct(product);
    } catch (error) {
      console.error('Error updating product:', error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }
}