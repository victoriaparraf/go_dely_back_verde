import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
<<<<<<< HEAD:src/category/application/dto/update-category.dto.ts
  description: string;
=======
  @IsNotEmpty()
  image: string;
>>>>>>> eb6487b6eeb771d2a390cfc9a7bacaa531607f4a:src/category/infrastructure/dto/update-category.dto.ts
}
