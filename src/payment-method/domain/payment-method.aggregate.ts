import { AggregateRoot } from "src/common/domain/aggregate.root";
import { PaymentMethodIcon } from "./value-objects/payment-method-icon.vo";
import { PaymentMethodName } from "./value-objects/payment-method-name.vo";

export class PaymentMethod extends AggregateRoot<string> {

    private name: PaymentMethodName;
    private icon: PaymentMethodIcon;
    private active: boolean;

    constructor(id: string, name: PaymentMethodName, icon: PaymentMethodIcon, active: boolean) {
        super(id);
        this.name = name;
        this.icon = icon;
        this.active = active;
    }

    activate(): void {
        this.active = true;
    }

    deactivate(): void {
        this.active = false;
    }

    isActive(): boolean {
        return this.active;
    }

    getName(): string {
        return this.name.value;
    }

    getIcon(): string {
        return this.icon.value;
    }

    updateIcon(newIcon: PaymentMethodIcon): void {
        this.icon = newIcon;
    }

    updateName(newName: PaymentMethodName): void {
        this.name = newName;
    }
}
