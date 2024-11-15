import { Product } from "./product.entity";

export class Image {
  id: string;
  constructor(
    public readonly image_id: number,
    public image_url: string,
    public product: Product
  ) {}
}
