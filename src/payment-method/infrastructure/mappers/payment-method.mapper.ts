import { PaymentMethod } from "src/payment-method/domain/payment-method.aggregate";
import { PaymentMethodIcon } from "src/payment-method/domain/value-objects/payment-method-icon.vo";
import { PaymentMethodName } from "src/payment-method/domain/value-objects/payment-method-name.vo";
import { PaymentMethodEntity } from "../typeorm/payment-method-orm";

export class PaymentMethodMapper {
    static toDomain(entity: PaymentMethodEntity): PaymentMethod {
        return new PaymentMethod(
            entity.id,
            new PaymentMethodName(entity.name),
            new PaymentMethodIcon(entity.icon),
            entity.active
        );
    }

    static toPersistence(aggregate: PaymentMethod): PaymentMethodEntity {
        const entity = new PaymentMethodEntity();
        entity.id = aggregate.id;
        entity.name = aggregate.getName();
        entity.icon = aggregate.getIcon();
        entity.active = aggregate.isActive();
        return entity;
    }
}
