import { fetchProductsFromGoogleSheet } from './googleSheets'
import { SupabaseService } from './supabaseService'
import type { ProductInsert } from './supabase'

/**
 * Migrates products from Google Sheets to Supabase
 * This function should be run once to transfer existing data
 */
export async function migrateProductsFromGoogleSheets(): Promise<void> {
  try {
    console.log('Starting migration from Google Sheets to Supabase...')
    
    // Fetch products from Google Sheets
    const googleSheetsProducts = await fetchProductsFromGoogleSheet()
    
    if (googleSheetsProducts.length === 0) {
      console.log('No products found in Google Sheets')
      return
    }

    console.log(`Found ${googleSheetsProducts.length} products to migrate`)

    // Get current user (you'll need to be authenticated)
    const user = await SupabaseService.getCurrentUser()
    if (!user) {
      throw new Error('User must be authenticated to migrate products')
    }

    // Convert Google Sheets products to Supabase format
    const supabaseProducts: ProductInsert[] = googleSheetsProducts.map(product => ({
      name: product.name,
      description: product.description,
      price: typeof product.price === 'string' ? parseFloat(product.price) || 0 : product.price,
      image: product.image,
      category: product.category,
      rating: product.rating,
      is_new: product.isNew || false,
      created_by: user.id,
    }))

    // Insert products into Supabase
    let successCount = 0
    let errorCount = 0

    for (const product of supabaseProducts) {
      try {
        await SupabaseService.createProduct(product)
        successCount++
        console.log(`✓ Migrated: ${product.name}`)
      } catch (error) {
        errorCount++
        console.error(`✗ Failed to migrate: ${product.name}`, error)
      }
    }

    console.log(`Migration completed!`)
    console.log(`✓ Successfully migrated: ${successCount} products`)
    console.log(`✗ Failed to migrate: ${errorCount} products`)

  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

/**
 * Utility function to run migration from browser console
 * Usage: window.migrateProducts()
 */
export function setupMigrationHelper() {
  if (typeof window !== 'undefined') {
    (window as Record<string, unknown>).migrateProducts = migrateProductsFromGoogleSheets
    console.log('Migration helper available: window.migrateProducts()')
  }
}