import { useLocation } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  path: string
}

export const Breadcrumb = () => {
  const location = useLocation()
  
  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    
    // Always include home
    breadcrumbs.push({ label: 'Início', path: '/' })
    
    // Add path segments
    let currentPath = ''
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`
      const label = getSegmentLabel(segment)
      breadcrumbs.push({ label, path: currentPath })
    })
    
    return breadcrumbs
  }
  
  const getSegmentLabel = (segment: string): string => {
    const labels: Record<string, string> = {
      'products': 'Produtos',
      'about': 'Sobre Nós',
      'contact': 'Contato',
      'flipbook': 'Catálogo',
    }
    
    return labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
  }
  
  const breadcrumbs = generateBreadcrumbs()
  
  // Don't show breadcrumb on home page
  if (location.pathname === '/') {
    return null
  }
  
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      {breadcrumbs.map((item, index) => (
        <div key={item.path} className="flex items-center">
          {index === 0 && <Home className="w-4 h-4 mr-1" />}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : (
            <Link 
              to={item.path}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          )}
          {index < breadcrumbs.length - 1 && (
            <ChevronRight className="w-4 h-4 mx-1" />
          )}
        </div>
      ))}
    </nav>
  )
}