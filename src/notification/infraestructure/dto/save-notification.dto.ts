import { IsString } from 'class-validator';

export class SaveNotificationDto {
    @IsString()
    token: string;
}
