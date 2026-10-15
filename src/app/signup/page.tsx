import { AuthForm } from '@/components/AuthForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - Claude Chat',
  description: 'Create your Claude Chat account',
}

export default function SignUpPage() {
  return <AuthForm mode="signup" />
}