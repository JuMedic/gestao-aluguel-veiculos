@echo off
chcp 65001 >nul
cls

echo ========================================================
echo 🚗 Sistema de Gestão de Aluguel de Veículos
echo ========================================================
echo.

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js não encontrado!
    echo Por favor, instale Node.js 18+ de https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js encontrado
node --version
echo.

REM Configurar Backend
echo ========================================================
echo 📦 Configurando Backend...
echo ========================================================
cd backend

if not exist "node_modules\" (
    echo Instalando dependências do backend...
    call npm install
) else (
    echo Dependências do backend já instaladas
)

if not exist "prisma\dev.db" (
    echo Criando banco de dados...
    call npx prisma generate
    call npx prisma migrate dev --name init
) else (
    echo Banco de dados já existe
    call npx prisma generate
)

if not exist "uploads\" (
    mkdir uploads
    echo Pasta de uploads criada
)

cd ..

REM Configurar Frontend
echo.
echo ========================================================
echo 📦 Configurando Frontend...
echo ========================================================
cd frontend

if not exist "node_modules\" (
    echo Instalando dependências do frontend...
    call npm install
) else (
    echo Dependências do frontend já instaladas
)

cd ..

REM Iniciar serviços
echo.
echo ========================================================
echo 🚀 Iniciando serviços...
echo ========================================================
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Pressione Ctrl+C para parar os servidores
echo.

REM Iniciar backend em nova janela
start "Backend - Gestão Veículos" cmd /k "cd backend && npm run dev"

REM Aguardar backend iniciar
timeout /t 5 /nobreak >nul

REM Iniciar frontend
cd frontend
npm run dev

pause
