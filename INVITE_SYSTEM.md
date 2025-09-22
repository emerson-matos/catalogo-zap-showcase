# Sistema de Convites - Documentação

## 🎯 Visão Geral

O sistema de convites foi implementado para controlar o acesso ao painel administrativo. Agora, apenas usuários com convites válidos podem criar contas.

## 🔧 Funcionalidades Implementadas

### ✅ Sistema de Convites
- **Criação de convites**: Apenas admins podem criar convites
- **Validação de convites**: Convites têm token único e data de expiração
- **Gerenciamento de convites**: Interface para visualizar, copiar e deletar convites
- **Status de convites**: Usado, expirado, ativo

### ✅ Autenticação Melhorada
- **Login corrigido**: Problema de loading infinito resolvido
- **Signup com convite**: Usuários precisam de token válido para criar conta
- **Atribuição automática de roles**: Role é atribuído automaticamente baseado no convite

### ✅ Interface Administrativa
- **Aba de convites**: Nova aba no painel admin (apenas para admins)
- **Cópia de tokens**: Botão para copiar token do convite
- **Visualização de status**: Badges para mostrar status dos convites

## 🗄️ Estrutura do Banco de Dados

### Tabela `user_invites`
```sql
CREATE TABLE user_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Políticas de Segurança (RLS)
- **Visualização**: Qualquer um pode ver convites válidos (para validação)
- **Criação**: Apenas admins podem criar convites
- **Atualização**: Apenas admins podem atualizar convites
- **Exclusão**: Apenas admins podem deletar convites

## 🚀 Como Usar

### 1. Criar Convite (Admin)
1. Acesse o painel admin (`/admin`)
2. Vá para a aba "Convites"
3. Preencha o email e selecione o role
4. Clique em "Criar Convite"
5. Copie o token gerado

### 2. Usar Convite (Novo Usuário)
1. Acesse a página de login (`/admin`)
2. Clique em "Não tem uma conta? Criar conta"
3. Preencha os dados e cole o token do convite
4. Clique em "Criar Conta"
5. Verifique seu email para confirmar a conta

### 3. Gerenciar Convites (Admin)
- **Visualizar**: Todos os convites são listados com status
- **Copiar token**: Clique no ícone de cópia para copiar o token
- **Deletar**: Clique no ícone de lixeira para deletar um convite

## 🔐 Fluxo de Segurança

### Criação de Convite
1. Admin cria convite com email e role
2. Sistema gera token único (UUID)
3. Convite expira em 7 dias
4. Convite é salvo no banco com status "ativo"

### Uso do Convite
1. Usuário insere token no formulário de signup
2. Sistema valida:
   - Token existe
   - Token não foi usado
   - Token não expirou
   - Email corresponde ao convite
3. Se válido:
   - Cria conta no Supabase Auth
   - Marca convite como usado
   - Atribui role automaticamente

## 📱 Interface do Usuário

### Formulário de Signup
- Campo de email
- Campo de senha
- Campo de confirmação de senha
- **Campo de token de convite** (obrigatório)

### Painel de Convites (Admin)
- Formulário para criar convites
- Lista de convites existentes
- Status visual (ativo, usado, expirado)
- Botões de ação (copiar, deletar)

## 🛠️ Configuração

### Variáveis de Ambiente
As mesmas variáveis do Supabase são necessárias:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Executar Schema SQL
Execute o arquivo `supabase-schema.sql` atualizado no Supabase para criar as tabelas e políticas.

## 🔧 Funções Principais

### SupabaseService
- `createInvite()`: Criar novo convite
- `getInvites()`: Listar todos os convites
- `getInviteByToken()`: Buscar convite por token
- `markInviteAsUsed()`: Marcar convite como usado
- `signUpWithInvite()`: Criar conta com validação de convite

### Componentes
- `InviteManagement`: Interface para gerenciar convites
- `LoginForm`: Formulário atualizado com validação de convite
- `AdminPanel`: Painel com nova aba de convites

## 🐛 Correções Implementadas

### Problema de Login Infinito
- **Causa**: Erro no `getUserRole()` não estava sendo tratado
- **Solução**: Adicionado try/catch para tratar erros de role
- **Resultado**: Login funciona normalmente mesmo se role falhar

### Sistema de Convites
- **Problema**: Usuários podiam criar contas livremente
- **Solução**: Implementado sistema de convites obrigatório
- **Resultado**: Apenas usuários convidados podem criar contas

## 📋 Próximos Passos

1. **Testes**: Implementar testes para o sistema de convites
2. **Email**: Integrar envio de emails com tokens
3. **Expiração**: Implementar limpeza automática de convites expirados
4. **Auditoria**: Adicionar logs de criação e uso de convites
5. **Bulk**: Permitir criação de múltiplos convites

## 🚨 Considerações de Segurança

- Tokens são únicos e não podem ser reutilizados
- Convites expiram automaticamente em 7 dias
- Apenas admins podem gerenciar convites
- Email deve corresponder exatamente ao convite
- Roles são atribuídos automaticamente baseados no convite

## 📞 Suporte

Para problemas com o sistema de convites:
1. Verifique se o token está correto
2. Confirme se o convite não expirou
3. Verifique se o email corresponde ao convite
4. Confirme se o usuário tem permissões de admin para criar convites