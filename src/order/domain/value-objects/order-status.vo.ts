import { ValueObject } from 'src/common/domain/value.object';

export class OrderStatus extends ValueObject<string> {

    protected validate(value: string): void {
        const validStatus = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELED'];
        if (!validStatus.includes(value)) {
            throw new Error('Invalid order status');
        }
    }

    getValue(): string {
        return this.value;
    }
}
