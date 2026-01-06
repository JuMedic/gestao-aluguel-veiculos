# Gestão de Aluguel de Veículos

Sistema completo de gestão de aluguel de veículos desenvolvido com React, TypeScript, Node.js, Express e Prisma.

## 🚀 Funcionalidades

### 1. Sistema de Notificações de Vencimento
- Alertas na dashboard sobre vencimentos de pagamentos
- Notificações visuais
- Lista de pagamentos próximos do vencimento

### 2. Controle de Pagamentos
- Campo para dar baixa em pagamentos (Pago Total ou Pago Parcial)
- Histórico de pagamentos por veículo/cliente
- Filtros por status (pendente, pago, atrasado)

### 3. Cobrança Automática com Multa e Juros
- Cálculo automático de multa (2%)
- Cálculo automático de juros (0,033% ao dia)
- Exibição do valor atualizado com detalhamento

### 4. Custos de Manutenção
- Registro de custos de manutenção de cada veículo
- Histórico de manutenções por veículo
- Categorias de manutenção (preventiva, corretiva)
- Relatório de gastos por veículo

### 5. Histórico de Disponibilidade
- Registrar quando o veículo foi alugado
- Registrar quando o veículo ficou parado/disponível
- Dashboard com status da frota

### 6. Geração de Contratos
- Formulário com entrada de dados do cliente e do aluguel
- Geração automática de contrato em PDF
- Download e impressão do contrato

### 7. Fotos do Veículo para Vistoria
- Upload de fotos do veículo
- Organização por vistoria
- Galeria de imagens por veículo

## 🛠️ Tecnologias Utilizadas

### Frontend
- React.js 18
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React (ícones)
- Vite

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite
- JWT (autenticação)
- jsPDF (geração de PDFs)
- Multer (upload de arquivos)

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/JuMedic/gestao-aluguel-veiculos.git
cd gestao-aluguel-veiculos
```

### 2. Instalar dependências do Backend

```bash
cd backend
npm install
```

### 3. Configurar o banco de dados

```bash
# Gerar o Prisma Client
npx prisma generate

# Criar o banco de dados e executar migrations
npx prisma migrate dev --name init

# (Opcional) Abrir Prisma Studio para visualizar o banco
npx prisma studio
```

### 4. Criar pasta de uploads

```bash
mkdir uploads
```

### 5. Configurar variáveis de ambiente (opcional)

Crie um arquivo `.env` na pasta backend:

```env
PORT=3001
JWT_SECRET=sua-chave-secreta-aqui
```

### 6. Instalar dependências do Frontend

```bash
cd ../frontend
npm install
```

## 🚀 Como Executar

### Backend

```bash
cd backend
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

### Frontend

Em outro terminal:

```bash
cd frontend
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

## 📱 Uso do Sistema

1. **Dashboard**: Visualize estatísticas gerais, pagamentos próximos do vencimento e aluguéis ativos
2. **Veículos**: Cadastre e gerencie sua frota de veículos
3. **Clientes**: Cadastre e gerencie seus clientes
4. **Aluguéis**: Crie novos contratos de aluguel
5. **Pagamentos**: Controle pagamentos, processe baixas e visualize valores atualizados com multa e juros
6. **Manutenção**: Registre manutenções e acompanhe custos
7. **Vistorias**: Faça upload de fotos e registre vistorias
8. **Contratos**: Gere contratos em PDF para impressão

## 🗄️ Estrutura do Banco de Dados

O sistema utiliza as seguintes tabelas:

- **Vehicle**: Informações dos veículos (placa, modelo, marca, ano, cor, status)
- **Client**: Dados dos clientes (nome, CPF, telefone, email, endereço)
- **Rental**: Contratos de aluguel (datas, valores, status)
- **Payment**: Pagamentos e cobranças (valores, vencimentos, multas, juros)
- **Maintenance**: Manutenções dos veículos (tipo, categoria, custo)
- **Inspection**: Vistorias com fotos

## 📝 Scripts Disponíveis

### Backend

- `npm run dev` - Inicia o servidor em modo de desenvolvimento
- `npm run build` - Compila o TypeScript
- `npm start` - Inicia o servidor em produção
- `npm run prisma:generate` - Gera o Prisma Client
- `npm run prisma:migrate` - Executa migrations
- `npm run prisma:studio` - Abre o Prisma Studio

### Frontend

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção

## 🎨 Interface

O sistema possui uma interface moderna e responsiva com:
- Menu lateral com navegação
- Dashboard com cards informativos
- Tabelas interativas
- Modais para formulários
- Sistema de cores para status (disponível, alugado, pago, atrasado, etc.)

## 💡 Cálculo de Multa e Juros

O sistema calcula automaticamente:
- **Multa**: 2% do valor original
- **Juros**: 0,033% ao dia sobre o valor original
- **Total**: Valor original + multa + juros acumulados

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Sistema desenvolvido para gestão pessoal de aluguel de veículos.