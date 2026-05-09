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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ImoveisService } from './imoveis.service'
import { CreateImovelDto } from './dto/create-imovel.dto'
import { UpdateImovelDto } from './dto/update-imovel.dto'
import { FilterImovelDto } from './dto/filter-imovel.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('Imóveis')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('imoveis')
export class ImoveisController {
  constructor(private readonly service: ImoveisService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar novo imóvel' })
  create(@Body() dto: CreateImovelDto) {
    return this.service.create(dto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar imóveis com paginação e filtros' })
  findAll(@Query() filters: FilterImovelDto) {
    return this.service.findAll(filters)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar imóvel por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar imóvel' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateImovelDto,
  ) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover imóvel (soft delete)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id)
  }
}
