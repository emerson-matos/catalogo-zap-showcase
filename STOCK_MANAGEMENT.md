# Stock Management System Documentation

## Overview

A comprehensive stock management system has been integrated into the admin panel, providing real-time metrics and alerts for inventory control.

## Features

### 1. Stock Dashboard

The Stock Dashboard is displayed on the Admin Panel (`/admin`) and provides the following metrics:

#### Key Metrics Cards

1. **Total de Produtos** - Shows the total number of products in the system
2. **Estoque Total** - Displays the total number of units in stock across all products
3. **Valor do Inventário** - Shows the total value of inventory (price × stock for all products)
4. **Estoque Médio** - Displays the average stock per product

#### Stock Alerts

1. **Estoque Baixo** (Low Stock Alert)
   - Shows products with stock ≤ 10 units
   - Lists up to 5 products with their current stock levels
   - Yellow warning indicator

2. **Sem Estoque** (Out of Stock Alert)
   - Shows products with 0 stock
   - Lists up to 5 products
   - Red warning indicator

### 2. Stock Field in Product Form

The product creation/edit form (`AddProductForm.tsx`) now includes:
- **Stock field**: Integer input for setting product stock quantity
- Default value: 0
- Validation: Must be ≥ 0

### 3. Stock Display in Product Cards

Product cards now display stock status badges:
- **Sem estoque** (Red badge): When stock = 0
- **Estoque baixo** (Yellow badge): When stock ≤ 10
- Shows the exact number of units in stock

### 4. Stock Display in Product Details

The product detail page shows:
- **Stock level with color-coded badges**:
  - Green: Normal stock (> 10 units)
  - Yellow: Low stock (1-10 units)
  - Red: Out of stock (0 units)
- Exact unit count for available items

## Database Schema Changes

Added `stock` field to the `products` table:

```typescript
interface Product {
  // ... existing fields
  stock?: number;  // Number of units in stock
}
```

## Component Structure

### New Components

- `src/components/StockDashboard.tsx` - Main dashboard component with metrics

### Modified Components

- `src/components/AdminPanel.tsx` - Integrated StockDashboard
- `src/components/AddProductForm.tsx` - Added stock field to form
- `src/components/ProductCard.tsx` - Added stock status badges
- `src/routes/products/$id.tsx` - Added stock display to detail page

### Modified Types

- `src/lib/supabase.ts` - Updated Product type definitions

## Usage

### For Administrators

1. **View Stock Metrics**
   - Navigate to `/admin`
   - View the Stock Dashboard at the top
   - Monitor low stock and out-of-stock alerts

2. **Update Product Stock**
   - Click "cadastrar" or edit an existing product
   - Set the stock quantity in the "Estoque" field
   - Save the product

3. **Monitor Inventory Value**
   - Check the "Valor do Inventário" card
   - This shows the total monetary value of all stock

### For Customers

- Product cards show stock availability
- Product detail pages display current stock levels
- Visual indicators help identify available products

## Technical Details

### Technologies Used

- **React** with TypeScript
- **shadcn/ui** components (Card, Badge, Alert, etc.)
- **TanStack Query** for data fetching
- **Supabase** for database storage

### Stock Alert Thresholds

- **Low Stock**: ≤ 10 units
- **Out of Stock**: 0 units

### Metrics Calculation

All metrics are calculated client-side from product data:
- Real-time updates when products are added/edited
- Automatic recalculation on data changes
- Efficient memoization to prevent unnecessary recalculations

## Future Enhancements

Potential improvements for the stock management system:

1. **Stock History**: Track stock changes over time
2. **Automatic Reorder**: Alert when stock falls below a custom threshold
3. **Stock Movements**: Log additions and removals
4. **Bulk Stock Updates**: Update multiple products at once
5. **Stock Reports**: Export stock data and analytics
6. **Low Stock Notifications**: Email/SMS alerts for low stock items
7. **Stock Predictions**: ML-based forecasting for stock needs

## Screenshots

The system includes:
- Clean, modern dashboard design
- Color-coded status indicators
- Responsive layout for mobile and desktop
- Accessible components following WCAG guidelines

## Support

For issues or questions:
1. Check the component source code
2. Review the TypeScript type definitions
3. Consult the shadcn/ui documentation for UI component usage
