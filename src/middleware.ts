
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const { pathname } = request.nextUrl

  if (!token && pathname.startsWith('/students')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/students', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/students/:path*', '/login', '/signup'],
}
