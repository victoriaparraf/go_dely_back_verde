import { Module } from '@nestjs/common';
import { CloudinaryModule } from './infraestructure/cloudinary/cloudinary.module';

@Module({
    imports: [ CloudinaryModule ],
    exports: [ CloudinaryModule ]
})
export class CommonModule {}
