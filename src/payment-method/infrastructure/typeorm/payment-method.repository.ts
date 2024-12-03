import { Repository } from 'typeorm';
import { PaymentMethodRepositoryInterface } from '../../domain/payment-method.repository.interface';
import { PaymentMethod } from 'src/payment-method/domain/payment-method.aggregate';
import { PaymentMethodMapper } from '../mappers/payment-method.mapper';
import { PaymentMethodEntity } from './payment-method-orm';


export class PaymentMethodRepository implements PaymentMethodRepositoryInterface {
    constructor(private ormRepository: Repository<PaymentMethodEntity>) {}

    async findById(id: string): Promise<PaymentMethod | null> {
        const entity = await this.ormRepository.findOneBy({ id });
        return entity ? PaymentMethodMapper.toDomain(entity) : null;
    }

    async save(paymentMethod: PaymentMethod): Promise<void> {
        const entity = PaymentMethodMapper.toPersistence(paymentMethod);
        await this.ormRepository.save(entity);
    }

    async findAll(): Promise<PaymentMethod[]> {
        const entities = await this.ormRepository.find();
        return entities.map(PaymentMethodMapper.toDomain);
    }
}
