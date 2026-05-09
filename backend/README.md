# Desafio Sião — API Backend

API REST desenvolvida com **NestJS**, **TypeORM** e **PostgreSQL**, containerizada com Docker.

---

## Pré-requisitos

| Ferramenta    | Versão mínima |
|---------------|---------------|
| Docker Desktop | 24+          |
| Docker Compose | v2 (incluso) |

> Se preferir rodar localmente sem Docker: Node.js 20+ e PostgreSQL 15+.

---

## Subindo o ambiente com Docker (recomendado)

### 1. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` se quiser alterar senhas ou porta. Os valores padrão já funcionam.

### 2. Suba os containers

```bash
docker-compose up --build
```

O que acontece:
- `postgres` sobe na porta **5432** com persistência via volume.
- `api` aguarda o postgres estar saudável, faz o build e sobe na porta **3000**.
- O TypeORM sincroniza o schema automaticamente em `development`.

### 3. Popule com dados iniciais (seed)

Em outro terminal, com os containers rodando:

```bash
docker-compose exec api node dist/database/seeds/seed.js
```

Isso cria:
- Usuário admin: `admin@siao.com` / `123456`
- Um cartório de demonstração

### 4. Acesse a documentação

| Recurso | URL |
|---------|-----|
| Swagger UI | http://localhost:3000/api/docs |
| Healthcheck | http://localhost:3000/api/auth/me (requer token) |

---

## Rodando localmente (sem Docker)

```bash
# 1. Instale as dependências
npm install

# 2. Configure o .env apontando para seu PostgreSQL local
#    DB_HOST=localhost

# 3. Inicie em modo desenvolvimento (hot reload)
npm run start:dev

# 4. Em outro terminal, rode o seed
npm run seed
```

---

## Endpoints da API

Todos os endpoints (exceto `POST /api/auth/login` e `POST /api/usuarios`) exigem o header:

```
Authorization: Bearer <token>
```

### Auth

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Autenticar (retorna JWT) |
| GET | `/api/auth/me` | Perfil do usuário logado |

### Cartórios

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/cartorios` | Listar (suporta `search`, `estado`, `page`, `per_page`) |
| POST | `/api/cartorios` | Criar |
| GET | `/api/cartorios/:id` | Buscar por ID |
| PATCH | `/api/cartorios/:id` | Atualizar parcialmente |
| DELETE | `/api/cartorios/:id` | Soft delete |

### Imóveis

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/imoveis` | Listar (suporta `search`, `tipo`, `status`, `estado`, `cartorio_id`) |
| POST | `/api/imoveis` | Criar |
| GET | `/api/imoveis/:id` | Buscar por ID |
| PATCH | `/api/imoveis/:id` | Atualizar parcialmente |
| DELETE | `/api/imoveis/:id` | Soft delete |

### Usuários

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/usuarios` | Cadastrar (pública) |
| GET | `/api/usuarios` | Listar (requer JWT) |
| GET | `/api/usuarios/:id` | Buscar por ID (requer JWT) |
| PATCH | `/api/usuarios/:id` | Atualizar (requer JWT) |
| DELETE | `/api/usuarios/:id` | Soft delete (requer JWT) |

---

## Testando com curl

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@siao.com","password":"123456"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Token: $TOKEN"

# 2. Listar cartórios
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/cartorios

# 3. Criar cartório
curl -X POST http://localhost:3000/api/cartorios \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "2º Cartório de BH",
    "cnpj": "98.765.432/0001-10",
    "cidade": "Belo Horizonte",
    "estado": "MG",
    "responsavel_nome": "Carlos Lima",
    "responsavel_cpf": "222.333.444-55"
  }'
```

---

## Estrutura do projeto

```
backend/
├── src/
│   ├── auth/               # JWT Strategy, Guard, Controller, Service
│   ├── cartorios/          # CRUD de Cartórios (entity, dto, service, controller)
│   ├── imoveis/            # CRUD de Imóveis
│   ├── usuarios/           # CRUD de Usuários (senha com bcrypt)
│   ├── common/
│   │   ├── filters/        # HttpExceptionFilter (erros padronizados)
│   │   ├── interceptors/   # TransformInterceptor (resposta { success, data })
│   │   └── decorators/     # @CurrentUser()
│   ├── database/
│   │   ├── database.module.ts
│   │   ├── data-source.ts  # Para migrations CLI
│   │   └── seeds/seed.ts
│   ├── app.module.ts
│   └── main.ts             # Bootstrap + Swagger
├── Dockerfile              # Multi-stage build
├── docker-compose.yml
├── .env.example
└── package.json
```

---

## Padrão de resposta

**Sucesso:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Erro:**
```json
{
  "success": false,
  "statusCode": 404,
  "timestamp": "2026-05-09T...",
  "path": "/api/cartorios/999",
  "message": "Cartório #999 não encontrado."
}
```

---

## Comandos úteis

```bash
# Ver logs dos containers
docker-compose logs -f api

# Parar os containers
docker-compose down

# Apagar volumes (reseta o banco)
docker-compose down -v

# Acessar o container da API
docker-compose exec api sh
```
