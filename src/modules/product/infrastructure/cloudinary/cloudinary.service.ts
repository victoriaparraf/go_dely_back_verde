import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {

    constructor(private configService: ConfigService) {
    // Configurar Cloudinary con las variables de entorno
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadImage(imagePath: string): Promise<string> {
        try {
            //Subir archivo a cloudinary en la carpeta products
            const result = await cloudinary.uploader.upload(imagePath, {
                folder: 'products',
            });
            return result.secure_url;

        } catch (error) {

            throw new HttpException(`Failed to upload image: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);

        }
        
    }
}
