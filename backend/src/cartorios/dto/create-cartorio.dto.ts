import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator'

export class CreateCartorioDto {
  @ApiProperty({ example: '1º Cartório de Registro de Imóveis de SP' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString()
  nome!: string

  @ApiProperty({ example: '12.345.678/0001-90' })
  @IsNotEmpty({ message: 'O CNPJ é obrigatório.' })
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: 'CNPJ deve estar no formato 00.000.000/0001-00.',
  })
  cnpj!: string

  @ApiPropertyOptional({ example: '(11) 3333-1111' })
  @IsOptional()
  @IsString()
  telefone?: string

  @ApiPropertyOptional({ example: 'cartorio@email.com' })
  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido.' })
  email?: string

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
  @Length(2, 2, { message: 'O estado deve ter exatamente 2 caracteres (UF).' })
  estado!: string

  @ApiPropertyOptional({ example: '01310-100' })
  @IsOptional()
  @IsString()
  cep?: string

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  responsavel_id?: number

  @ApiPropertyOptional({ example: 'Ana Paula Ferreira' })
  @IsOptional()
  @IsString()
  responsavel_nome?: string

  @ApiPropertyOptional({ example: '111.222.333-44' })
  @IsOptional()
  @IsString()
  responsavel_cpf?: string
}
