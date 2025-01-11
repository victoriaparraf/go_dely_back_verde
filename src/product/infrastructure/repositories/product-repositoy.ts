import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CategoryEntity } from 'src/category/infrastructure/typeorm/category-entity';
import { Image } from '../typeorm/image-entity';
import { isUUID } from 'class-validator';
import { IProductRepository } from 'src/product/domain/repositories/product-repository-interface';
import { Product } from '../typeorm/product-entity';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async createProduct(product: Product) {
    const productEntity = this.productRepository.create(product);
    productEntity.images = product.images;
    return productEntity;
  }

  async saveProduct(product: Product) {
    return this.productRepository.save(product);
  }

  async findAll(paginationDto: { page: number; perpage: number }) {
    const { page, perpage } = paginationDto;
    return this.productRepository.find({
      take: perpage,
      skip: (page - 1) * perpage,
      relations: ['product_category', 'images', 'discount'],
    });
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOne({
        where: { id: term },
        relations: ['product_category', 'images', 'discount'],
      });
    } else {
      product = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.images', 'image')
        .leftJoinAndSelect('product.discount', 'discount')
        .where('product.product_name = :product_name', { product_name: term })
        .getOne();
    }
    return product;
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { categories: { id: categoryId } },
      relations: ['product_category', 'images', 'discount'],
    });
  }

  async updateProduct(product: Product) {
    return this.productRepository.save(product);
  }

  async removeProduct(product: Product) {
    return this.productRepository.remove(product);
  }

  async deleteImagesByProduct(productId: string): Promise<void> {
    await this.imageRepository.delete({ product: { id: productId } });
  }
}
