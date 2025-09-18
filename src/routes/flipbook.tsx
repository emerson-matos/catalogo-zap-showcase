import { createFileRoute } from '@tanstack/react-router'
import FlipbookPage from '@/pages/Flipbook'

export const Route = createFileRoute('/flipbook')({
  component: FlipbookPage,
})