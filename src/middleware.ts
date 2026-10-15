import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnChat = req.nextUrl.pathname.startsWith('/chat')
  const isOnAuth = req.nextUrl.pathname.startsWith('/signin') || req.nextUrl.pathname.startsWith('/signup')

  if (isOnChat && !isLoggedIn) {
    return NextResponse.redirect(new URL('/signin?callbackUrl=/chat', req.nextUrl))
  }

  if (isOnAuth && isLoggedIn) {
    return NextResponse.redirect(new URL('/chat', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/chat/:path*', '/signin', '/signup'],
}