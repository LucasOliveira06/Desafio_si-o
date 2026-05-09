import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Cartorio } from '../cartorios/entities/cartorio.entity'
import { Usuario } from '../usuarios/entities/usuario.entity'
import { Imovel } from '../imoveis/entities/imovel.entity'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'siao_user'),
        password: config.get<string>('DB_PASSWORD', 'siao_pass'),
        database: config.get<string>('DB_DATABASE', 'siao_db'),
        entities: [Cartorio, Usuario, Imovel],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: config.get<string>('NODE_ENV') === 'development',
        ssl: config.get<string>('NODE_ENV') === 'production'
          ? { rejectUnauthorized: false }
          : false,
      }),
    }),
  ],
})
export class DatabaseModule {}
