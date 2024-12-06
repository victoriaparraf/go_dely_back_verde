import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CategoryEntity } from 'src/category/infrastructure/typeorm/category-entity';
import { isUUID } from 'class-validator';
import { Image } from './image-entity';
import { Product } from './product-entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async createProduct(product: Product) {
    return this.productRepository.create(product);
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
        where: { product_id: term },
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

  async updateProduct(product: Product) {
    return this.productRepository.save(product);
  }

  async removeProduct(product: Product) {
    return this.productRepository.remove(product);
  }

  async deleteImagesByProduct(productId: string) {
    return this.imageRepository.delete({ product: { product_id: productId } });
  }
}
