import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { SupabaseService } from '@/lib/supabaseService'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  inviteToken: z.string().min(1, 'Token de convite é obrigatório'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
})

type LoginFormData = z.infer<typeof loginSchema>
type SignupFormData = z.infer<typeof signupSchema>

interface LoginFormProps {
  onSuccess?: () => void
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [isSignup, setIsSignup] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmitLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await signIn(data.email, data.password)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitSignup = async (data: SignupFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await SupabaseService.signUpWithInvite(data.email, data.password, data.inviteToken)
      setError('Conta criada! Verifique seu email para confirmar.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isSignup ? 'Criar Conta' : 'Login'}</CardTitle>
        <CardDescription>
          {isSignup 
            ? 'Crie uma conta usando seu convite para acessar o painel administrativo'
            : 'Entre com suas credenciais para acessar o painel administrativo'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isSignup ? (
          <form onSubmit={signupForm.handleSubmit(onSubmitSignup)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                {...signupForm.register('email')}
                disabled={isLoading}
              />
              {signupForm.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {signupForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Senha</Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  {...signupForm.register('password')}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {signupForm.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {signupForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password">Confirmar Senha</Label>
              <Input
                id="signup-confirm-password"
                type="password"
                {...signupForm.register('confirmPassword')}
                disabled={isLoading}
              />
              {signupForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {signupForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-invite-token">Token de Convite</Label>
              <Input
                id="signup-invite-token"
                type="text"
                placeholder="Cole aqui o token do seu convite"
                {...signupForm.register('inviteToken')}
                disabled={isLoading}
              />
              {signupForm.formState.errors.inviteToken && (
                <p className="text-sm text-red-500">
                  {signupForm.formState.errors.inviteToken.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Conta
            </Button>
          </form>
        ) : (
          <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                {...loginForm.register('email')}
                disabled={isLoading}
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Senha</Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  {...loginForm.register('password')}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>
          </form>
        )}

        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => {
              setIsSignup(!isSignup)
              setError(null)
              loginForm.reset()
              signupForm.reset()
            }}
            disabled={isLoading}
          >
            {isSignup ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Criar conta'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}