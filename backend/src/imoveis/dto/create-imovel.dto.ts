import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator'
import { ImovelTipo, ImovelStatus } from '../entities/imovel.entity'

export class CreateImovelDto {
  @ApiProperty({ example: 'MAT-001-2024' })
  @IsNotEmpty({ message: 'A matrícula é obrigatória.' })
  @IsString()
  matricula!: string

  @ApiProperty({ enum: ['residencial', 'comercial', 'rural', 'industrial', 'outro'] })
  @IsEnum(['residencial', 'comercial', 'rural', 'industrial', 'outro'], {
    message: 'Tipo inválido.',
  })
  tipo!: ImovelTipo

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logradouro?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  numero?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bairro?: string

  @ApiProperty({ example: 'São Paulo' })
  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  @IsString()
  cidade!: string

  @ApiProperty({ example: 'SP' })
  @IsNotEmpty({ message: 'O estado é obrigatório.' })
  @Length(2, 2, { message: 'O estado deve ter 2 caracteres.' })
  estado!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cep?: string

  @ApiPropertyOptional({ example: 120.5 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  area_total?: number

  @ApiPropertyOptional({ example: 650000.0 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  valor_avaliado?: number

  @ApiPropertyOptional({ enum: ['ativo', 'inativo', 'pendente'], default: 'ativo' })
  @IsOptional()
  @IsEnum(['ativo', 'inativo', 'pendente'], { message: 'Status inválido.' })
  status?: ImovelStatus

  @ApiProperty({ example: 1, description: 'ID do proprietário (usuário)' })
  @IsNotEmpty({ message: 'O proprietário_id é obrigatório.' })
  @IsNumber()
  proprietario_id!: number

  @ApiProperty({ example: 'João da Silva' })
  @IsNotEmpty({ message: 'O nome do proprietário é obrigatório.' })
  @IsString()
  proprietario_nome!: string

  @ApiProperty({ example: '123.456.789-00' })
  @IsNotEmpty({ message: 'O CPF/CNPJ do proprietário é obrigatório.' })
  @IsString()
  proprietario_cpf!: string

  @ApiProperty({ example: 1, description: 'ID do cartório vinculado' })
  @IsNotEmpty({ message: 'O cartorio_id é obrigatório.' })
  @IsNumber()
  cartorio_id!: number
}
