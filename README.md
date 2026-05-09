# Desafio Sião — Sistema de Gestão de Cartórios e Imóveis

Sistema fullstack para gestão de **cartórios**, **imóveis** e **usuários**, composto por:

- **Frontend**: Vue 3 + Vite + Tailwind CSS + Pinia
- **Backend**: NestJS + TypeORM + PostgreSQL
- **Autenticação**: JWT (Bearer Token)

---

## Sumário

1. [Pré-requisitos](#pré-requisitos)
2. [Estrutura do projeto](#estrutura-do-projeto)
3. [Opção A — Executar sem Docker (desenvolvimento local)](#opção-a--executar-sem-docker-desenvolvimento-local)
4. [Opção B — Executar com Docker Compose](#opção-b--executar-com-docker-compose)
5. [Populando o banco de dados (seed)](#populando-o-banco-de-dados-seed)
6. [Usando o entrypoint.sh](#usando-o-entrypointsh)
7. [Credenciais de acesso](#credenciais-de-acesso)
8. [Endpoints da API](#endpoints-da-api)
9. [Variáveis de ambiente](#variáveis-de-ambiente)

---

## Pré-requisitos

Certifique-se de ter instalado na sua máquina:

| Ferramenta | Versão mínima | Verificar |
|---|---|---|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| PostgreSQL | 14+ | `psql --version` |
| Docker (opcional) | 24+ | `docker -v` |
| Docker Compose (opcional) | 2+ | `docker compose version` |

> **Windows**: Recomenda-se usar o **Git Bash** ou **WSL2** para executar os scripts `.sh`.

---

## Estrutura do projeto

```
Desafio_sião/
├── backend/                  # API NestJS
│   ├── src/
│   │   ├── auth/             # Autenticação JWT
│   │   ├── cartorios/        # Módulo de cartórios
│   │   ├── imoveis/          # Módulo de imóveis
│   │   ├── usuarios/         # Módulo de usuários
│   │   ├── database/
│   │   │   └── seeds/
│   │   │       └── seed.ts   # Seed completo (cartorios + usuarios + imoveis)
│   │   └── main.ts
│   ├── .env                  # Variáveis de ambiente do backend
│   ├── entrypoint.sh         # Script para popular o banco e iniciar a API
│   ├── docker-compose.yml    # Compose: postgres + api
│   └── package.json
├── src/                      # Frontend Vue 3
│   ├── modules/
│   │   ├── auth/
│   │   ├── cartorios/
│   │   ├── imoveis/
│   │   └── usuarios/
│   └── stores/
├── vite.config.ts
└── package.json
```

---

## Opção A — Executar sem Docker (desenvolvimento local)

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd Desafio_sião
```

### 2. Configure o banco de dados PostgreSQL

Crie o banco e o usuário no PostgreSQL local:

```sql
-- Execute no psql ou em um client como DBeaver
CREATE USER siao_user WITH PASSWORD 'siao_pass';
CREATE DATABASE siao_db OWNER siao_user;
GRANT ALL PRIVILEGES ON DATABASE siao_db TO siao_user;
```

> Se o seu PostgreSQL estiver na porta padrão `5432`, ajuste `DB_PORT` no `.env`.

### 3. Configure as variáveis de ambiente do backend

```bash
cd backend
cp .env .env.local   # opcional: mantenha uma cópia de segurança
```

Abra `backend/.env` e ajuste se necessário:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432          # porta padrão do PostgreSQL local
DB_USERNAME=siao_user
DB_PASSWORD=siao_pass
DB_DATABASE=siao_db

JWT_SECRET=troque_este_valor_por_um_segredo_forte_de_pelo_menos_64_chars
JWT_EXPIRES_IN=7d
```

### 4. Instale as dependências do backend

```bash
# Dentro de backend/
npm install
```

### 5. Popule o banco de dados

```bash
# Dentro de backend/ — cria as tabelas e insere dados de exemplo
npm run seed
```

O seed irá criar:
- **3 cartórios** (SP, RJ, PR)
- **4 usuários** (1 admin + 3 usuários vinculados aos cartórios)
- **6 imóveis** (residenciais, comerciais, industriais e rurais)

### 6. Inicie o backend

```bash
# Dentro de backend/ — modo watch (recarrega ao salvar)
npm run start:dev
```

A API estará disponível em: **http://localhost:3000/api**
Documentação Swagger: **http://localhost:3000/api/docs**

### 7. Instale as dependências do frontend

Abra um **novo terminal** na raiz do projeto:

```bash
# Na raiz do projeto (onde está o package.json do Vue)
npm install
```

### 8. Inicie o frontend

```bash
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

> O Vite já está configurado com proxy para `/api → http://localhost:3000`, então não é necessário nenhuma configuração adicional de CORS.

---

## Opção B — Executar com Docker Compose

> Esta opção sobe o **PostgreSQL** e a **API** automaticamente em containers.

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd Desafio_sião
```

### 2. Configure o `.env` do backend

```bash
cd backend
```

Verifique (ou ajuste) o arquivo `backend/.env`:

```env
NODE_ENV=development
PORT=3000

DB_HOST=postgres        # nome do serviço no docker-compose
DB_PORT=5432
DB_USERNAME=siao_user
DB_PASSWORD=siao_pass
DB_DATABASE=siao_db

JWT_SECRET=troque_este_valor_por_um_segredo_forte
JWT_EXPIRES_IN=7d
```

> **Atenção**: `DB_HOST` deve ser `postgres` (nome do serviço) ao usar Docker Compose, não `localhost`.

### 3. Suba os containers

```bash
# Dentro de backend/
docker compose up --build -d
```

Aguarde até os containers estarem saudáveis:

```bash
docker compose ps          # STATUS deve ser "healthy" para o postgres
docker compose logs -f api # acompanhe os logs da API
```

### 4. Popule o banco de dados

Com os containers em execução, rode o seed dentro do container da API:

```bash
docker compose exec api npm run seed
```

### 5. Instale e inicie o frontend

Em um **novo terminal** na raiz do projeto:

```bash
cd ..         # volte para a raiz
npm install
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

### 6. Parar os containers

```bash
cd backend
docker compose down          # para e remove os containers (mantém os dados)
docker compose down -v       # para e remove containers + volume do banco (apaga os dados)
```

---

## Populando o banco de dados (seed)

O seed pode ser executado a qualquer momento para recriar os dados de exemplo:

```bash
# Dentro de backend/
npm run seed
```

**Dados inseridos:**

| Tabela | Registros |
|---|---|
| `cartorios` | 3 (SP · RJ · PR) |
| `usuarios` | 4 (admin + 3 usuários) |
| `imoveis` | 6 (residencial · comercial · industrial · rural) |

O seed é idempotente: registros que já existem são ignorados (verificado por e-mail, CNPJ e matrícula).

---

## Usando o entrypoint.sh

O arquivo `backend/entrypoint.sh` combina a espera pelo banco, o seed e a inicialização da API em um único script.

### No host (Linux / macOS / Git Bash / WSL2)

```bash
cd backend
chmod +x entrypoint.sh
./entrypoint.sh
```

O script irá:
1. Carregar as variáveis de `backend/.env`
2. Aguardar o PostgreSQL ficar disponível (até 30 tentativas × 2s = ~60s)
3. Executar `npm run seed` (popula todas as tabelas)
4. Iniciar a API com `node dist/main`

> **Obs.**: o script usa `nc` (netcat) para testar a conexão com o banco. No Ubuntu/Debian instale com `sudo apt install netcat-openbsd`; no Alpine já vem no `busybox`.

### Somente seed (sem iniciar a API)

```bash
START_API=false ./entrypoint.sh
```

### Como Docker ENTRYPOINT

Para usar o script como entrypoint Docker, atualize o `CMD` no `Dockerfile`:

```dockerfile
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh
ENTRYPOINT ["sh", "entrypoint.sh"]
```

---

## Credenciais de acesso

| Campo | Valor |
|---|---|
| E-mail | `admin@siao.com` |
| Senha | `123456` |

Outros usuários criados pelo seed (mesma senha `123456`):

| Nome | E-mail |
|---|---|
| João Silva | `joao.silva@siao.com` |
| Maria Fernanda | `maria.fernanda@siao.com` |
| Rafael Souza | `rafael.souza@siao.com` |

---

## Endpoints da API

A documentação interativa completa está disponível no Swagger:

**http://localhost:3000/api/docs**

### Resumo dos endpoints

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/api/auth/login` | Login — retorna JWT | Não |
| `GET` | `/api/auth/me` | Perfil do usuário logado | JWT |
| `GET` | `/api/cartorios` | Lista cartórios (paginado, filtros) | JWT |
| `POST` | `/api/cartorios` | Cria cartório | JWT |
| `GET` | `/api/cartorios/:id` | Detalhe do cartório | JWT |
| `PATCH` | `/api/cartorios/:id` | Atualiza cartório | JWT |
| `DELETE` | `/api/cartorios/:id` | Remove cartório (soft delete) | JWT |
| `GET` | `/api/imoveis` | Lista imóveis (paginado, filtros) | JWT |
| `POST` | `/api/imoveis` | Cria imóvel | JWT |
| `GET` | `/api/imoveis/:id` | Detalhe do imóvel | JWT |
| `PATCH` | `/api/imoveis/:id` | Atualiza imóvel | JWT |
| `DELETE` | `/api/imoveis/:id` | Remove imóvel (soft delete) | JWT |
| `GET` | `/api/usuarios` | Lista usuários (paginado, filtros) | JWT |
| `POST` | `/api/usuarios` | Cria usuário | JWT |
| `GET` | `/api/usuarios/:id` | Detalhe do usuário | JWT |
| `PATCH` | `/api/usuarios/:id` | Atualiza usuário | JWT |
| `DELETE` | `/api/usuarios/:id` | Remove usuário (soft delete) | JWT |

---

## Variáveis de ambiente

### Backend (`backend/.env`)

| Variável | Padrão | Descrição |
|---|---|---|
| `NODE_ENV` | `development` | Ambiente de execução |
| `PORT` | `3000` | Porta HTTP da API |
| `DB_HOST` | `localhost` | Host do PostgreSQL |
| `DB_PORT` | `5433` | Porta do PostgreSQL |
| `DB_USERNAME` | `siao_user` | Usuário do banco |
| `DB_PASSWORD` | `siao_pass` | Senha do banco |
| `DB_DATABASE` | `siao_db` | Nome do banco |
| `JWT_SECRET` | — | Segredo para assinar tokens JWT (obrigatório) |
| `JWT_EXPIRES_IN` | `7d` | Tempo de expiração do token |

> Gere um `JWT_SECRET` seguro com:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### Frontend

O frontend utiliza o proxy do Vite (`vite.config.ts`) para redirecionar `/api` ao backend. Nenhum `.env` adicional é necessário em desenvolvimento.

Para builds de produção, configure a variável `VITE_API_URL` se o backend estiver em outro host:

```env
VITE_API_URL=https://api.meudominio.com
```

---

## Scripts disponíveis

### Backend (`cd backend`)

| Comando | Descrição |
|---|---|
| `npm run start:dev` | Inicia em modo desenvolvimento (watch) |
| `npm run build` | Compila o TypeScript para `dist/` |
| `npm run start` | Inicia a versão compilada |
| `npm run seed` | Popula o banco com dados de exemplo |
| `npm run migration:run` | Executa as migrations pendentes |
| `npm run migration:revert` | Reverte a última migration |

### Frontend (raiz do projeto)

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
