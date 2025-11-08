// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

// export default clerkMiddleware(async (auth, req) => {
//   if (isProtectedRoute(req)) await auth.protect()
// })

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// }

//For the shop subscription. Changed the middleware.ts from the one above to the new one.

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]); // Protect dashboard

export default clerkMiddleware(async (auth, req) => {
  // Protect dashboard pages
  if (isProtectedRoute(req)) await auth.protect();

  // Allow public access to home page and Stripe webhooks
  const publicRoutes = ["/", "/api/webhooks/stripe"];
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    // Return NextResponse.next() so middleware chain continues normally for public routes
    return NextResponse.next();
  }

  // Create a "next" response that we can modify headers on
  const response = NextResponse.next();

  // Disable caching for the leaderboard route to avoid stale HTML being served
  if (req.nextUrl.pathname.startsWith("/leaderboard")) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
