// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server'

export default function middleware(req: any, ev: any) {
  // Just call clerkMiddleware, or skip entirely
  return;
}

export const config = {
  matcher: '/:path*', // runs for all routes
}