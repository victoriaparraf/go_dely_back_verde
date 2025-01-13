import { Repository } from 'typeorm';
import { PaymentMethodRepositoryInterface } from '../../domain/payment-method.repository.interface';
import { PaymentMethod } from 'src/payment-method/domain/payment-method.aggregate';
import { PaymentMethodMapper } from '../mappers/payment-method.mapper';
import { PaymentMethodEntity } from './payment-method-orm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentMethodRepository implements PaymentMethodRepositoryInterface {
    constructor(
        @InjectRepository(PaymentMethodEntity)
        private readonly ormRepository: Repository<PaymentMethodEntity>,
    ) {}

    async findById(id: string): Promise<PaymentMethod | null> {
        const entity = await this.ormRepository.findOneBy({ id });
        return entity ? PaymentMethodMapper.toDomain(entity) : null;
    }

    async findByName(name: string): Promise<PaymentMethod | undefined> {
        const entity = await this.ormRepository.findOneBy({ name });
        return entity ? PaymentMethodMapper.toDomain(entity) : undefined;
    }

    async save(paymentMethod: PaymentMethod): Promise<void> {
        const entity = PaymentMethodMapper.toPersistence(paymentMethod);
        await this.ormRepository.save(entity);
    }

    async findAll(): Promise<PaymentMethod[]> {
        const entities = await this.ormRepository.find();
        return entities.map(PaymentMethodMapper.toDomain);
    }

    async update(paymentMethod: PaymentMethod): Promise<void> {
        const entity = await this.ormRepository.findOneBy({ id: paymentMethod.id });
        if (!entity) {
            throw new Error('Payment method not found');
        }
        entity.name = paymentMethod.getName();
        entity.icon = paymentMethod.getIcon();
        entity.active = paymentMethod.isActive();
        await this.ormRepository.save(entity);
    }

    async delete(id: string): Promise<void> {
        await this.ormRepository.delete({ id });
    }
}
