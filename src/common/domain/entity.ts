export abstract class Entity<ID> {
    readonly id: ID;

    constructor(id: ID) {
        this.id = id;
    }

    equals(entity: Entity<ID>): boolean {
        return entity.id === this.id;
    }
}
