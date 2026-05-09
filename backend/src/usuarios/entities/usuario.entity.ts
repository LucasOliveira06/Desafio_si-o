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

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 255 })
  nome!: string

  @Index({ unique: true })
  @Column({ length: 14 })
  cpf!: string

  @Index({ unique: true })
  @Column({ length: 255 })
  email!: string

  @Column({ select: false })
  password!: string

  @Column({ length: 20, nullable: true })
  telefone!: string

  @Column({ length: 255, nullable: true })
  endereco!: string

  @Column({ length: 100, nullable: true })
  cidade!: string

  @Column({ length: 2, nullable: true })
  estado!: string

  @Column({ length: 9, nullable: true })
  cep!: string

  @Column({ nullable: true })
  cartorio_id!: number | null

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  @DeleteDateColumn()
  deleted_at!: Date | null

  @ManyToOne(() => Cartorio, (cartorio) => cartorio.usuarios, { nullable: true })
  @JoinColumn({ name: 'cartorio_id' })
  cartorio!: Cartorio | null
}
