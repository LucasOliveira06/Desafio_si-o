import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { config } from 'dotenv'
import { Cartorio } from '../cartorios/entities/cartorio.entity'
import { Usuario } from '../usuarios/entities/usuario.entity'
import { Imovel } from '../imoveis/entities/imovel.entity'

config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'siao_user',
  password: process.env.DB_PASSWORD ?? 'siao_pass',
  database: process.env.DB_DATABASE ?? 'siao_db',
  entities: [Cartorio, Usuario, Imovel],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
})
