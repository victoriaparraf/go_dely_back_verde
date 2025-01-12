import { AggregateRoot } from 'src/common/domain/aggregate.root';
import { CategoryID } from './value-objects/category-id.vo';
import { CategoryName } from './value-objects/category-name.vo';
import { CategoryImage } from './value-objects/category-image.vo';

export class Category extends AggregateRoot<CategoryID> {
    private name: CategoryName;
    private image: CategoryImage;

    constructor (id: CategoryID, name: CategoryName, image: CategoryImage) {
        super(id);
        this.name = name;
        this.image = image;
    }

    static create(name: string, image: string): Category {
        return new Category(
            new CategoryID(),
            new CategoryName(name),
            new CategoryImage(image)
        );
    }

    static reconstitute(id: CategoryID, name: string, image: string): Category {
        return new Category(
            id,
            new CategoryName(name),
            new CategoryImage(image)
        );
    }

    getId(): CategoryID {
        return this.id;
    }

    public getName(): CategoryName {
        return this.name;
    }

    public getImage(): CategoryImage {
        return this.image;
    }

    updateName(newName: CategoryName): void {
        this.name = newName;
    }

    updateImage(newImage: CategoryImage): void {
        this.image = newImage;
    }
}
