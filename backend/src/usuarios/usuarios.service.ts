import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { Usuario } from './entities/usuario.entity'
import { CreateUsuarioDto } from './dto/create-usuario.dto'
import { UpdateUsuarioDto } from './dto/update-usuario.dto'
import { FilterUsuarioDto } from './dto/filter-usuario.dto'
import { PaginatedResult } from '../common/dto/pagination.dto'

const SALT_ROUNDS = 12

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const [emailExists, cpfExists] = await Promise.all([
      this.repo.findOne({ where: { email: dto.email } }),
      this.repo.findOne({ where: { cpf: dto.cpf } }),
    ])

    if (emailExists) throw new ConflictException('E-mail já cadastrado.')
    if (cpfExists) throw new ConflictException('CPF já cadastrado.')

    const hash = await bcrypt.hash(dto.password, SALT_ROUNDS)
    const usuario = this.repo.create({ ...dto, password: hash })
    const saved = await this.repo.save(usuario)

    const { password: _, ...result } = saved
    return result as Usuario
  }

  async findAll(filters: FilterUsuarioDto): Promise<PaginatedResult<Usuario>> {
    const { page = 1, per_page = 10, search, estado, cartorio_id } = filters
    const skip = (page - 1) * per_page

    const qb = this.repo.createQueryBuilder('u').where('u.deleted_at IS NULL')

    if (search) {
      qb.andWhere(
        '(u.nome ILIKE :s OR u.email ILIKE :s OR u.cpf ILIKE :s)',
        { s: `%${search}%` },
      )
    }

    if (estado) qb.andWhere('u.estado = :estado', { estado })
    if (cartorio_id) qb.andWhere('u.cartorio_id = :cartorio_id', { cartorio_id })

    const [data, total] = await qb
      .orderBy('u.created_at', 'DESC')
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

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.repo.findOne({ where: { id } })
    if (!usuario) throw new NotFoundException(`Usuário #${id} não encontrado.`)
    return usuario
  }

  async update(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id)

    if (dto.email && dto.email !== usuario.email) {
      const conflict = await this.repo.findOne({ where: { email: dto.email } })
      if (conflict) throw new ConflictException('E-mail já cadastrado.')
    }

    if (dto.cpf && dto.cpf !== usuario.cpf) {
      const conflict = await this.repo.findOne({ where: { cpf: dto.cpf } })
      if (conflict) throw new ConflictException('CPF já cadastrado.')
    }

    const { password, ...rest } = dto
    Object.assign(usuario, rest)

    if (password) {
      usuario.password = await bcrypt.hash(password, SALT_ROUNDS)
    }

    return this.repo.save(usuario)
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id)
    await this.repo.softRemove(usuario)
  }
}
