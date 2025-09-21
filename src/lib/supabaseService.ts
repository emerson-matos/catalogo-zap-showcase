import { supabase, type Product, type ProductInsert, type ProductUpdate, type UserInvite, type UserInviteInsert, type UserInviteUpdate } from './supabase'

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

  // User Invites
  static async createInvite(inviteData: UserInviteInsert): Promise<UserInvite> {
    const { data, error } = await supabase
      .from('user_invites')
      .insert(inviteData)
      .select()
      .single()

    if (error) {
      console.error('Error creating invite:', error)
      throw new Error(`Erro ao criar convite: ${error.message}`)
    }

    return data
  }

  static async getInvites(): Promise<UserInvite[]> {
    const { data, error } = await supabase
      .from('user_invites')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching invites:', error)
      throw new Error(`Erro ao buscar convites: ${error.message}`)
    }

    return data || []
  }

  static async getInviteByToken(token: string): Promise<UserInvite | null> {
    const { data, error } = await supabase
      .from('user_invites')
      .select('*')
      .eq('token', token)
      .eq('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error) {
      console.error('Error fetching invite by token:', error)
      return null
    }

    return data
  }

  static async getInviteByEmail(email: string): Promise<UserInvite | null> {
    const { data, error } = await supabase
      .from('user_invites')
      .select('*')
      .eq('email', email)
      .eq('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error) {
      console.error('Error fetching invite by email:', error)
      return null
    }

    return data
  }

  static async markInviteAsUsed(token: string): Promise<void> {
    const { error } = await supabase
      .from('user_invites')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token)

    if (error) {
      console.error('Error marking invite as used:', error)
      throw new Error(`Erro ao marcar convite como usado: ${error.message}`)
    }
  }

  static async deleteInvite(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_invites')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting invite:', error)
      throw new Error(`Erro ao deletar convite: ${error.message}`)
    }
  }

  static async updateInvite(id: string, updates: UserInviteUpdate): Promise<UserInvite> {
    const { data, error } = await supabase
      .from('user_invites')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating invite:', error)
      throw new Error(`Erro ao atualizar convite: ${error.message}`)
    }

    return data
  }

  // Sign up with invite validation
  static async signUpWithInvite(email: string, password: string, inviteToken: string): Promise<any> {
    // First, validate the invite
    const invite = await this.getInviteByToken(inviteToken)
    if (!invite) {
      throw new Error('Convite inválido ou expirado')
    }

    if (invite.email !== email) {
      throw new Error('Email não corresponde ao convite')
    }

    // Create the user account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    // If user was created successfully, mark invite as used
    if (data.user) {
      await this.markInviteAsUsed(inviteToken)
      
      // Assign the role from the invite
      await supabase
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          role: invite.role,
        })
    }

    return data
  }
}