import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('image')
export class ImageEntity {
    @PrimaryGeneratedColumn('uuid')
    image_id: string; 

    @Column()
    image_url: string;

    @ManyToOne(() => ProductEntity, product => product.images)
    product: ProductEntity;  
}
