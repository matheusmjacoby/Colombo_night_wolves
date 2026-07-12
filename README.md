# 🐺 Colombo Night Wolves - Sistema de Gerenciamento de Time

**Status**: ✅ Pronto para Deploy  
**Stack**: HTML5 + CSS3 + JavaScript + Supabase  
**Hospedagem**: Vercel  
**Última atualização**: 2026

---

## 📋 Sumário Executivo

Sistema completo de gerenciamento para o time de futsal Colombo Night Wolves com:

- ✅ Dashboard personalizado
- ✅ Gerenciamento de jogadores
- ✅ Histórico de partidas
- ✅ Ranking dinâmico
- ✅ Estatísticas individuais
- ✅ Painel administrativo
- ✅ Autenticação segura (Supabase)
- ✅ Banco de dados PostgreSQL
- ✅ Interface responsiva

---

## 🚀 Deploy Rápido (15 minutos)

### Passo 1: GitHub (2 min)

```bash
# Clone o repositório
git clone https://github.com/matheusmjacoby/colombo-night-wolves.git
cd colombo-night-wolves

# Faça commit dos arquivos
git add .
git commit -m "MVP completo pronto para deploy"
git push origin main
```

### Passo 2: Supabase (5 min)

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto ou use existente
3. Vá em **SQL Editor**
4. Cole todo o conteúdo do arquivo `sql/banco.sql`
5. Execute (Run)
6. Copie suas chaves em **Settings** → **API**:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

### Passo 3: Vercel (5 min)

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **Add New** → **Project**
3. Selecione seu repositório GitHub
4. Configure as **Environment Variables**:
   ```
   VITE_SUPABASE_URL = sua_url_aqui
   VITE_SUPABASE_ANON_KEY = sua_chave_aqui
   ```
5. Clique em **Deploy**
6. ✅ Pronto! Seu site está no ar

### Passo 4: Testar (1 min)

Acesse: `https://seu-projeto.vercel.app`

---

## 📁 Estrutura do Projeto

```
colombo-night-wolves/
├── index.html                 # Login
├── dashboard.html             # Dashboard do jogador
├── jogadores.html             # Gerenciar jogadores
├── partidas.html              # Histórico de partidas
├── ranking.html               # Ranking de jogadores
├── estatisticas.html          # Estatísticas individuais
├── admin.html                 # Painel administrativo
│
├── css/
│   ├── style.css              # Estilos globais
│   ├── login.css              # Estilos do login
│   ├── dashboard.css          # Estilos do dashboard
│   ├── jogadores.css          # Estilos da página de jogadores
│   ├── partidas.css           # Estilos da página de partidas
│   ├── ranking.css            # Estilos do ranking
│   ├── estatisticas.css       # Estilos de estatísticas
│   └── admin.css              # Estilos do admin
│
├── js/
│   ├── config.js              # Configuração Supabase
│   ├── auth.js                # Autenticação
│   ├── api.js                 # Funções de API
│   ├── session.js             # Controle de sessão
│   ├── jogadores.js           # Lógica de jogadores
│   ├── partidas.js            # Lógica de partidas
│   ├── ranking.js             # Lógica de ranking
│   ├── estatisticas.js        # Lógica de estatísticas
│   └── admin.js               # Lógica do admin
│
└── sql/
    └── banco.sql              # Schema do banco de dados
```

---

## 🔐 Segurança - Chaves Supabase

**IMPORTANTE**: Suas chaves devem estar:
- ✅ Em variáveis de ambiente do Vercel
- ✅ NUNCA em arquivos públicos
- ❌ NUNCA com commit no GitHub

---

## 🎮 Como Usar

### 1. Fazer Login

```
Email: (cadastre no Supabase)
Senha: (cadastre no Supabase)
```

### 2. Criar Usuários de Teste

No Supabase Dashboard → **Auth** → **Users** → **Add User**

```
Email: jogador1@example.com
Password: 123456
```

Depois execute no SQL Editor:

```sql
UPDATE profiles 
SET nome = 'João Silva', posicao = 'Atacante'
WHERE email = 'jogador1@example.com';
```

### 3. Fazer Admin

```sql
UPDATE profiles 
SET is_admin = true
WHERE email = 'seu_email@example.com';
```

---

## 📊 Páginas e Funcionalidades

| Página | Função |
|--------|--------|
| **index.html** | Login seguro |
| **dashboard.html** | Visão geral do jogador |
| **jogadores.html** | CRUD de jogadores |
| **partidas.html** | Histórico de jogos |
| **ranking.html** | Rankings dinâmicos |
| **estatisticas.html** | Desempenho individual |
| **admin.html** | Gerenciamento total |

---

## 🔄 Fluxo de Autenticação

```
Usuário
   ↓
Login (email + senha)
   ↓
Supabase Auth
   ↓
Carregar Perfil
   ↓
Dashboard
```

---

## 💾 Banco de Dados

### Tabelas Principais

- **profiles** - Jogadores e usuários
- **games** - Partidas
- **attendance** - Presenças
- **statistics** - Estatísticas individuais
- **payments** - Pagamentos de mensalidades
- **cash_transactions** - Financeiro
- **settings** - Configurações do time

### Relacionamentos

```
profiles
   ├── games (attendance)
   ├── statistics
   ├── payments
   └── cash_transactions

games
   ├── attendance
   └── statistics

statistics
   └── profiles
```

---

## 🎨 Identidade Visual

- **Tema**: Escuro esportivo
- **Cores Principais**: 
  - Azul: `#1f7ae0`
  - Verde: `#22c55e`
  - Vermelho: `#ef4444`
- **Fontes**: Inter, Segoe UI, Arial
- **Ícones**: Unicode/Emojis

---

## ⚙️ Configuração Recomendada

### Supabase Settings

**Authentication** → **URL Configuration**:
```
http://localhost:3000
http://localhost:3000/**
https://seu-projeto.vercel.app
https://seu-projeto.vercel.app/**
```

**Authentication** → **CORS Whitelisted Domains**:
```
http://localhost:3000
https://seu-projeto.vercel.app
```

---

## 🧪 Testando Localmente

```bash
# Opção 1: Python
python -m http.server 8000

# Opção 2: Node
npx http-server

# Acesse
http://localhost:8000
```

---

## 📱 Responsividade

- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 768px)

---

## 🔍 Troubleshooting

### ❌ "Não consigo fazer login"
→ Verifique se o usuário existe em Supabase  
→ Confirme as chaves em `js/config.js`

### ❌ "Erro 404 em estilos"
→ Verifique a estrutura de pastas (`css/`, `js/`)  
→ Limpe o cache do navegador (Ctrl+Shift+Del)

### ❌ "Dados não carregam"
→ Verifique as políticas RLS no Supabase  
→ Confira se o usuário tem permissão

### ❌ "Vercel diz que há erro"
→ Verificar logs em **Vercel Dashboard**  
→ Confirmar Environment Variables  
→ Redeployed após alterar variáveis

---

## 📈 Próximas Melhorias

- [ ] Aplicativo mobile (React Native)
- [ ] Notificações em tempo real
- [ ] Integração WhatsApp
- [ ] Upload automático de fotos
- [ ] Sistema de votação
- [ ] Análise IA de desempenho
- [ ] Exportação de relatórios PDF

---

## 📞 Suporte

| Problema | Solução |
|----------|---------|
| Supabase | [docs.supabase.com](https://docs.supabase.com) |
| Vercel | [vercel.com/docs](https://vercel.com/docs) |
| JavaScript | [developer.mozilla.org](https://developer.mozilla.org) |

---

## 📄 Licença

Projeto privado do Colombo Night Wolves - 2026

---

## ✅ Checklist de Deploy

- [ ] Código commitado no GitHub
- [ ] Banco criado no Supabase
- [ ] Chaves configuradas no Vercel
- [ ] Usuário de teste criado
- [ ] Login funcionando
- [ ] Dashboard carregando
- [ ] Admin acessível
- [ ] Responsividade OK
- [ ] Domínio customizado (opcional)
- [ ] SSL ativo (automático no Vercel)

---

**Parabéns! Seu sistema está pronto para produção! 🚀🐺**
