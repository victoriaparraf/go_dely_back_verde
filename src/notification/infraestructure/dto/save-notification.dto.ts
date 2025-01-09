import { IsString } from 'class-validator';

export class SaveNotificationDto {
    @IsString()
    notification_token: string;
}
