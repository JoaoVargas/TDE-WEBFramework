# Framework Order

Aplicação web de cardápio/pedidos com listagem de restaurantes, pratos e carrinho de compras.

## Arquitetura

```
TDE-WEBFramework/
├── frontend/       # React 19 + Vite + TypeScript
├── backend/        # Express + TypeScript + MySQL2
└── docker/         # Docker Compose + variáveis de ambiente
```

### Frontend

- **React 19** com React Router DOM para navegação
- **TanStack Query** para gerenciamento de estado e cache de requisições
- **Axios** para comunicação com a API
- **i18next** para internacionalização
- Contexts para: autenticação, carrinho, geolocalização, restaurantes e alertas
- Proxy do Vite redireciona `/api` para o backend

### Backend

- **Express** com TypeScript
- **MySQL2** com pool de conexões
- Migrações automáticas via SQL (`schema.sql`) executadas no startup
- Autenticação via **JWT** + senhas com **bcrypt**
- Rotas: `/api/auth`, `/api/restaurants`, `/api/categories`, `/api/dishes`

### Banco de dados

MySQL 8.4 com o seguinte schema:

```
addresses
categories
restaurants       → FK addresses
dishes            → FK categories
restaurant_dishes → FK restaurants, dishes
restaurant_categories → FK restaurants, categories
users
```

---

## Como rodar

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e Docker Compose

### 1. Configurar variáveis de ambiente

Copie o arquivo de exemplo e ajuste se necessário (os valores padrão já funcionam):

```bash
cp docker/.env.example docker/.env
```

> O repositório já inclui um `docker/.env` com valores padrão prontos para desenvolvimento.

### 2. Subir os containers

```bash
cd docker
docker compose up
```

Isso sobe três serviços:

| Serviço    | Porta local | Descrição              |
|------------|-------------|------------------------|
| `db`       | `3000`      | MySQL 8.4              |
| `backend`  | `3001`      | API Express            |
| `frontend` | `3002`      | App React (Vite dev)   |

O backend aguarda o banco estar saudável antes de iniciar. O schema é criado automaticamente no primeiro start.

### 3. Acessar a aplicação

Abra [http://localhost:3002](http://localhost:3002) no navegador.

---

## Seedar os dados

Para popular o banco com restaurantes e um usuário de teste:

```bash
docker exec framework-order-backend npm run seed
```

Após o seed, o usuário criado é:

| Campo  | Valor              |
|--------|--------------------|
| Email  | `email@example.com` |
| Senha  | `senha123`         |

---

## Desenvolvimento local (sem Docker)

Se preferir rodar backend e frontend direto na máquina:

### Backend

```bash
cd backend
npm install
npm run dev
```

> Necessita de um MySQL acessível. Configure as variáveis `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` no ambiente ou em um `.env` na raiz do `backend/`.

### Frontend

```bash
cd frontend
yarn
yarn dev
```

> Por padrão o proxy aponta para `http://localhost:3001`. Ajuste `API_TARGET` se o backend estiver em outra porta.

---

## Scripts úteis

### Backend (`backend/`)

| Comando          | Descrição                          |
|------------------|------------------------------------|
| `npm run dev`    | Inicia em modo watch (tsx)         |
| `npm run build`  | Compila para `dist/`               |
| `npm run start`  | Executa o build compilado          |
| `npm run seed`   | Popula o banco com dados iniciais  |
| `npm run lint`   | Verifica o código com ESLint       |
| `npm run format` | Formata com Prettier               |

### Frontend (`frontend/`)

| Comando         | Descrição                     |
|-----------------|-------------------------------|
| `yarn dev`      | Inicia servidor de dev (Vite) |
| `yarn build`    | Gera build de produção        |
| `yarn preview`  | Serve o build localmente      |
| `yarn lint`     | Verifica o código com ESLint  |
| `yarn format`   | Formata com Prettier          |
