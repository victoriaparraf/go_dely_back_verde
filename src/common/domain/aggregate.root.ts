import { DomainEventBase } from './event';

export abstract class AggregateRoot<ID> {
    readonly id: ID;
    private domainEvents: DomainEventBase[] = [];

    constructor(id: ID) {
        this.id = id;
    }

    addDomainEvent(event: DomainEventBase): void {
        this.domainEvents.push(event);
    }

    getDomainEvents(): DomainEventBase[] {
        return this.domainEvents;
    }

    clearDomainEvents(): void {
        this.domainEvents = [];
    }
}
