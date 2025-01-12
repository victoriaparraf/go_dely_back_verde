import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user-entity';
import { OrderEntity } from 'src/order/infraestructure/typeorm/order-entity';


@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  address_id: string;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude: number;

  @Column()
  name: string;

  @Column()
  favorite: boolean;

  @ManyToOne(() => User, user => user.addresses)
  user: User;

  @OneToMany(() => OrderEntity, order => order.address)
  orders: OrderEntity[];
}
