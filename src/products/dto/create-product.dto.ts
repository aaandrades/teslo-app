import {
  IsNumber,
  IsString,
  MinLength,
  IsOptional,
  IsPositive,
  IsArray,
  IsIn,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  stock?: number;

  @IsString()
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  images: string[];
}
