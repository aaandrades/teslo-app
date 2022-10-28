import { NotFoundException } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      // Map request
      const product = this.productRepository.create(createProductDto);
      // Save on DB
      await this.productRepository.save(product);
      // Return new product
      return product;
    } catch (error) {
      this.handleDBExections(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = this.productRepository.find({
      take: limit,
      skip: offset,
    });
    return products;
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where(`UPPER(title) =:title or slug =:slug`, {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .getOne();
    }

    // if (!product) {
    //   product = await this.productRepository.findOneBy({ term });
    // }

    if (!product) {
      throw new NotFoundException(`Product with term: ${term} not found`);
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.productRepository.delete({ id });
    } catch (error) {
      this.handleDBExections(error);
    }
  }

  private handleDBExections(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, please verify logs',
    );
  }
}
