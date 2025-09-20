import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Breadcrumb } from '@/components/Breadcrumb'

export const Route = createFileRoute('/_layout')({
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb />
      </div>
      <Outlet />
    </div>
  )
}