import { supabase, type Product, type ProductInsert, type ProductUpdate } from './supabase'

export { supabase }

export class SupabaseService {
  // Products
  static async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      throw new Error(`Erro ao buscar produtos: ${error.message}`)
    }

    return data || []
  }

  static async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return null
    }

    return data
  }

  static async createProduct(product: ProductInsert): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      throw new Error(`Erro ao criar produto: ${error.message}`)
    }

    return data
  }

  static async updateProduct(id: string, updates: ProductUpdate): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      throw new Error(`Erro ao atualizar produto: ${error.message}`)
    }

    return data
  }

  static async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      throw new Error(`Erro ao deletar produto: ${error.message}`)
    }
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products by category:', error)
      throw new Error(`Erro ao buscar produtos por categoria: ${error.message}`)
    }

    return data || []
  }

  static async searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching products:', error)
      throw new Error(`Erro ao buscar produtos: ${error.message}`)
    }

    return data || []
  }

  // Categories
  static async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null)

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    const categories = Array.from(
      new Set(data?.map(item => item.category).filter(Boolean))
    ).sort()

    return ['Todos', ...categories]
  }

  // Auth helpers
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting current user:', error)
      return null
    }

    return user
  }

  static async getUserRole(userId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user role:', error)
      return null
    }

    return data?.role || null
  }

  static async hasPermission(userId: string, requiredRole: 'admin' | 'editor' | 'viewer'): Promise<boolean> {
    const userRole = await this.getUserRole(userId)
    
    if (!userRole) return false

    const roleHierarchy = { admin: 3, editor: 2, viewer: 1 }
    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0
    const requiredLevel = roleHierarchy[requiredRole]

    return userLevel >= requiredLevel
  }

  // User Invites using Supabase Auth Admin API
  static async createInvite(email: string, role: 'admin' | 'editor' | 'viewer'): Promise<any> {
    // Use Supabase Auth Admin API to create invite
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${window.location.origin}/admin`,
    })

    if (error) {
      console.error('Error creating invite:', error)
      throw new Error(`Erro ao criar convite: ${error.message}`)
    }

    // Store the role in user_roles table for when user accepts invite
    if (data.user) {
      await supabase
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          role: role,
        })
    }

    return data
  }

  static async getInvites(): Promise<any[]> {
    // Get users with pending invites (users created but not confirmed)
    const { data: users, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('Error fetching invites:', error)
      throw new Error(`Erro ao buscar convites: ${error.message}`)
    }

    // Filter users who haven't confirmed their email yet
    const pendingInvites = users.users.filter(user => !user.email_confirmed_at)
    
    // Get roles for these users
    const userIds = pendingInvites.map(user => user.id)
    const { data: roles } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .in('user_id', userIds)

    // Combine user data with roles
    return pendingInvites.map(user => {
      const userRole = roles?.find(role => role.user_id === user.id)
      return {
        id: user.id,
        email: user.email,
        role: userRole?.role || 'viewer',
        created_at: user.created_at,
        invited_at: user.created_at,
        status: user.email_confirmed_at ? 'confirmed' : 'pending',
      }
    })
  }

  static async deleteInvite(userId: string): Promise<void> {
    // Delete the user from Supabase Auth
    const { error } = await supabase.auth.admin.deleteUser(userId)
    
    if (error) {
      console.error('Error deleting invite:', error)
      throw new Error(`Erro ao deletar convite: ${error.message}`)
    }

    // Also delete from user_roles table
    await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
  }

  static async resendInvite(email: string): Promise<void> {
    // Resend invitation email
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    })

    if (error) {
      console.error('Error resending invite:', error)
      throw new Error(`Erro ao reenviar convite: ${error.message}`)
    }
  }

  // Sign up with Supabase Auth (no custom validation needed)
  static async signUp(email: string, password: string): Promise<any> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }
}