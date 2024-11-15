import { Product } from './product.entity';

export class Image {
  id: string;
  image_path(image_path: any) {
      throw new Error('Method not implemented.');
  }
  constructor(
    public readonly image_id: number,
    public image_url: string,
    public product: Product,
  ) {}

}
  