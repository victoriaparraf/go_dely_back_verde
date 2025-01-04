import { Product } from "./product.entity";

export class ImageEntity {
    image_id: number;
    image_url: string;
    product: Product; 
}
