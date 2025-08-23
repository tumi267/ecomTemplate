// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Match everything except Next.js internals, API routes, auth pages, and static files
    '/((?!_next/static|_next/image|favicon.ico|api|sign-in|sign-up).*)',
  ],
};
