import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, isValidationOptions, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsString()
    @MinLength(5)
    @MaxLength(20)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    phone: string;

    @IsOptional()
    @IsEnum(['CLIENT', 'ADMIN'], { message: 'Role must be either CLIENT or ADMIN' })
    role?: 'CLIENT' | 'ADMIN' = 'CLIENT';

    
}
