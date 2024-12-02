export abstract class DomainEventBase {
    readonly occurredOn: Date;

    constructor() {
        this.occurredOn = new Date();
    }

    abstract eventName(): string;
}
