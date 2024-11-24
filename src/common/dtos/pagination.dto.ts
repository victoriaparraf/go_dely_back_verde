import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @Type ( () => Number )
    page?: number;

    @IsOptional()
    @Min(0)
    @Type ( () => Number )
    perpage?: number;

}