import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Usuario } from '../../usuarios/entities/usuario.entity'
import { JwtPayload } from '../interfaces/jwt-payload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'secret'),
    })
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const user = await this.usuarioRepository.findOne({
      where: { id: payload.sub },
      withDeleted: false,
    })

    if (!user) {
      throw new UnauthorizedException('Token inválido ou usuário não encontrado.')
    }

    return { sub: payload.sub, email: payload.email, nome: payload.nome }
  }
}
