import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { ChatInterface } from '@/components/ChatInterface'

export default async function ChatPage() {
  const session = await auth()

  if (!session) {
    redirect('/signin?callbackUrl=/chat')
  }

  return <ChatInterface />
}