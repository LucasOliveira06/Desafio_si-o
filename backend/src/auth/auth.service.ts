import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { Usuario } from '../usuarios/entities/usuario.entity'
import { LoginDto } from './dto/login.dto'
import { JwtPayload } from './interfaces/jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ token: string; user: Omit<Usuario, 'password'> }> {
    const user = await this.usuarioRepository.findOne({
      where: { email: dto.email },
      select: ['id', 'nome', 'email', 'password', 'cpf', 'telefone', 'cartorio_id'],
    })

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.')
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password)
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciais inválidas.')
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      nome: user.nome,
    }

    const token = this.jwtService.sign(payload)

    const { password: _, ...userWithoutPassword } = user
    return { token, user: userWithoutPassword as Omit<Usuario, 'password'> }
  }

  async getProfile(userId: number): Promise<Usuario> {
    const user = await this.usuarioRepository.findOneOrFail({
      where: { id: userId },
    })
    return user
  }
}
