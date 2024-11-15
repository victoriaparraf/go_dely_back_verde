// src/application/services/product.service.ts
import { IProductRepository } from '../../domain/repositories/product-repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { ProductName } from '../../domain/value-objects/product-name.vo';
import { ProductDescription } from '../../domain/value-objects/product-description.vo';
import { ProductPrice } from '../../domain/value-objects/product-price.vo';
import { ProductCurrency } from '../../domain/value-objects/product-currency.vo';
import { ProductWeight } from '../../domain/value-objects/product-weight.vo';
import { ProductStock } from '../../domain/value-objects/product-stock.vo';
import { ProductCategory } from '../../domain/value-objects/product-category.vo';
import { ProductDTO } from '../dtos/product.dto';
import { PaginationDto } from 'src/common/infrastructure/dtos/pagination.dto';

export class ProductService {
  constructor(private readonly productRepository: IProductRepository) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;  // Supongo que la paginación lleva limit y page
    const skip = (offset - 1) * limit;  // Desplazamiento para la paginación

    const products = await this.productRepository.find({
      skip, 
      take: limit,  // Paginación
      relations: ['images'],  // Esto carga las imágenes asociadas al producto, si estás utilizando relaciones en TypeORM
    });

    return products;  // Devuelve los productos con imágenes asociadas
  }

  async createProduct(productDTO: ProductDTO, imageUrls: any[]): Promise<Product> {
    const productName = new ProductName(productDTO.product_name);
    const productDescription = new ProductDescription(productDTO.product_description);
    const productPrice = new ProductPrice(productDTO.product_price);
    const productCurrency = new ProductCurrency(productDTO.product_currency);
    const productWeight = new ProductWeight(productDTO.product_weight);
    const productStock = new ProductStock(productDTO.product_stock);
    const productCategory = new ProductCategory(productDTO.product_category);

    const product = new Product(
      productDTO.product_id,
      productName,
      productDescription,
      productPrice,
      productCurrency,
      productWeight,
      productStock,
      [],
      productCategory,
    );

    return this.productRepository.create(product);
  }

  async getProductById(productId: string): Promise<Product | null> {
    return this.productRepository.findById(productId);
  }

  async updateProduct(productId: string, productDTO: ProductDTO, imageUrls: string[]): Promise<Product> {
    const productName = new ProductName(productDTO.product_name);
    const productDescription = new ProductDescription(productDTO.product_description);
    const productPrice = new ProductPrice(productDTO.product_price);
    const productCurrency = new ProductCurrency(productDTO.product_currency);
    const productWeight = new ProductWeight(productDTO.product_weight);
    const productStock = new ProductStock(productDTO.product_stock);
    const productCategory = new ProductCategory(productDTO.product_category);

    const product = new Product(
      productId,
      productName,
      productDescription,
      productPrice,
      productCurrency,
      productWeight,
      productStock,
      [],
      productCategory,
    );

    return this.productRepository.update(productId, product);
  }

  async removeProduct(productId: string): Promise<void> {
    return this.productRepository.remove(productId);
  }
}
