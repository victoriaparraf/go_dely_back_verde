import { IImageRepository } from '../../domain/repositories/image-repository.interface';
import { Image } from '../../domain/entities/image.entity';
import { Repository } from 'typeorm';
import { ImageEntity } from '../database/typeorm/image.entity';
import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; 
import { ProductEntity } from '../database/typeorm/product.entity';

@Injectable()
export class ImageRepository implements IImageRepository {
    constructor(
        private readonly imageRepository: Repository<ImageEntity>,
        private readonly cloudinaryService: CloudinaryService, 
        private readonly productRepository: Repository<ProductEntity>,  
    ) {}
    findById(imageId: number): Promise<Image | null> {
        throw new Error('Method not implemented.');
    }

    async create(image: Image): Promise<Image> {
        
        const imageUrl = await this.cloudinaryService.uploadImage(image.image_url);

        const imageEntity = new ImageEntity();
        imageEntity.image_id = image.id;
        imageEntity.image_url = imageUrl;
        const productEntity = new ProductEntity();
        productEntity.product_id = image.product.id;
        productEntity.product_name = image.product.product_name.toString(); 
        imageEntity.product = productEntity;

        
        await this.imageRepository.save(imageEntity);

        return image;
    }

    async delete(imageId: number): Promise<void> {
        
        const imageEntity = await this.imageRepository.findOne({ where: { image_id: imageId.toString() }, relations: ['product'] });

        if (imageEntity) {
            await this.cloudinaryService.deleteImage(imageEntity.image_id);
            await this.imageRepository.delete({ image_id: imageId.toString() });
        } else {
            throw new Error('Imagen no encontrada en la base de datos');
        }
    }
}
