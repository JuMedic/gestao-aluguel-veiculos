#!/bin/bash

echo "🚗 Iniciando Sistema de Gestão de Aluguel de Veículos"
echo "======================================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado!${NC}"
    echo "Por favor, instale Node.js 18+ de https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js encontrado: $(node --version)${NC}"
echo ""

# Configurar Backend
echo -e "${BLUE}📦 Configurando Backend...${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do backend..."
    npm install
else
    echo "Dependências do backend já instaladas"
fi

if [ ! -f "prisma/dev.db" ]; then
    echo "Criando banco de dados..."
    npx prisma generate
    npx prisma migrate dev --name init
else
    echo "Banco de dados já existe"
    npx prisma generate
fi

if [ ! -d "uploads" ]; then
    mkdir -p uploads
    echo "Pasta de uploads criada"
fi

cd ..

# Configurar Frontend
echo ""
echo -e "${BLUE}📦 Configurando Frontend...${NC}"
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do frontend..."
    npm install
else
    echo "Dependências do frontend já instaladas"
fi

cd ..

# Iniciar serviços
echo ""
echo -e "${GREEN}🚀 Iniciando serviços...${NC}"
echo ""
echo -e "${BLUE}Backend:${NC} http://localhost:3001"
echo -e "${BLUE}Frontend:${NC} http://localhost:3000"
echo ""
echo "Pressione Ctrl+C para parar os servidores"
echo ""

# Função para cleanup ao sair
cleanup() {
    echo ""
    echo "Parando servidores..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

trap cleanup INT TERM

# Iniciar backend em background
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Aguardar backend iniciar
sleep 3

# Iniciar frontend
cd frontend
npm run dev

# Se o frontend parar, parar o backend também
kill $BACKEND_PID 2>/dev/null
