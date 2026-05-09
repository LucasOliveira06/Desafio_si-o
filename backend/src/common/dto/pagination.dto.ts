import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsPositive, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class PaginationDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  per_page?: number = 10
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  last_page: number
}
