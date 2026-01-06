# Guia de Configuração Rápida

## Sistema de Gestão de Aluguel de Veículos

Este guia fornece instruções detalhadas para configurar e executar o sistema.

## 📁 Arquivos Criados

### Backend (14 arquivos TypeScript)
- **Controllers**: 6 arquivos (vehicle, client, rental, payment, maintenance, inspection)
- **Services**: 2 arquivos (payment, PDF)
- **Routes**: 1 arquivo (index)
- **Middlewares**: 1 arquivo (auth)
- **Utils**: 1 arquivo (calculations)
- **Main**: 1 arquivo (index)
- **Config**: Prisma schema, package.json, tsconfig.json

### Frontend (24 arquivos TypeScript/TSX)
- **Pages**: 8 arquivos (Dashboard, Vehicles, Clients, Rentals, Payments, Maintenance, Inspections, Contracts)
- **Components**: 7 arquivos (Layout, Sidebar, Header, Card, Table, Modal, Form)
- **Services**: 1 arquivo (API)
- **Utils**: 2 arquivos (formatters, calculations)
- **Types**: 1 arquivo (index)
- **Main**: App, main, index.css
- **Config**: package.json, tsconfig.json, vite.config, tailwind.config

**Total**: ~3,650 linhas de código TypeScript

## 🚀 Instalação Rápida

### Passo 1: Instalar Dependências Backend

```bash
cd backend
npm install
```

### Passo 2: Configurar Banco de Dados

```bash
# Gerar Prisma Client
npx prisma generate

# Criar banco de dados
npx prisma migrate dev --name init
```

### Passo 3: Criar Pasta de Uploads

```bash
mkdir -p uploads
```

### Passo 4: Instalar Dependências Frontend

```bash
cd ../frontend
npm install
```

## ▶️ Executar o Sistema

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Servidor rodando em: http://localhost:3001

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Aplicação disponível em: http://localhost:3000

## 📊 Estrutura do Banco de Dados

O sistema cria 6 tabelas automaticamente:

1. **Vehicle** - Veículos da frota
2. **Client** - Clientes
3. **Rental** - Contratos de aluguel
4. **Payment** - Pagamentos e cobranças
5. **Maintenance** - Manutenções
6. **Inspection** - Vistorias com fotos

## 🎯 Funcionalidades Principais

### 1. Dashboard
- Estatísticas em tempo real
- Notificações de vencimento
- Visão geral da frota

### 2. Veículos
- Cadastro de veículos
- Status (disponível, alugado, manutenção)
- Histórico completo

### 3. Clientes
- Cadastro de clientes
- CPF, telefone, endereço
- Histórico de aluguéis

### 4. Aluguéis
- Criar novos contratos
- Calcular valor automaticamente
- Acompanhar status

### 5. Pagamentos
- Processar pagamentos (total/parcial)
- Cálculo automático de multa (2%)
- Cálculo automático de juros (0,033% ao dia)
- Visualizar valor atualizado

### 6. Manutenção
- Registrar custos
- Categorias (preventiva, corretiva)
- Relatórios de gastos

### 7. Vistorias
- Upload de fotos
- Registro por tipo (entrada, saída, mensal)
- Histórico organizado

### 8. Contratos
- Geração de PDF
- Download automático
- Dados completos do contrato

## 🔧 Comandos Úteis

### Backend
```bash
npm run dev        # Modo desenvolvimento
npm run build      # Compilar TypeScript
npm start          # Modo produção
npx prisma studio  # Visualizar banco de dados
```

### Frontend
```bash
npm run dev        # Modo desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview do build
```

## 🌐 Endpoints da API

### Veículos
- GET /api/vehicles - Listar todos
- GET /api/vehicles/:id - Buscar por ID
- POST /api/vehicles - Criar
- PUT /api/vehicles/:id - Atualizar
- DELETE /api/vehicles/:id - Excluir

### Clientes
- GET /api/clients - Listar todos
- GET /api/clients/:id - Buscar por ID
- POST /api/clients - Criar
- PUT /api/clients/:id - Atualizar
- DELETE /api/clients/:id - Excluir

### Aluguéis
- GET /api/rentals - Listar todos
- GET /api/rentals/active - Listar ativos
- POST /api/rentals - Criar
- PUT /api/rentals/:id - Atualizar
- DELETE /api/rentals/:id - Excluir

### Pagamentos
- GET /api/payments - Listar todos
- GET /api/payments/proximos-vencimento - Próximos vencimentos
- POST /api/payments/:id/processar - Processar pagamento
- POST /api/payments/atualizar-atrasados - Atualizar multas/juros

### Manutenção
- GET /api/maintenances - Listar todos
- GET /api/maintenances/vehicle/:id - Por veículo
- GET /api/maintenances/vehicle/:id/resumo - Resumo de gastos
- POST /api/maintenances - Criar

### Vistorias
- GET /api/inspections - Listar todos
- GET /api/inspections/vehicle/:id - Por veículo
- POST /api/inspections - Criar
- POST /api/inspections/upload - Upload de foto

### Contratos
- POST /api/contracts/generate - Gerar PDF

## 🔐 Segurança

- Database transactions para consistência
- Sanitização de nomes de arquivo
- Validação de tipos de arquivo
- JWT para autenticação (futuro)

## 💡 Dicas

1. Use Prisma Studio para visualizar os dados: `npx prisma studio`
2. O banco SQLite fica em `backend/prisma/dev.db`
3. As fotos de vistoria ficam em `backend/uploads/`
4. Todos os valores monetários usam formato PT-BR (R$)
5. Todas as datas usam formato DD/MM/YYYY

## 🐛 Solução de Problemas

### Erro: "Cannot find module"
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Erro: Prisma Client não encontrado
```bash
cd backend
npx prisma generate
```

### Porta já em uso
Altere a porta no arquivo `.env` (backend) ou `vite.config.ts` (frontend)

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- README.md para informações gerais
- Documentação do Prisma: https://www.prisma.io/docs
- Documentação do React: https://react.dev
