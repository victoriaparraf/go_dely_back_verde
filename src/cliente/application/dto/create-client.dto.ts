import { IsString, IsUUID, MinLength } from "class-validator";



export class CreateClientDto {

    @IsString()
    @MinLength(1)
    client_id:string;

    @IsString()
    @MinLength(1)
    client_name: string;

    @IsString()
    client_phone: string;

    @IsString()
    client_image: string;
    
}
