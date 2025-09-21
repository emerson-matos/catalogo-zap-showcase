# Migração para Supabase - Guia de Configuração

Este guia explica como migrar o app do Google Sheets para o Supabase e configurar o painel administrativo.

## 🚀 Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Escolha sua organização e configure:
   - Nome do projeto
   - Senha do banco de dados
   - Região (recomendado: São Paulo)

### 2. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Preencha as variáveis no arquivo `.env`:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-publica-anonima
   ```

3. Encontre essas informações em:
   - **URL**: Settings → API → Project URL
   - **Anon Key**: Settings → API → Project API keys → anon public

### 3. Configurar Banco de Dados

1. Acesse o SQL Editor no painel do Supabase
2. Execute o script `supabase-schema.sql` que está na raiz do projeto
3. Isso criará:
   - Tabela `products` para os produtos
   - Tabela `user_roles` para controle de acesso
   - Políticas de segurança (RLS)
   - Funções auxiliares

### 4. Configurar Autenticação

1. No painel do Supabase, vá para Authentication → Settings
2. Configure as URLs permitidas:
   - **Site URL**: `http://localhost:5173` (desenvolvimento)
   - **Redirect URLs**: `http://localhost:5173/**`
3. Para produção, adicione sua URL de produção

### 5. Criar Usuário Administrador

1. Vá para Authentication → Users
2. Clique em "Add user" e crie um usuário admin
3. Anote o UUID do usuário criado
4. Execute este SQL para dar permissão de admin:
   ```sql
   INSERT INTO user_roles (user_id, role) VALUES ('uuid-do-usuario', 'admin');
   ```

## 📦 Instalação e Execução

### Instalar Dependências
```bash
pnpm install
```

### Executar em Desenvolvimento
```bash
pnpm dev
```

### Acessar Painel Admin
- URL: `http://localhost:5173/admin`
- Use as credenciais do usuário admin criado

## 🔄 Migração de Dados

### Migrar Produtos do Google Sheets

1. Configure as variáveis do Google Sheets no `.env` (se ainda não fez)
2. Acesse o console do navegador na página admin
3. Execute o comando de migração:
   ```javascript
   window.migrateProducts()
   ```

### Migração Manual (Alternativa)

Se preferir migrar manualmente:

1. Exporte os dados do Google Sheets como CSV
2. Use o painel admin para adicionar produtos um por um
3. Ou importe via SQL diretamente no Supabase

## 🛡️ Controle de Acesso

### Roles Disponíveis

- **admin**: Acesso total (criar, editar, deletar produtos e gerenciar usuários)
- **editor**: Pode criar e editar produtos
- **viewer**: Apenas visualização (não implementado ainda)

### Gerenciar Usuários

Para adicionar novos usuários com permissões:

1. Crie o usuário em Authentication → Users
2. Execute SQL para atribuir role:
   ```sql
   INSERT INTO user_roles (user_id, role) VALUES ('uuid-do-usuario', 'editor');
   ```

## 🚀 Deploy para Produção

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Atualize as URLs permitidas no Supabase para sua URL de produção

### Outras Plataformas

Configure as variáveis de ambiente conforme a plataforma escolhida.

## 🔧 Funcionalidades Implementadas

### ✅ Painel Administrativo
- Login/logout com autenticação
- Visualização de todos os produtos
- Criação de novos produtos
- Edição de produtos existentes
- Exclusão de produtos (apenas admins)
- Controle de acesso baseado em roles

### ✅ Segurança
- Row Level Security (RLS) habilitado
- Políticas de acesso por role
- Autenticação obrigatória para operações de escrita
- Validação de dados com Zod

### ✅ Interface
- Design responsivo
- Formulários com validação
- Feedback visual (loading, sucesso, erro)
- Compatibilidade com tema escuro/claro

## 🐛 Solução de Problemas

### Erro de Autenticação
- Verifique se as URLs estão configuradas corretamente no Supabase
- Confirme se o usuário tem role atribuído na tabela `user_roles`

### Erro de Permissão
- Verifique se o usuário tem o role correto
- Confirme se as políticas RLS estão funcionando

### Erro de Conexão
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo

## 📝 Próximos Passos

1. **Testes**: Implementar testes unitários e de integração
2. **Backup**: Configurar backup automático do banco
3. **Monitoramento**: Adicionar logs e métricas
4. **Performance**: Otimizar queries e cache
5. **Features**: Implementar busca, filtros avançados, etc.

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do Supabase
2. Consulte a documentação oficial do Supabase
3. Verifique os logs do navegador para erros JavaScript