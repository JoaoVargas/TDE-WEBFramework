# !Order - Cardapio Web Framework

Aplicacao front-end de cardapio e pedidos, desenvolvida com React + TypeScript.
O projeto simula uma franquia com multiplas unidades, exibindo restaurantes,
pratos por unidade, detalhes do prato e carrinho com persistencia local.

## Como executar

### Requisitos

- Node.js 20+
- npm 10+

### Instalacao

```bash
npm install
```

### Ambiente de desenvolvimento

```bash
npm run dev
```

Aplicacao disponivel em `http://localhost:5173`.

### Build de producao

```bash
npm run build
```

### Preview do build

```bash
npm run preview
```

## Scripts

- `npm run dev`: inicia servidor de desenvolvimento Vite.
- `npm run build`: roda checagem TypeScript (`tsc -b`) e gera build de producao.
- `npm run preview`: sobe servidor local para validar o build.
- `npm run lint`: executa lint em todo o projeto.
- `npm run lint:fix`: corrige problemas de lint automaticamente quando possivel.
- `npm run format`: formata arquivos com Prettier.
- `npm run format:check`: valida formatacao sem alterar arquivos.

## Estrutura do projeto

```text
src/
	components/   # componentes visuais e compostos de UI
	contexts/     # estado global (carrinho, localizacao, restaurantes, alerta)
	routes/       # paginas ligadas ao React Router
	services/     # acesso aos dados mock e regras de servicos
	types/        # contratos TypeScript
	utils/        # utilitarios (ex.: calculo de distancia)
```

## Arquitetura (resumo)

### Providers principais

Em `src/main.tsx`, a arvore de providers segue esta ordem:

1. `QueryClientProvider`
2. `AlertContextProvider`
3. `CartContextProvider`
4. `RestaurantContextProvider`
5. `LocationContextProvider`
6. `BrowserRouter`

### Roteamento

Rotas registradas:

- `/`: Home
- `/cart`: Carrinho
- `/restaurant/:id`: Restaurante
- `/dish/:restaurant_id/:id`: Prato
- `/restaurant-not-found`: Restaurante nao encontrado
- `/dish-not-found`: Prato nao encontrado
- `*`: redireciona para `/`

### Estado e dados

- Restaurantes e pratos usam TanStack Query.
- Localizacao usa geolocalizacao do navegador, com fallback seguro.
- Distancia e "unidade mais proxima" sao calculadas no cliente.
- Carrinho persiste no `localStorage` com chave `cardapio-cart-v2`.

## Fonte dos dados

Atualmente o projeto usa dados mock locais:

- `src/services/restaurant.ts`
- `src/services/dish.ts`
- `src/services/locationService.ts`

As requisicoes passam por `src/services/mockApi.ts`, que simula latencia,
suporte a `AbortSignal` e logs de debug em ambiente de desenvolvimento.

## Qualidade de codigo

Antes de abrir PR, recomenda-se executar:

```bash
npm run lint
npm run format:check
```

Para autocorrecao:

```bash
npm run lint:fix
npm run format
```
