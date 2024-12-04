import { IsEmail, IsPhoneNumber, IsString, isValidationOptions, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsEmail()
    user_email: string;

    @IsString()
    @MinLength(1)
    user_name: string;

    @IsString()
    @MinLength(5)
    @MaxLength(20)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    user_password: string;

    @IsString()
    user_phone: string;

    
}
