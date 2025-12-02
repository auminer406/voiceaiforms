import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/terms',
  '/privacy',
  '/press',
  '/contact',
  '/invite',
  '/api/webhooks/stripe',
  '/api/webhooks/clerk',
  '/api/create-checkout',
  '/api/invite',
]);

// Define protected routes that require database check
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/forms(.*)',
  '/settings(.*)',
  '/profile(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access non-public route
  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // If accessing protected route, check database
  if (userId && isProtectedRoute(req)) {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      const user = await sql`
        SELECT tier, lifetime_access FROM users WHERE clerk_user_id = ${userId}
      `;

      // If user doesn't exist in database, redirect to payment
      if (user.length === 0) {
        return NextResponse.redirect(new URL('/?payment_required=true', req.url));
      }

      // User exists and has paid, let them through
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.next();
    }
  }

  // For all other routes, allow access
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};