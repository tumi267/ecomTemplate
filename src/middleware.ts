import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Public route: admin sign-in page
const isPublicRoute = createRouteMatcher(['/admin/sign-in(.*)'])

// Protected admin routes
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Skip public routes
  if (!isPublicRoute(req) && isAdminRoute(req)) {
    // Protect admin routes: redirect to /admin/sign-in if not signed in
    await auth.protect(has => has({
    role: 'admin'}))
  }
})

export const config = {
  matcher: '/:path*', // runs for all routes
}