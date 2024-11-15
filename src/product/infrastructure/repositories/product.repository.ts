// src/infrastructure/repositories/product.repository.ts
import { IProductRepository } from '../../domain/repositories/product-repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { Repository } from 'typeorm';
import { ProductEntity } from '../database/typeorm/product.entity';
import { Injectable } from '@nestjs/common';
import { ProductName } from 'src/product/domain/value-objects/product-name.vo';
import { ProductCategory } from 'src/product/domain/value-objects/product-category.vo';
import { ProductCurrency } from 'src/product/domain/value-objects/product-currency.vo';
import { ProductDescription } from 'src/product/domain/value-objects/product-description.vo';
import { ProductPrice } from 'src/product/domain/value-objects/product-price.vo';
import { ProductStock } from 'src/product/domain/value-objects/product-stock.vo';
import { ProductWeight } from 'src/product/domain/value-objects/product-weight.vo';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    private readonly productRepository: Repository<ProductEntity>,
  ) {}
  find(arg0: { skip: number; take: number; relations: string[]; }): unknown {
    throw new Error('Method not implemented.');
  }
    findAll(): Promise<Product[]> {
        throw new Error('Method not implemented.');
    }

  async create(product: Product): Promise<Product> {
    const productEntity = new ProductEntity();
    productEntity.product_id = product.id;
    productEntity.product_name = product.product_name.value;
    productEntity.product_description = product.product_description.value;
    productEntity.product_price = product.product_price.value;
    productEntity.product_currency = product.product_currency.value;
    productEntity.product_weight = product.product_weight.value;
    productEntity.product_stock = product.product_stock.value;
    productEntity.product_category = product.product_category.value;

    await this.productRepository.save(productEntity);

    return product;
  }

  async findById(productId: string): Promise<Product | null> {
    const productEntity = await this.productRepository.findOne({
      where: { product_id: productId },
    });

    if (!productEntity) return null;

    return new Product(
      productEntity.product_id,
      new ProductName(productEntity.product_name),
      new ProductDescription(productEntity.product_description),
      new ProductPrice(productEntity.product_price),
      new ProductCurrency(productEntity.product_currency),
      new ProductWeight(productEntity.product_weight),
      new ProductStock(productEntity.product_stock),
      [], // Para simplificar, no estamos incluyendo las imágenes aquí
      new ProductCategory(productEntity.product_category),
    );
  }

  async update(productId: string, product: Product): Promise<Product> {
    const productEntity = await this.productRepository.findOne({
      where: { product_id: productId },
    });

    if (!productEntity) throw new Error('Producto no encontrado');

    productEntity.product_name = product.name.value;
    productEntity.product_description = product.description.value;
    productEntity.product_price = product.price.value;
    productEntity.product_currency = product.currency.value;
    productEntity.product_weight = product.weight.value;
    productEntity.product_stock = product.stock.value;
    productEntity.product_category = product.category.value;

    await this.productRepository.save(productEntity);

    return product;
  }

  async remove(productId: string): Promise<void> {
    await this.productRepository.delete({ product_id: productId });
  }
}
