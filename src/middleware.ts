import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

export default clerkMiddleware()

  
export const config = {
  matcher: [
    // Apply middleware to everything except public routes
    '/((?!_next/static|_next/image|favicon.ico|sign-in|sign-up|api/createUser).*)',
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
