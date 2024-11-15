import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/common/infrastructure/dtos/pagination.dto'; 
import { ProductDTO } from '../application/dtos/product.dto';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from '../application/services/product.service'; 
import { CloudinaryService } from './cloudinary/cloudinary.service';

@ApiTags('Product')
@Controller('products')
export class ProductController {

  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files')) 
  async create(
    @Body() createProductDto: ProductDTO,
    @UploadedFiles() files: Express.Multer.File[],  
  ) {
    const imageUrls = [];

    if (files && files.length) {
      for (const file of files) {
        const imageUrl = await this.cloudinaryService.uploadImage(file.path); 
        imageUrls.push(imageUrl);
      }
    }

    const product = await this.productService.createProduct(createProductDto, imageUrls);
    return product;
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.productService.findAll(paginationDto);
  }

  @Get(':term')
  async findOne(@Param('term') term: string) {
    return await this.productService.getProductById(term);
  }

  @Delete(':product_id')
  async remove(@Param('product_id', ParseUUIDPipe) product_id: string) {
    return await this.productService.removeProduct(product_id);
  }
}
