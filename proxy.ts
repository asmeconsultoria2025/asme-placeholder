import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Public routes that don't require authentication
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

  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname === route)

  // Handle root path
  if (request.nextUrl.pathname === '/') {
    if (user) {
      // Logged in users go to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // Non-logged in users stay on root (which should show signup/landing)
    return response
  }

  // Allow public routes without auth
  if (isPublicRoute) {
    // If logged in and trying to access login/signup, redirect to dashboard
    if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return response
  }

  // If accessing dashboard without auth, redirect to login
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If accessing dashboard, verify admin status
  if (user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const isAdmin = user.user_metadata?.is_admin === true;
    if (!isAdmin) {
      // Sign out and redirect to login
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (CRITICAL - don't intercept /api routes)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}