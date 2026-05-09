import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Imovel } from './entities/imovel.entity'
import { CreateImovelDto } from './dto/create-imovel.dto'
import { UpdateImovelDto } from './dto/update-imovel.dto'
import { FilterImovelDto } from './dto/filter-imovel.dto'
import { PaginatedResult } from '../common/dto/pagination.dto'

@Injectable()
export class ImoveisService {
  constructor(
    @InjectRepository(Imovel)
    private readonly repo: Repository<Imovel>,
  ) {}

  async create(dto: CreateImovelDto): Promise<Imovel> {
    const existing = await this.repo.findOne({ where: { matricula: dto.matricula } })
    if (existing) {
      throw new ConflictException(`Já existe um imóvel com a matrícula ${dto.matricula}.`)
    }

    const imovel = this.repo.create(dto)
    return this.repo.save(imovel)
  }

  async findAll(filters: FilterImovelDto): Promise<PaginatedResult<Imovel>> {
    const {
      page = 1,
      per_page = 10,
      search,
      tipo,
      status,
      estado,
      cartorio_id,
    } = filters
    const skip = (page - 1) * per_page

    const qb = this.repo.createQueryBuilder('i').where('i.deleted_at IS NULL')

    if (search) {
      qb.andWhere(
        '(i.matricula ILIKE :s OR i.proprietario_nome ILIKE :s OR i.cidade ILIKE :s)',
        { s: `%${search}%` },
      )
    }

    if (tipo) qb.andWhere('i.tipo = :tipo', { tipo })
    if (status) qb.andWhere('i.status = :status', { status })
    if (estado) qb.andWhere('i.estado = :estado', { estado })
    if (cartorio_id) qb.andWhere('i.cartorio_id = :cartorio_id', { cartorio_id })

    const [data, total] = await qb
      .orderBy('i.created_at', 'DESC')
      .skip(skip)
      .take(per_page)
      .getManyAndCount()

    return {
      data,
      total,
      page,
      per_page,
      last_page: Math.ceil(total / per_page) || 1,
    }
  }

  async findOne(id: number): Promise<Imovel> {
    const imovel = await this.repo.findOne({
      where: { id },
      relations: ['cartorio'],
    })
    if (!imovel) throw new NotFoundException(`Imóvel #${id} não encontrado.`)
    return imovel
  }

  async update(id: number, dto: UpdateImovelDto): Promise<Imovel> {
    const imovel = await this.findOne(id)

    if (dto.matricula && dto.matricula !== imovel.matricula) {
      const conflict = await this.repo.findOne({ where: { matricula: dto.matricula } })
      if (conflict) {
        throw new ConflictException(`Matrícula ${dto.matricula} já cadastrada.`)
      }
    }

    Object.assign(imovel, dto)
    return this.repo.save(imovel)
  }

  async remove(id: number): Promise<void> {
    const imovel = await this.findOne(id)
    await this.repo.softRemove(imovel)
  }
}
