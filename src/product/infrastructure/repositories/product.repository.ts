import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IProductRepository } from '../../domain/repositories/product-repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { ProductEntity } from '../database/typeorm/product.entity';
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
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}
  save(productEntity: ProductEntity): unknown {
    throw new Error('Method not implemented.');
  }
  findOne(arg0: { where: { product_id: string; }; }): unknown {
    throw new Error('Method not implemented.');
  }
  delete(productId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async find(params: { skip: number; take: number; relations: string[] }): Promise<Product[]> {
    const productEntities = await this.productRepository.find({
      skip: params.skip,
      take: params.take,
      relations: params.relations,
    });

    return productEntities.map(
      (productEntity) =>
        new Product(
          productEntity.product_id,
          new ProductName(productEntity.product_name),
          new ProductDescription(productEntity.product_description),
          new ProductPrice(productEntity.product_price),
          new ProductCurrency(productEntity.product_currency),
          new ProductWeight(productEntity.product_weight),
          new ProductStock(productEntity.product_stock),
          [],
          new ProductCategory(productEntity.product_category),
        ),
    );
  }

  async findAll(): Promise<Product[]> {
    const productEntities = await this.productRepository.find();
    return productEntities.map(
      (productEntity) =>
        new Product(
          productEntity.product_id,
          new ProductName(productEntity.product_name),
          new ProductDescription(productEntity.product_description),
          new ProductPrice(productEntity.product_price),
          new ProductCurrency(productEntity.product_currency),
          new ProductWeight(productEntity.product_weight),
          new ProductStock(productEntity.product_stock),
          [],
          new ProductCategory(productEntity.product_category),
        ),
    );
  }

  async create(product: Product): Promise<Product> {
    const productEntity = this.productRepository.create({
      product_id: product.product_id,
      product_name: product.product_name.value,
      product_description: product.product_description.value,
      product_price: product.product_price.value,
      product_currency: product.product_currency.value,
      product_weight: product.product_weight.value,
      product_stock: product.product_stock.value,
      product_category: product.product_category.value,
    });

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
      [],
      new ProductCategory(productEntity.product_category),
    );
  }

  async update(productId: string, product: Product): Promise<Product> {
    const productEntity = await this.productRepository.findOne({
      where: { product_id: productId },
    });

    if (!productEntity) throw new Error('Producto no encontrado');

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

  async remove(productId: string): Promise<void> {
    await this.productRepository.delete({ product_id: productId });
  }
}
