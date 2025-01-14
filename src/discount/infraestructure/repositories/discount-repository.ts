import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Discount } from '../typeorm/discount.entity';
import { IDiscountRepository } from 'src/discount/domain/repositories/discount-respository-interface';

@Injectable()
export class DiscountRepository implements IDiscountRepository {
    constructor(
        @InjectRepository(Discount)
        private readonly discountRepository: Repository<Discount>,
    ) {}

    async createDiscount(discountData: Discount) {
        const discountEntity = this.discountRepository.create(discountData);
        return discountEntity;
    }

    async saveDiscount(discount: Discount) {
        return this.discountRepository.save(discount);
    }

    async findOne(term: string) {

        let discount: Discount;
        if (isUUID(term)) {
            discount = await this.discountRepository.findOne({
                where: { discount_id: term },
                relations: ['product', 'combo'],
            });
        } else {
            discount = await this.discountRepository
                .createQueryBuilder('discount')
                .leftJoinAndSelect('discount.products', 'product')
                .leftJoinAndSelect('discount.combos', 'combo')
                .where('discount.discount_name = :discount_name', { discount_name: term })
                .getOne();
        }
        return discount;

    }

    async findAll(paginationDto: { page: number; perpage: number }) {

        const { page, perpage } = paginationDto;
        return this.discountRepository.find({
        take: perpage,
        skip: (page - 1) * perpage,
        relations: ['products', 'combos'],
        });

    }

    async updateDiscount(discount: Discount) {
        return this.discountRepository.save(discount);
    }

    async removeDiscount(discount: Discount) {
        return this.discountRepository.remove(discount);
    }
    
}
