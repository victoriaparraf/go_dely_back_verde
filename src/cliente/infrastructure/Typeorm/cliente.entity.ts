import { ClientName } from "src/cliente/domain/value-object/client-name";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Address } from "./address.entity";
import { ClientPhone } from "src/cliente/domain/value-object/client-phone";
import { User } from "src/auth/infrastructure/typeorm/user.entity";



@Entity()
export class Client {

    @PrimaryColumn()
    client_id: string;

    @Column({
        type: 'varchar',
        transformer: {
        to: (value: ClientName) => value.getValue(),
        from: (value: string) => value ? new ClientName(value) : new ClientName('Cliente'),
        },
    })
    client_name: string;

    @Column({
        type: 'varchar',
        transformer: {
        to: (value: ClientPhone) => value.getValue(),
        from: (value: string) => value ? new ClientName(value) : new ClientName('Cliente'),
        },
    })
    client_phone: string;

    @Column()
    client_image: string;

    @OneToOne(() => User) 
    @JoinColumn({ name: 'client_id' }) 
    user: User;

    @OneToMany(() => Address, address => address.client, { cascade: true }) 
    addresses: Address[] = [];

}
