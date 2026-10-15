import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HomePage() {
  const session = await auth()

  if (session) {
    redirect('/chat')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-12">
          <Link href="/signin" className="inline-flex items-center gap-2 text-3xl font-bold text-primary-600 dark:text-primary-400">
            <span>🤖</span> Claude Chat
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Chat with <span className="text-primary-600 dark:text-primary-400">Claude AI</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-lg mx-auto">
          Secure, private conversations powered by Anthropic's Claude. Sign in to start chatting.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            href="/signin"
            className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors text-lg"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-xl transition-colors text-lg"
          >
            Create Account
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <FeatureCard icon="🔒" title="Private & Secure" desc="Your conversations are encrypted and only accessible to you." />
          <FeatureCard icon="⚡" title="Fast Responses" desc="Powered by Claude 3 Haiku for quick, intelligent responses." />
          <FeatureCard icon="💾" title="Chat History" desc="All your conversations are saved and synced across devices." />
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            By using this service, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-gray-700 dark:hover:text-gray-300">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-gray-700 dark:hover:text-gray-300">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{desc}</p>
    </div>
  )
}