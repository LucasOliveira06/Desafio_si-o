import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator'

export class CreateUsuarioDto {
  @ApiProperty({ example: 'João da Silva' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString()
  nome!: string

  @ApiProperty({ example: '123.456.789-00' })
  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  @IsString()
  cpf!: string

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail({}, { message: 'E-mail inválido.' })
  email!: string

  @ApiProperty({ example: '123456', minLength: 6 })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password!: string

  @ApiPropertyOptional({ example: '(11) 98888-1111' })
  @IsOptional()
  @IsString()
  telefone?: string

  @ApiPropertyOptional({ example: 'Rua das Flores, 100' })
  @IsOptional()
  @IsString()
  endereco?: string

  @ApiPropertyOptional({ example: 'São Paulo' })
  @IsOptional()
  @IsString()
  cidade?: string

  @ApiPropertyOptional({ example: 'SP' })
  @IsOptional()
  @Length(2, 2, { message: 'O estado deve ter 2 caracteres.' })
  estado?: string

  @ApiPropertyOptional({ example: '01310-100' })
  @IsOptional()
  @IsString()
  cep?: string

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  cartorio_id?: number | null
}
