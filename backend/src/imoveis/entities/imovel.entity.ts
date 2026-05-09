import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { Cartorio } from '../../cartorios/entities/cartorio.entity'
import { Usuario } from '../../usuarios/entities/usuario.entity'

export type ImovelTipo = 'residencial' | 'comercial' | 'rural' | 'industrial' | 'outro'
export type ImovelStatus = 'ativo' | 'inativo' | 'pendente'

@Entity('imoveis')
export class Imovel {
  @PrimaryGeneratedColumn()
  id!: number

  @Index({ unique: true })
  @Column({ length: 50 })
  matricula!: string

  @Column({
    type: 'enum',
    enum: ['residencial', 'comercial', 'rural', 'industrial', 'outro'],
    default: 'residencial',
  })
  tipo!: ImovelTipo

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

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  area_total!: number

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  valor_avaliado!: number

  @Column({
    type: 'enum',
    enum: ['ativo', 'inativo', 'pendente'],
    default: 'ativo',
  })
  status!: ImovelStatus

  @Column()
  proprietario_id!: number

  @Column({ length: 255 })
  proprietario_nome!: string

  @Column({ length: 18 })
  proprietario_cpf!: string

  @Column()
  cartorio_id!: number

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  @DeleteDateColumn()
  deleted_at!: Date | null

  @ManyToOne(() => Cartorio, (cartorio) => cartorio.imoveis)
  @JoinColumn({ name: 'cartorio_id' })
  cartorio!: Cartorio

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'proprietario_id' })
  proprietario!: Usuario
}
