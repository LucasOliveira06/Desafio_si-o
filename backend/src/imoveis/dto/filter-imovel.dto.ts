import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString, Length } from 'class-validator'
import { Type } from 'class-transformer'
import { PaginationDto } from '../../common/dto/pagination.dto'
import { ImovelTipo, ImovelStatus } from '../entities/imovel.entity'

export class FilterImovelDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ enum: ['residencial', 'comercial', 'rural', 'industrial', 'outro'] })
  @IsOptional()
  @IsEnum(['residencial', 'comercial', 'rural', 'industrial', 'outro'])
  tipo?: ImovelTipo

  @ApiPropertyOptional({ enum: ['ativo', 'inativo', 'pendente'] })
  @IsOptional()
  @IsEnum(['ativo', 'inativo', 'pendente'])
  status?: ImovelStatus

  @ApiPropertyOptional()
  @IsOptional()
  @Length(2, 2)
  estado?: string

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cartorio_id?: number
}
