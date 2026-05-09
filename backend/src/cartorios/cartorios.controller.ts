import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CartoriosService } from './cartorios.service'
import { CreateCartorioDto } from './dto/create-cartorio.dto'
import { UpdateCartorioDto } from './dto/update-cartorio.dto'
import { FilterCartorioDto } from './dto/filter-cartorio.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('Cartórios')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('cartorios')
export class CartoriosController {
  constructor(private readonly service: CartoriosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo cartório' })
  @ApiResponse({ status: 201, description: 'Cartório criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 409, description: 'CNPJ já cadastrado.' })
  create(@Body() dto: CreateCartorioDto) {
    return this.service.create(dto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar cartórios com paginação e filtros' })
  findAll(@Query() filters: FilterCartorioDto) {
    return this.service.findAll(filters)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cartório por ID' })
  @ApiResponse({ status: 404, description: 'Cartório não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um cartório' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartorioDto,
  ) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover cartório (soft delete)' })
  @ApiResponse({ status: 204, description: 'Cartório removido.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id)
  }
}
