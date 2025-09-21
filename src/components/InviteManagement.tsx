import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Trash2, Copy, Check } from 'lucide-react'
import { SupabaseService } from '@/lib/supabaseService'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
// import { queryKeys } from '@/lib/queryClient' // Removed unused import
import type { UserInviteInsert } from '@/lib/supabase'

const inviteSchema = z.object({
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'editor', 'viewer']),
})

type InviteFormData = z.infer<typeof inviteSchema>

export const InviteManagement = () => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const { user } = useAuth()
  const toast = useToast()
  const queryClient = useQueryClient()

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: 'editor',
    },
  })

  // Fetch invites
  const { data: invites = [], isLoading } = useQuery({
    queryKey: ['invites'],
    queryFn: SupabaseService.getInvites,
  })

  // Create invite mutation
  const createInviteMutation = useMutation({
    mutationFn: async (data: InviteFormData) => {
      if (!user) throw new Error('Usuário não autenticado')

      const token = crypto.randomUUID()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

      const inviteData: UserInviteInsert = {
        email: data.email,
        role: data.role,
        invited_by: user.id,
        token,
        expires_at: expiresAt.toISOString(),
      }

      return SupabaseService.createInvite(inviteData)
    },
    onSuccess: (invite) => {
      queryClient.invalidateQueries({ queryKey: ['invites'] })
      toast.success('Convite criado com sucesso!')
      form.reset()
      setCopiedToken(invite.token)
      setTimeout(() => setCopiedToken(null), 3000)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar convite')
    },
  })

  // Delete invite mutation
  const deleteInviteMutation = useMutation({
    mutationFn: SupabaseService.deleteInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] })
      toast.success('Convite deletado com sucesso!')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao deletar convite')
    },
  })

  const onSubmit = (data: InviteFormData) => {
    createInviteMutation.mutate(data)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este convite?')) {
      deleteInviteMutation.mutate(id)
    }
  }

  const copyToClipboard = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token)
      setCopiedToken(token)
      toast.success('Token copiado para a área de transferência!')
      setTimeout(() => setCopiedToken(null), 3000)
    } catch (error) {
      toast.error('Erro ao copiar token')
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive'
      case 'editor':
        return 'default'
      case 'viewer':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  const isUsed = (usedAt: string | null) => {
    return usedAt !== null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Convite</CardTitle>
          <CardDescription>
            Convide um novo usuário para acessar o painel administrativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@exemplo.com"
                  {...form.register('email')}
                  disabled={createInviteMutation.isPending}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={form.watch('role')}
                  onValueChange={(value) => form.setValue('role', value as 'admin' | 'editor' | 'viewer')}
                  disabled={createInviteMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.role && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.role.message}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" disabled={createInviteMutation.isPending}>
              {createInviteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Criar Convite
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Convites Existentes</CardTitle>
          <CardDescription>
            Gerencie os convites enviados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invites.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhum convite encontrado
            </p>
          ) : (
            <div className="space-y-4">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{invite.email}</span>
                      <Badge variant={getRoleBadgeVariant(invite.role)}>
                        {invite.role}
                      </Badge>
                      {isUsed(invite.used_at) && (
                        <Badge variant="outline">Usado</Badge>
                      )}
                      {isExpired(invite.expires_at) && !isUsed(invite.used_at) && (
                        <Badge variant="destructive">Expirado</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Criado em: {formatDate(invite.created_at)}</p>
                      <p>Expira em: {formatDate(invite.expires_at)}</p>
                      {invite.used_at && (
                        <p>Usado em: {formatDate(invite.used_at)}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isUsed(invite.used_at) && !isExpired(invite.expires_at) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(invite.token)}
                      >
                        {copiedToken === invite.token ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(invite.id)}
                      disabled={deleteInviteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}