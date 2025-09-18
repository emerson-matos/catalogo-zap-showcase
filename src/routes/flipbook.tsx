import { createFileRoute } from '@tanstack/react-router'
import { Flipbook } from '@/pages/Flipbook'

export const Route = createFileRoute('/flipbook')({
  component: Flipbook,
})