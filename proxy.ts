import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export default async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Never touch API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Allow invite & recovery flows unconditionally
  const isRecoveryFlow =
    searchParams.get('type') === 'recovery' ||
    pathname === '/set-password' ||
    pathname === '/reset-password' ||
    pathname === '/accept-invite'

  if (isRecoveryFlow) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          // CRITICAL: Sync to both request and response for session refresh
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (e) {
    // If getUser fails, treat as unauthenticated
    console.error('[PROXY] getUser failed:', e)
  }

  // Public routes
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/verify',
    '/forgot-password',
    '/reset-password',
    '/set-password',
    '/accept-invite',
  ]

  if (publicRoutes.includes(pathname)) {
    // Logged-in users may visit public pages safely
    return response
  }

  // Protect dashboard: AUTH ONLY
  if (pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/verify',
    '/forgot-password',
    '/reset-password',
    '/set-password',
    '/accept-invite',
    '/dashboard/:path*',
  ],
}
