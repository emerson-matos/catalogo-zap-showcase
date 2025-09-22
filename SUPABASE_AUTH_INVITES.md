# Sistema de Convites com Supabase Auth - Documentação

## 🎯 Visão Geral

O sistema agora usa o **sistema de convites nativo do Supabase Auth**, que é mais robusto, seguro e integrado. Não precisamos mais de tabelas customizadas ou validações manuais.

## 🔧 Funcionalidades Implementadas

### ✅ Sistema de Convites Nativo
- **Criação de convites**: Usa `supabase.auth.admin.inviteUserByEmail()`
- **Gerenciamento automático**: Supabase gerencia tokens, expiração e validação
- **Emails automáticos**: Supabase envia emails de convite automaticamente
- **Redirecionamento**: Usuários são redirecionados para `/admin` após aceitar convite

### ✅ Interface Administrativa
- **Aba de convites**: Nova aba no painel admin (apenas para admins)
- **Lista de convites**: Mostra usuários pendentes e confirmados
- **Reenvio de convites**: Botão para reenviar email de convite
- **Exclusão de convites**: Remove usuário do sistema Supabase Auth

### ✅ Fluxo Simplificado
- **Signup direto**: Usuários podem criar conta diretamente (sem token manual)
- **Validação automática**: Supabase valida convites automaticamente
- **Atribuição de roles**: Role é atribuído automaticamente baseado no convite

## 🗄️ Estrutura do Banco de Dados

### Tabela `user_roles` (Mantida)
```sql
CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);
```

### Sistema de Convites do Supabase Auth
- **Tabela `auth.users`**: Usuários criados via convite
- **Campo `email_confirmed_at`**: Indica se usuário confirmou o convite
- **Campo `created_at`**: Data de criação do convite
- **Gerenciamento automático**: Tokens, expiração e validação

## 🚀 Como Usar

### 1. Criar Convite (Admin)
1. Acesse o painel admin (`/admin`)
2. Vá para a aba "Convites"
3. Preencha o email e selecione o role
4. Clique em "Criar Convite"
5. Supabase envia email automaticamente

### 2. Aceitar Convite (Usuário)
1. Usuário recebe email do Supabase
2. Clica no link no email
3. É redirecionado para `/admin`
4. Cria senha e confirma conta
5. Role é atribuído automaticamente

### 3. Gerenciar Convites (Admin)
- **Visualizar**: Lista todos os convites (pendentes e confirmados)
- **Reenviar**: Clique no ícone de email para reenviar convite
- **Deletar**: Remove usuário do sistema Supabase Auth

## 🔐 Fluxo de Segurança

### Criação de Convite
1. Admin cria convite via interface
2. `supabase.auth.admin.inviteUserByEmail()` é chamado
3. Supabase cria usuário com status "não confirmado"
4. Role é salvo na tabela `user_roles`
5. Email é enviado automaticamente pelo Supabase

### Aceitação do Convite
1. Usuário clica no link do email
2. Supabase valida o token automaticamente
3. Usuário é redirecionado para `/admin`
4. Usuário cria senha
5. Conta é confirmada automaticamente
6. Role já está atribuído na tabela `user_roles`

## 📱 Interface do Usuário

### Formulário de Signup (Simplificado)
- Campo de email
- Campo de senha
- Campo de confirmação de senha
- **Sem campo de token** (gerenciado pelo Supabase)

### Painel de Convites (Admin)
- Formulário para criar convites
- Lista de convites com status
- Botão para reenviar email
- Botão para deletar convite

## 🛠️ Configuração

### Variáveis de Ambiente
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Configuração do Supabase Auth
1. **Authentication Settings**:
   - Site URL: `http://localhost:5173` (desenvolvimento)
   - Redirect URLs: `http://localhost:5173/**`
   - Email Templates: Personalize se necessário

2. **Email Settings**:
   - SMTP configurado (ou usar serviço padrão do Supabase)
   - Templates de convite personalizados

### Executar Schema SQL
Execute o arquivo `supabase-schema.sql` atualizado (sem tabela customizada de convites).

## 🔧 Funções Principais

### SupabaseService
- `createInvite(email, role)`: Criar convite usando Supabase Auth
- `getInvites()`: Listar convites (usuários pendentes/confirmados)
- `deleteInvite(userId)`: Deletar usuário do Supabase Auth
- `resendInvite(email)`: Reenviar email de convite
- `signUp(email, password)`: Signup simples (sem validação customizada)

### Componentes
- `InviteManagement`: Interface para gerenciar convites
- `LoginForm`: Formulário simplificado (sem token)
- `AdminPanel`: Painel com aba de convites

## 🐛 Correções Implementadas

### Migração para Supabase Auth
- **Antes**: Sistema customizado com tabela `user_invites`
- **Depois**: Sistema nativo do Supabase Auth
- **Benefícios**: Mais seguro, menos código, gerenciamento automático

### Simplificação do Signup
- **Antes**: Campo obrigatório de token manual
- **Depois**: Signup direto (validação automática pelo Supabase)
- **Benefícios**: UX melhor, menos erros, mais confiável

## 📋 Vantagens do Sistema Nativo

### 🔒 Segurança
- Tokens gerenciados pelo Supabase
- Validação automática e segura
- Expiração automática de convites
- Proteção contra ataques

### 🚀 Simplicidade
- Menos código customizado
- Menos pontos de falha
- Gerenciamento automático
- Integração nativa

### 📧 Email
- Envio automático de emails
- Templates personalizáveis
- Rastreamento de entrega
- Reenvio automático

### 🔄 Manutenção
- Atualizações automáticas do Supabase
- Menos bugs customizados
- Documentação oficial
- Suporte da comunidade

## 🚨 Considerações Importantes

### Permissões Admin
- Apenas usuários com role `admin` podem criar convites
- Usar `supabase.auth.admin.*` requer permissões de admin
- Verificar se usuário tem permissões antes de criar convites

### Configuração de Email
- Configurar SMTP no Supabase para emails personalizados
- Testar envio de emails em desenvolvimento
- Verificar spam folder para emails de convite

### Redirecionamento
- Configurar URLs de redirecionamento no Supabase
- Testar fluxo completo de convite
- Verificar se usuário é redirecionado corretamente

## 📞 Suporte

Para problemas com o sistema de convites:
1. Verificar configuração do Supabase Auth
2. Confirmar se emails estão sendo enviados
3. Verificar logs do Supabase Auth
4. Testar fluxo completo de convite

## 🔄 Próximos Passos

1. **Testes**: Implementar testes para o sistema de convites
2. **Email Templates**: Personalizar templates de email
3. **Analytics**: Adicionar métricas de convites
4. **Bulk Invites**: Permitir convites em massa
5. **Integration**: Integrar com outros sistemas