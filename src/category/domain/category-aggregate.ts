import { AggregateRoot } from 'src/common/domain/aggregate.root';
import { CategoryID } from './value-objects/category-id.vo';
import { CategoryName } from './value-objects/category-name.vo';
import { CategoryDescription } from './value-objects/category-description.vo';

export class Category extends AggregateRoot<CategoryID> {
    private name: CategoryName;
    private description: CategoryDescription;

    constructor (id: CategoryID, name: CategoryName, description: CategoryDescription) {
        super(id);
        this.name = name;
        this.description = description;
    }

    static create(name: string, description: string): Category {
        return new Category(
            new CategoryID(),
            new CategoryName(name),
            new CategoryDescription(description)
        );
    }

    static reconstitute(id: CategoryID, name: string, description: string): Category {
        return new Category(
            id,
            new CategoryName(name),
            new CategoryDescription(description)
        );
    }

    getId(): CategoryID {
        return this.id;
    }

    public getName(): CategoryName {
        return this.name;
    }

    public getDescription(): CategoryDescription {
        return this.description;
    }

    updateName(newName: CategoryName): void {
        this.name = newName;
    }

    updateDescription(newDescription: CategoryDescription): void {
        this.description = newDescription;
    }
}
