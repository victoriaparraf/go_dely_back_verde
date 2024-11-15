import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

    // Subir imagen a Cloudinary y devolver la URL
    async uploadImage(imagePath: string): Promise<string> {
        try {
            const result = await cloudinary.uploader.upload(imagePath, {
                folder: 'products', // Carpeta de productos en Cloudinary
            });
            return result.secure_url;
        } catch (error) {
            throw new HttpException(`Failed to upload image: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Eliminar imagen de Cloudinary
    async deleteImage(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            throw new HttpException(`Failed to delete image: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
