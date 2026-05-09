/**
 * Seed completo: popula cartorios, usuarios e imoveis com dados de exemplo.
 * Execute com: npm run seed
 */
import 'reflect-metadata'
import { config } from 'dotenv'
import { DataSource } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { Cartorio } from '../../cartorios/entities/cartorio.entity'
import { Usuario } from '../../usuarios/entities/usuario.entity'
import { Imovel } from '../../imoveis/entities/imovel.entity'

config()

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'siao_user',
  password: process.env.DB_PASSWORD ?? 'siao_pass',
  database: process.env.DB_DATABASE ?? 'siao_db',
  entities: [Cartorio, Usuario, Imovel],
  synchronize: true,
})

async function seed() {
  await dataSource.initialize()
  console.log('📦 Banco de dados conectado.')

  const cartorioRepo = dataSource.getRepository(Cartorio)
  const usuarioRepo = dataSource.getRepository(Usuario)
  const imovelRepo = dataSource.getRepository(Imovel)

  // ── Cartórios ────────────────────────────────────────────────────────────
  console.log('\n📌 Populando cartórios...')

  const cartoriosData = [
    {
      nome: '1º Cartório de Registro de Imóveis de SP',
      cnpj: '12.345.678/0001-90',
      telefone: '(11) 3333-1111',
      email: '1cartorio.sp@example.com',
      logradouro: 'Rua das Flores',
      numero: '100',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310-100',
      responsavel_nome: 'Ana Paula Ferreira',
      responsavel_cpf: '111.222.333-44',
    },
    {
      nome: '2º Cartório de Notas do Rio de Janeiro',
      cnpj: '98.765.432/0001-10',
      telefone: '(21) 4444-2222',
      email: '2cartorio.rj@example.com',
      logradouro: 'Av. Rio Branco',
      numero: '250',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '20040-020',
      responsavel_nome: 'Carlos Eduardo Lima',
      responsavel_cpf: '222.333.444-55',
    },
    {
      nome: 'Cartório de Registro de Imóveis de Curitiba',
      cnpj: '55.444.333/0001-22',
      telefone: '(41) 5555-3333',
      email: 'cartorio.cwb@example.com',
      logradouro: 'Rua XV de Novembro',
      numero: '1000',
      bairro: 'Centro',
      cidade: 'Curitiba',
      estado: 'PR',
      cep: '80020-310',
      responsavel_nome: 'Fernanda Oliveira Costa',
      responsavel_cpf: '333.444.555-66',
    },
  ]

  const savedCartorios: Cartorio[] = []
  for (const data of cartoriosData) {
    const existing = await cartorioRepo.findOne({ where: { cnpj: data.cnpj } })
    if (!existing) {
      const cartorio = cartorioRepo.create(data)
      const saved = await cartorioRepo.save(cartorio)
      savedCartorios.push(saved)
      console.log(`  ✅ Cartório criado: ${data.nome}`)
    } else {
      savedCartorios.push(existing)
      console.log(`  ℹ️  Cartório já existe: ${data.nome}`)
    }
  }

  // ── Usuários ─────────────────────────────────────────────────────────────
  console.log('\n👥 Populando usuários...')

  const usuariosData = [
    {
      nome: 'Administrador Sião',
      email: 'admin@siao.com',
      cpf: '000.000.000-00',
      password: '123456',
      telefone: '(11) 99999-0000',
      cidade: 'São Paulo',
      estado: 'SP',
      cartorio_id: null as number | null,
    },
    {
      nome: 'João Silva',
      email: 'joao.silva@siao.com',
      cpf: '123.456.789-09',
      password: '123456',
      telefone: '(11) 91111-2222',
      endereco: 'Rua das Acácias, 45',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310-200',
      cartorio_id: null as number | null,
    },
    {
      nome: 'Maria Fernanda',
      email: 'maria.fernanda@siao.com',
      cpf: '987.654.321-00',
      password: '123456',
      telefone: '(21) 92222-3333',
      endereco: 'Av. Copacabana, 800',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '22060-000',
      cartorio_id: null as number | null,
    },
    {
      nome: 'Rafael Souza',
      email: 'rafael.souza@siao.com',
      cpf: '456.789.123-55',
      password: '123456',
      telefone: '(41) 93333-4444',
      endereco: 'Rua XV de Novembro, 500',
      cidade: 'Curitiba',
      estado: 'PR',
      cep: '80020-100',
      cartorio_id: null as number | null,
    },
  ]

  if (savedCartorios.length > 0) {
    usuariosData[1].cartorio_id = savedCartorios[0].id
    usuariosData[2].cartorio_id = savedCartorios[1]?.id ?? null
    usuariosData[3].cartorio_id = savedCartorios[2]?.id ?? null
  }

  const savedUsuarios: Usuario[] = []
  for (const data of usuariosData) {
    const existing = await usuarioRepo.findOne({ where: { email: data.email } })
    if (!existing) {
      const hash = await bcrypt.hash(data.password, 12)
      const usuario = usuarioRepo.create({ ...data, password: hash })
      const saved = await usuarioRepo.save(usuario)
      savedUsuarios.push(saved)
      console.log(`  ✅ Usuário criado: ${data.email}`)
    } else {
      savedUsuarios.push(existing)
      console.log(`  ℹ️  Usuário já existe: ${data.email}`)
    }
  }

  // ── Imóveis ──────────────────────────────────────────────────────────────
  console.log('\n🏠 Populando imóveis...')

  const cartorio1Id = savedCartorios[0]?.id
  const cartorio2Id = savedCartorios[1]?.id ?? savedCartorios[0]?.id
  const cartorio3Id = savedCartorios[2]?.id ?? savedCartorios[0]?.id

  const prop1 = savedUsuarios.find((u) => u.email === 'joao.silva@siao.com')
  const prop2 = savedUsuarios.find((u) => u.email === 'maria.fernanda@siao.com')
  const prop3 = savedUsuarios.find((u) => u.email === 'rafael.souza@siao.com')

  if (!cartorio1Id) {
    console.log('  ⚠️  Sem cartório disponível para vincular imóveis. Pulando...')
  } else {
    const imoveisData = [
      {
        matricula: 'MAT-001-SP-2024',
        tipo: 'residencial' as const,
        logradouro: 'Rua das Rosas',
        numero: '12',
        bairro: 'Jardim América',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01428-000',
        area_total: 180.5,
        valor_avaliado: 850000.0,
        status: 'ativo' as const,
        cartorio_id: cartorio1Id,
        proprietario_id: prop1?.id ?? 1,
        proprietario_nome: prop1?.nome ?? 'João Silva',
        proprietario_cpf: prop1?.cpf ?? '123.456.789-09',
      },
      {
        matricula: 'MAT-002-SP-2024',
        tipo: 'comercial' as const,
        logradouro: 'Av. Paulista',
        numero: '1578',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-200',
        area_total: 420.0,
        valor_avaliado: 3200000.0,
        status: 'ativo' as const,
        cartorio_id: cartorio1Id,
        proprietario_id: prop1?.id ?? 1,
        proprietario_nome: prop1?.nome ?? 'João Silva',
        proprietario_cpf: prop1?.cpf ?? '123.456.789-09',
      },
      {
        matricula: 'MAT-003-RJ-2024',
        tipo: 'residencial' as const,
        logradouro: 'Rua Barata Ribeiro',
        numero: '320',
        bairro: 'Copacabana',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '22040-000',
        area_total: 95.0,
        valor_avaliado: 1100000.0,
        status: 'ativo' as const,
        cartorio_id: cartorio2Id,
        proprietario_id: prop2?.id ?? 1,
        proprietario_nome: prop2?.nome ?? 'Maria Fernanda',
        proprietario_cpf: prop2?.cpf ?? '987.654.321-00',
      },
      {
        matricula: 'MAT-004-RJ-2024',
        tipo: 'industrial' as const,
        logradouro: 'Estrada do Engenho',
        numero: '5000',
        bairro: 'Santa Cruz',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '23555-000',
        area_total: 12000.0,
        valor_avaliado: 9500000.0,
        status: 'pendente' as const,
        cartorio_id: cartorio2Id,
        proprietario_id: prop2?.id ?? 1,
        proprietario_nome: prop2?.nome ?? 'Maria Fernanda',
        proprietario_cpf: prop2?.cpf ?? '987.654.321-00',
      },
      {
        matricula: 'MAT-005-PR-2024',
        tipo: 'rural' as const,
        logradouro: 'Rodovia BR-116',
        numero: 'KM 120',
        bairro: 'Zona Rural',
        cidade: 'Curitiba',
        estado: 'PR',
        cep: '80000-000',
        area_total: 50000.0,
        valor_avaliado: 2800000.0,
        status: 'ativo' as const,
        cartorio_id: cartorio3Id,
        proprietario_id: prop3?.id ?? 1,
        proprietario_nome: prop3?.nome ?? 'Rafael Souza',
        proprietario_cpf: prop3?.cpf ?? '456.789.123-55',
      },
      {
        matricula: 'MAT-006-PR-2024',
        tipo: 'residencial' as const,
        logradouro: 'Rua Sete de Setembro',
        numero: '234',
        bairro: 'Centro',
        cidade: 'Curitiba',
        estado: 'PR',
        cep: '80010-190',
        area_total: 210.0,
        valor_avaliado: 750000.0,
        status: 'inativo' as const,
        cartorio_id: cartorio3Id,
        proprietario_id: prop3?.id ?? 1,
        proprietario_nome: prop3?.nome ?? 'Rafael Souza',
        proprietario_cpf: prop3?.cpf ?? '456.789.123-55',
      },
    ]

    for (const data of imoveisData) {
      const existing = await imovelRepo.findOne({ where: { matricula: data.matricula } })
      if (!existing) {
        const imovel = imovelRepo.create(data)
        await imovelRepo.save(imovel)
        console.log(`  ✅ Imóvel criado: ${data.matricula} (${data.tipo}) — ${data.cidade}/${data.estado}`)
      } else {
        console.log(`  ℹ️  Imóvel já existe: ${data.matricula}`)
      }
    }
  }

  await dataSource.destroy()

  console.log('\n─────────────────────────────────────────────')
  console.log('🎉 Seed concluído com sucesso!')
  console.log('─────────────────────────────────────────────')
  console.log('   Credenciais de acesso:')
  console.log('   E-mail : admin@siao.com')
  console.log('   Senha  : 123456')
  console.log('─────────────────────────────────────────────\n')
}

seed().catch((err) => {
  console.error('❌ Erro no seed:', err)
  process.exit(1)
})
