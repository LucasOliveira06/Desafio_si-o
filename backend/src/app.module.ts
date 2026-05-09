import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { AuthModule } from './auth/auth.module'
import { CartoriosModule } from './cartorios/cartorios.module'
import { ImoveisModule } from './imoveis/imoveis.module'
import { UsuariosModule } from './usuarios/usuarios.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    CartoriosModule,
    ImoveisModule,
    UsuariosModule,
  ],
})
export class AppModule {}
