import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseInterceptors, UploadedFiles, Inject } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ProductService } from './product.service';
import { CreateProductDto } from '../application/dto/create-product.dto';
import { UpdateProductDto } from '../application/dto/update-product.dto';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductService } from '../application/command/create_product_service';
import { CreateProductServiceEntryDto } from '../application/dto/create-product-entry.dto';
import { GetProductServicePaginationDto, GetProductServiceEntryDto } from '../application/dto/get-product-entry.dto';
import { GetProductService } from '../application/query/get-product-service';

@ApiTags('Product')
@Controller('products')
export class ProductController {

  constructor(
    private readonly createProductService: CreateProductService,
    private readonly getProductService: GetProductService,
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
        const imageUrl = await this.cloudinaryService.uploadImage(file.path, 'products');
        imageUrls.push(imageUrl);
      }
    }

    const createProductServiceEntryDto: CreateProductServiceEntryDto = {
      ...createProductDto,
      images: imageUrls,
      product_weight: Number(createProductDto.product_weight),
      product_stock: createProductDto.product_stock ?? 0,
    };

    const product = await this.createProductService.execute(createProductServiceEntryDto);
    return product;
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const getProductServicePaginationDto: GetProductServicePaginationDto = {
      page: paginationDto.page,
      perpage: paginationDto.perpage,
    };
    return this.getProductService.findAll(getProductServicePaginationDto);
  }

  @Get(':term')
  async findOne(@Param('term') term: string) {
    const getProductServiceEntryDto: GetProductServiceEntryDto = { term };
    return this.getProductService.execute(getProductServiceEntryDto);
  }

  //@Patch(':product_id')
 //update(@Param('product_id', ParseUUIDPipe ) product_id: string, @Body() updateProductDto: UpdateProductDto) {
    //return this.productService.update(product_id, updateProductDto);
  //}


  //@Delete(':product_id')
  //remove(@Param('product_id', ParseUUIDPipe) product_id: string) {
   // return this.productService.remove(product_id);
  //}
}
