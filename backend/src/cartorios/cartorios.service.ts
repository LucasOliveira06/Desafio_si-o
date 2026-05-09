import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'
import { Cartorio } from './entities/cartorio.entity'
import { CreateCartorioDto } from './dto/create-cartorio.dto'
import { UpdateCartorioDto } from './dto/update-cartorio.dto'
import { FilterCartorioDto } from './dto/filter-cartorio.dto'
import { PaginatedResult } from '../common/dto/pagination.dto'

@Injectable()
export class CartoriosService {
  constructor(
    @InjectRepository(Cartorio)
    private readonly repo: Repository<Cartorio>,
  ) {}

  async create(dto: CreateCartorioDto): Promise<Cartorio> {
    const existing = await this.repo.findOne({ where: { cnpj: dto.cnpj } })
    if (existing) {
      throw new ConflictException(`Já existe um cartório com o CNPJ ${dto.cnpj}.`)
    }

    const cartorio = this.repo.create(dto)
    return this.repo.save(cartorio)
  }

  async findAll(filters: FilterCartorioDto): Promise<PaginatedResult<Cartorio>> {
    const { page = 1, per_page = 10, search, estado } = filters
    const skip = (page - 1) * per_page

    const qb = this.repo.createQueryBuilder('c').where('c.deleted_at IS NULL')

    if (search) {
      qb.andWhere(
        '(c.nome ILIKE :s OR c.cnpj ILIKE :s OR c.responsavel_nome ILIKE :s)',
        { s: `%${search}%` },
      )
    }

    if (estado) {
      qb.andWhere('c.estado = :estado', { estado })
    }

    const [data, total] = await qb
      .orderBy('c.created_at', 'DESC')
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

  async findOne(id: number): Promise<Cartorio> {
    const cartorio = await this.repo.findOne({ where: { id } })
    if (!cartorio) {
      throw new NotFoundException(`Cartório #${id} não encontrado.`)
    }
    return cartorio
  }

  async update(id: number, dto: UpdateCartorioDto): Promise<Cartorio> {
    const cartorio = await this.findOne(id)

    if (dto.cnpj && dto.cnpj !== cartorio.cnpj) {
      const conflict = await this.repo.findOne({ where: { cnpj: dto.cnpj } })
      if (conflict) {
        throw new ConflictException(`Já existe um cartório com o CNPJ ${dto.cnpj}.`)
      }
    }

    Object.assign(cartorio, dto)
    return this.repo.save(cartorio)
  }

  async remove(id: number): Promise<void> {
    const cartorio = await this.findOne(id)
    await this.repo.softRemove(cartorio)
  }
}
