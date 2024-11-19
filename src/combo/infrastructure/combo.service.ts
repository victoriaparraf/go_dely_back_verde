import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateComboDto } from '../application/dto/create-combo.dto';
import { UpdateComboDto } from '../application/dto/update-combo.dto';
import { Repository } from 'typeorm';
import { Combo } from './typeorm/combo-entity';
import { isUUID } from 'class-validator';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { CloudinaryService } from 'src/product/infrastructure/cloudinary/cloudinary.service';

@Injectable()
export class ComboService {
  constructor(
    @InjectRepository(Combo)
    private readonly comboRepository: Repository<Combo>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createComboDto: CreateComboDto) {
    const { products, ...comboDetails } = createComboDto;

    const imageUrl = await this.cloudinaryService.uploadImage(comboDetails.combo_image,'combos');

    const productEntities = await this.productRepository.findByIds(products);
    if (productEntities.length !== products.length) {
      throw new BadRequestException('Some products not found');
    }

    const combo = this.comboRepository.create({
      ...comboDetails,
      combo_image: imageUrl
    });

    combo.products = productEntities;

    return await this.comboRepository.save(combo);
  }


  async findAll() {
    const combos = await this.comboRepository.find({
      relations: ['products', 'products.images'],
    });

    return combos.map(combo => ({
      ...combo,
      products: combo.products.map(product => ({
        ...product,
        images: product.images.map(img => img.image_url),
      })),
    }));
  }

  async findOne(term: string) {
    let combo;
  
    if (isUUID(term)) {
      combo = await this.comboRepository.findOne({
        where: { combo_id: term },
        relations: ['products', 'products.images'],
      });
    } else {
      combo = await this.comboRepository
        .createQueryBuilder('combo')
        .leftJoinAndSelect('combo.products', 'product')
        .leftJoinAndSelect('product.images', 'image')
        .where('combo.combo_name = :combo_name', { combo_name: term })
        .getOne();
    }
  
    if (!combo) {
      throw new NotFoundException(`Combo with term ${term} not found`);
    }
  
    return {
      ...combo,
      products: combo.products.map(product => ({
        ...product,
        images: product.images.map(img => img.image_url),
      })),
    };
  }  

  async update(id: number, updateComboDto: UpdateComboDto) {
    const { products, combo_image, ...comboDetails } = updateComboDto;

    const combo = await this.comboRepository.findOne({ where: { combo_id: id.toString() } });
    if (!combo) {
      throw new NotFoundException(`Combo with id ${id} not found`);
    }

    if (products) {
      const productEntities = await this.productRepository.findByIds(products);
      if (productEntities.length !== products.length) {
        throw new BadRequestException('Some products not found');
      }
      combo.products = productEntities;
    }

    if (combo_image && combo_image !== combo.combo_image) {
      if (combo.combo_image) {
        const publicId = combo.combo_image.split('/').slice(-2).join('/').split('.')[0];
          if (publicId) {
              await this.cloudinaryService.deleteImage(publicId);
          }
      }
      const uploadedImageUrl = await this.cloudinaryService.uploadImage(combo_image, 'combos');
      combo.combo_image = uploadedImageUrl;
  }

    Object.assign(combo, comboDetails);
    await this.comboRepository.save(combo);
    return combo;
  }

  async remove(id: number) {
    const combo = await this.comboRepository.findOne({ where: { combo_id: id.toString() } });
    if (!combo) {
      throw new NotFoundException(`Combo with id ${id} not found`);
    }
    const publicId = combo.combo_image.split('/').slice(-2).join('/').split('.')[0];
    await this.cloudinaryService.deleteImage(publicId);

    await this.comboRepository.remove(combo);
  }
}