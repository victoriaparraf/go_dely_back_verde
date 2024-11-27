import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Discount {
    
    @PrimaryGeneratedColumn('uuid')
    discount_id: string;

    @Column('int', { default: 0 })
    discount_percentage: number;

    @Column({ type: 'date' })  
    discount_start_date: Date;

    @Column({ type: 'date' }) 
    discount_end_date: Date;
}

