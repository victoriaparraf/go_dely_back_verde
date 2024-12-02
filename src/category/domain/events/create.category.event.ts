import { DomainEventBase } from 'src/common/domain/event';

export class CategoryCreatedEvent extends DomainEventBase {
    constructor(
        public readonly categoryId: string,
        public readonly name: string,
        public readonly description: string
    ) {
        super();
    }

    eventName(): string {
        return 'CategoryCreated';
    }
}
