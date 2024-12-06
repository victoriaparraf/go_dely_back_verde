import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../typeorm/user.entity';


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

  @ManyToOne(() => User, client => client.addresses)
  user: User;
}
