import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/common/infrastructure/dtos/pagination.dto'; // Asegúrate de tener la ruta correcta
import { ProductDTO } from '../application/dtos/product.dto';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from '../application/services/product.service'; // Importa el DTO de actualización
import { CloudinaryService } from './cloudinary/cloudinary.service';

@ApiTags('Product')
@Controller('products')
export class ProductController {

  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // Crear producto y asociar imágenes
  @Post()
  @UseInterceptors(FilesInterceptor('files'))  // Para manejar la subida de archivos
  async create(
    @Body() createProductDto: ProductDTO,
    @UploadedFiles() files: Express.Multer.File[],  // Los archivos subidos
  ) {
    const imageUrls = [];

    // Cargar cada archivo en Cloudinary y guardar las URLs
    if (files && files.length) {
      for (const file of files) {
        const imageUrl = await this.cloudinaryService.uploadImage(file.path);  // Subir a Cloudinary
        imageUrls.push(imageUrl);
      }
    }

    // Crear el producto, asociando las imágenes cargadas
    const product = await this.productService.createProduct(createProductDto, imageUrls);
    return product;  // Retornar el producto con sus imágenes
  }

  // Obtener todos los productos (con paginación)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.productService.findAll(paginationDto);
  }

  // Obtener un producto por su ID o término de búsqueda
  @Get(':term')
  async findOne(@Param('term') term: string) {
    return await this.productService.getProductById(term);
  }

  // Eliminar un producto
  @Delete(':product_id')
  async remove(@Param('product_id', ParseUUIDPipe) product_id: string) {
    return await this.productService.removeProduct(product_id);
  }
}
