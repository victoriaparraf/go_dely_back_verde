import { Image } from '../entities/image.entity';

export interface IImageRepository {
  create(image: Image): Promise<Image>;
  findById(imageId: number): Promise<Image | null>;
  delete(imageId: number): Promise<void>;
}
