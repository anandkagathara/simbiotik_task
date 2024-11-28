import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray } from 'class-validator';

export class FilterTopicsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;
}