import { IImageRepository } from '../../domain/repositories/image-repository.interface';
import { Image } from '../../domain/entities/image.entity';
import { Product } from '../../domain/entities/product.entity';
import { ImageDTO } from '../dtos/image.dto';

export class ImageService {
  constructor(private readonly imageRepository: IImageRepository) {}

  // Crear imagen para un producto
  async createImage(imageDTO: ImageDTO, product: Product): Promise<Image> {
    const image = new Image(Number(imageDTO.image_id), imageDTO.image_url, product);
    return this.imageRepository.create(image);
  }

  // Eliminar imagen por ID
  async deleteImage(imageId: number): Promise<void> {
    return this.imageRepository.delete(imageId);
  }
}
