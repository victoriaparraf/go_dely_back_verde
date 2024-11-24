import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseInterceptors, UploadedFiles, Inject } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ProductService } from './product.service';
import { CreateProductDto } from '../application/dto/create-product.dto';
import { UpdateProductDto } from '../application/dto/update-product.dto';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Product')
@Controller('products')
export class ProductController {

  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('create')
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {

    const imageUrls = [];
    // Cargar cada archivo en Cloudinary y guardar las URLs
    if (files && files.length) {
      for (const file of files) {
        const imageUrl = await this.cloudinaryService.uploadImage(file.path);
        imageUrls.push(imageUrl);
      }
    }

    const product = this.productService.create(createProductDto, imageUrls);
    return product;
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productService.findAll( paginationDto );
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productService.findOne(term);
  }

  @Patch(':product_id')
  update(@Param('product_id', ParseUUIDPipe ) product_id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(product_id, updateProductDto);
  }


  @Delete(':product_id')
  remove(@Param('product_id', ParseUUIDPipe) product_id: string) {
    return this.productService.remove(product_id);
  }
}
