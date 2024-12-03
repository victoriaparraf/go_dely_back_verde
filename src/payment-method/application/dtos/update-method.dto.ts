export class UpdatePaymentMethodDTO {
    name?: string;
    icon?: string;
    active?: boolean;

    constructor(data: Partial<UpdatePaymentMethodDTO>) {
        this.name = data.name;
        this.icon = data.icon;
        this.active = data.active;
    }

    validate(): void {
        if (this.name && this.name.trim().length === 0) {
            throw new Error('Name cannot be empty.');
        }
        if (this.icon && this.icon.trim().length === 0) {
            throw new Error('Icon URL cannot be empty.');
        }
    }
}
