import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseInterceptors, UploadedFiles, Inject } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductService } from '../application/command/create-product-service';
import { GetProductServicePaginationDto, GetProductServiceEntryDto } from '../application/dto/entry/get-product-entry.dto';
import { GetProductService } from '../application/query/get-product-service';
import { GetProductsByCategoryService } from '../application/query/get-products-by-category-service';
import { UpdateProductServiceEntryDto } from '../application/dto/entry/update-product-service-entry.dto';
import { UpdateProductService } from '../application/command/update-product-service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { DeleteProductService } from '../application/command/delete-product-service';
import { GetProductsCombosSummaryService } from '../application/query/get-products-combos-service';

@ApiTags('Product')
@Controller('products')
export class ProductController {

  constructor(
    private readonly createProductService: CreateProductService,
    private readonly getProductService: GetProductService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly getProductsByCategoryService: GetProductsByCategoryService,
    private readonly deleteProductService: DeleteProductService,
    private readonly getProductsCombosSummaryService: GetProductsCombosSummaryService,
    private readonly updateProductService: UpdateProductService,
  ) {}

  @Post('create')
  async create(@Body() createProductDto: CreateProductDto) {

    const createProductServiceEntryDto = {
      ...createProductDto,
      product_weight: Number(createProductDto.product_weight),
      product_stock: createProductDto.product_stock ?? 0,
    };

    const product = await this.createProductService.execute(createProductServiceEntryDto);
    
    //TESTING
    console.log('Created product response:', product);
    /////////

    return product;
  }

  @Get('summary')
  async getProductsCombosSummary() {
    return this.getProductsCombosSummaryService.execute();
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

  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string) {
    return this.getProductsByCategoryService.execute(categoryId);
  }

  @Patch(':product_id')
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Param('product_id', ParseUUIDPipe) product_id: string,
    @Body() updateProductDto: UpdateProductDto,
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

    const updateProductServiceEntryDto: UpdateProductServiceEntryDto = {
      ...updateProductDto,
      product_id,
      images: imageUrls.length ? imageUrls : undefined,
      product_weight: updateProductDto.product_weight ? Number(updateProductDto.product_weight) : undefined,
    };

    await this.updateProductService.execute(updateProductServiceEntryDto);
    return { message: 'Product updated successfully' };
  }


  @Delete(':product_id')
  async remove(@Param('product_id', ParseUUIDPipe) product_id: string) {
    await this.deleteProductService.execute(product_id);
    return { message: 'Product deleted successfully' };
  }
}
