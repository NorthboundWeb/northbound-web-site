import type { Metadata } from 'next'
import { StartFlow } from '@/components/start-flow'

export const metadata: Metadata = {
  title: 'Start a project',
  description: 'Get a free model of your website built. The final website is paid for, and only if you like the model.',
}

export default function StartPage() {
  return <StartFlow />
}
