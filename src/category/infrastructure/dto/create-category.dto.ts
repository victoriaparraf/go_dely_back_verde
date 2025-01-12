import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
<<<<<<< HEAD:src/category/application/dto/create-category.dto.ts
  description: string;
=======
  @IsNotEmpty()
  image: string;
>>>>>>> eb6487b6eeb771d2a390cfc9a7bacaa531607f4a:src/category/infrastructure/dto/create-category.dto.ts
}
