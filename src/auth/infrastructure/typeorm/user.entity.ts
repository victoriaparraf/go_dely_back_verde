import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User {

    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column('text', {
        unique: true
    })
    user_email: string;

    @Column('text', {
        select: false
    })
    user_password: string;

    @Column('text', {
        default: 'client'
    })
    user_type: string;

    @Column('text', {
        default: 'active'
    })
    user_status: string;
}
