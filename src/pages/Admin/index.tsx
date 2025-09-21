import { LoginForm } from '@/components/LoginForm'
import { AdminPanel } from '@/components/AdminPanel'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'

export default function AdminPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoginForm />
      </div>
    )
  }

  return (
    <ProtectedRoute requiredRole="editor">
      <AdminPanel />
    </ProtectedRoute>
  )
}