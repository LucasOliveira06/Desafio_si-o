import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cartorio } from './entities/cartorio.entity'
import { CartoriosController } from './cartorios.controller'
import { CartoriosService } from './cartorios.service'

@Module({
  imports: [TypeOrmModule.forFeature([Cartorio])],
  controllers: [CartoriosController],
  providers: [CartoriosService],
  exports: [CartoriosService],
})
export class CartoriosModule {}
