import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, Length } from 'class-validator'
import { PaginationDto } from '../../common/dto/pagination.dto'

export class FilterCartorioDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Busca por nome, CNPJ ou responsável' })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ example: 'SP' })
  @IsOptional()
  @Length(2, 2)
  estado?: string
}
