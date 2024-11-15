import { ImageDTO } from '../dtos/image.dto';
import { Image } from '../../domain/entities/image.entity';
import { Product } from '../../domain/entities/product.entity';

export interface IImageService {
  createImage(imageDTO: ImageDTO, product: Product): Promise<Image>;
  deleteImage(imageId: number): Promise<void>;
}
