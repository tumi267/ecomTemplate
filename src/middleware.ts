import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// // Public route: admin sign-in page
// const isPublicRoute = createRouteMatcher(['/admin/sign-in(.*)'])

// // Protected admin routes
// const isAdminRoute = createRouteMatcher(['/admin(.*)'])

// export default clerkMiddleware(async (auth, req) => {
//   // Skip public routes
//   if (!isPublicRoute(req) && isAdminRoute(req)) {
//     // Protect admin routes: redirect to /admin/sign-in if not signed in
//     await auth.protect(has => has({
//     role: 'admin'}))
//   }
// })

export default function middleware(req: any, ev: any) {
  // unmute the above function and mute this one for client
  // this is just the bypass
  // Just call clerkMiddleware, or skip entirely
  return;
}

export const config = {
  matcher: '/:path*', // runs for all routes
}