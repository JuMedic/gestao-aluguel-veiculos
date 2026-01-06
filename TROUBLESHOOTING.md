# 🔧 Solução de Problemas

## A página não carrega / Frontend não inicia

### Problema 1: Erro "Cannot find module" ou dependências faltando

**Solução:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Problema 2: Erro de Prisma Client

**Solução:**
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### Problema 3: Porta já em uso

**Backend (porta 3001):**
```bash
# Linux/Mac
lsof -ti:3001 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process
```

**Frontend (porta 3000):**
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Problema 4: Erro de compilação TypeScript no Frontend

**Solução:**
```bash
cd frontend
npm install --save-dev @eslint/js globals typescript-eslint
npm run build
```

### Problema 5: Erro "ENOENT: no such file or directory, scandir 'uploads'"

**Solução:**
```bash
cd backend
mkdir -p uploads
```

### Problema 6: Banco de dados travado/corrompido

**Solução:**
```bash
cd backend
rm -f prisma/dev.db prisma/dev.db-journal
npx prisma migrate dev --name init
```

## Backend não inicia

### Verificar Node.js
```bash
node --version  # Deve ser 18+
npm --version
```

### Reinstalar dependências
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Verificar arquivo .env
Certifique-se que existe o arquivo `backend/.env`:
```
PORT=3001
JWT_SECRET=sua-chave-secreta
```

## Frontend mostra tela branca

### Verificar console do navegador
1. Abra as DevTools (F12)
2. Vá para a aba Console
3. Veja se há erros

### Erros comuns:
- **"Failed to fetch"**: Backend não está rodando
- **"Network Error"**: Verificar se backend está em http://localhost:3001
- **"Module not found"**: Reinstalar dependências do frontend

## API não responde

### Verificar se backend está rodando
```bash
curl http://localhost:3001/health
```

Deve retornar:
```json
{"status":"ok","message":"API de Gestão de Aluguel de Veículos"}
```

### Verificar logs do backend
No terminal onde o backend está rodando, veja se há erros.

## Erro ao fazer upload de fotos

### Verificar pasta uploads
```bash
ls -la backend/uploads
```

Se não existir:
```bash
mkdir -p backend/uploads
chmod 755 backend/uploads
```

## Erro ao gerar PDF

### Verificar se jsPDF está instalado
```bash
cd backend
npm list jspdf
```

Se não estiver instalado:
```bash
npm install jspdf
```

## Versão do Node.js incorreta

**Recomendação:** Use Node.js 18 LTS ou superior

### Verificar versão
```bash
node --version
```

### Atualizar Node.js
- Download: https://nodejs.org/
- Ou use nvm (Node Version Manager)

## Cache do navegador

Se as mudanças não aparecem:
1. Limpe o cache (Ctrl+Shift+Delete)
2. Ou abra em aba anônima (Ctrl+Shift+N)
3. Ou force reload (Ctrl+F5)

## Ainda com problemas?

1. Verifique se todas as portas estão livres (3000 e 3001)
2. Reinstale todas as dependências
3. Delete banco de dados e recrie
4. Verifique logs de erro no console

### Reinstalação completa
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json prisma/dev.db
npm install
npx prisma generate
npx prisma migrate dev --name init

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Iniciar novamente
./start.sh  # ou start.bat no Windows
```

## Logs úteis

### Backend
Verifique o terminal onde rodou `npm run dev` no backend

### Frontend
Verifique:
- Terminal onde rodou `npm run dev` no frontend
- Console do navegador (F12 → Console)
- Network tab (F12 → Network) para ver requisições falhando

## Permissões no Linux/Mac

Se tiver erros de permissão:
```bash
chmod +x start.sh
chmod -R 755 backend/uploads
```

## Firewall/Antivírus

Alguns antivírus bloqueiam Node.js. Adicione exceção para:
- Node.js
- Portas 3000 e 3001
