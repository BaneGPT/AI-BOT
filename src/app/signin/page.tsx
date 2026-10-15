import { AuthForm } from '@/components/AuthForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - Claude Chat',
  description: 'Sign in to your Claude Chat account',
}

export default function SignInPage() {
  return <AuthForm mode="signin" />
}