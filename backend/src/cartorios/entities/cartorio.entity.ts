import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm'
import { Usuario } from '../../usuarios/entities/usuario.entity'
import { Imovel } from '../../imoveis/entities/imovel.entity'

@Entity('cartorios')
export class Cartorio {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 255 })
  nome!: string

  @Index({ unique: true })
  @Column({ length: 18 })
  cnpj!: string

  @Column({ length: 20, nullable: true })
  telefone!: string

  @Column({ length: 255, nullable: true })
  email!: string

  @Column({ length: 255, nullable: true })
  logradouro!: string

  @Column({ length: 10, nullable: true })
  numero!: string

  @Column({ length: 100, nullable: true })
  bairro!: string

  @Column({ length: 100 })
  cidade!: string

  @Column({ length: 2 })
  estado!: string

  @Column({ length: 9, nullable: true })
  cep!: string

  @Column({ nullable: true })
  responsavel_id!: number

  @Column({ length: 255, nullable: true })
  responsavel_nome!: string

  @Column({ length: 14, nullable: true })
  responsavel_cpf!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  @DeleteDateColumn()
  deleted_at!: Date | null

  @OneToMany(() => Usuario, (usuario) => usuario.cartorio)
  usuarios!: Usuario[]

  @OneToMany(() => Imovel, (imovel) => imovel.cartorio)
  imoveis!: Imovel[]
}
