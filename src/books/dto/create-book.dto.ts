import { IsNotEmpty, IsString, IsDate, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty( {example: `Saurashtra ni rasdhar`})
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty( {example: `Javerchand meghani`})
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  publishedDate?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  isbn: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topics?: string[];
}