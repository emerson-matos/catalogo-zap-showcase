// import { useState } from 'react' // Removed unused import
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
import { Loader2, Trash2, Mail } from 'lucide-react'
import { SupabaseService } from '@/lib/supabaseService'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

const inviteSchema = z.object({
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'editor', 'viewer']),
})

type InviteFormData = z.infer<typeof inviteSchema>

export const InviteManagement = () => {
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
      return SupabaseService.createInvite(data.email, data.role)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] })
      toast.success('Convite enviado por email com sucesso!')
      form.reset()
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

  // Resend invite mutation
  const resendInviteMutation = useMutation({
    mutationFn: SupabaseService.resendInvite,
    onSuccess: () => {
      toast.success('Convite reenviado por email!')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao reenviar convite')
    },
  })

  const onSubmit = (data: InviteFormData) => {
    createInviteMutation.mutate(data)
  }

  const handleDelete = (userId: string) => {
    if (confirm('Tem certeza que deseja deletar este convite?')) {
      deleteInviteMutation.mutate(userId)
    }
  }

  const handleResend = (email: string) => {
    resendInviteMutation.mutate(email)
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="outline">Confirmado</Badge>
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
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
                      {getStatusBadge(invite.status)}
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Convite enviado em: {formatDate(invite.invited_at)}</p>
                      {invite.status === 'confirmed' && (
                        <p>Confirmado em: {formatDate(invite.created_at)}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {invite.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResend(invite.email)}
                        disabled={resendInviteMutation.isPending}
                      >
                        <Mail className="h-4 w-4" />
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