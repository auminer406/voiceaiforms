import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/demo(.*)',
  '/thank-you(.*)',
  '/hvac(.*)',              // ← Add this line
  '/api/session/init(.*)',
  '/api/session/answer(.*)',
  '/api/tts(.*)',
  '/api/submit(.*)',
  '/api/webhooks/stripe(.*)',  // ← Also add this for Stripe webhooks
  '/api/create-checkout(.*)',   // ← And this for checkout
  '/api/capture-email(.*)',     // ← And this for email capture
  '/',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
