import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoutes = createRouteMatcher([
    "/onboarding(.*)",
    "/organization(.*)",
    "/project(.*)",
    "/issue(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, orgId } = await auth();

    // If the user is not logged in and tries to access protected routes, redirect to the sign-in page
    if (!userId && isProtectedRoutes(req)) {
        await auth.protect();
    }

    // If the user is logged in but does not have an organization, redirect to onboarding
    if (
        userId &&
        !orgId &&
        req.nextUrl.pathname !== "/onboarding" &&
        req.nextUrl.pathname !== "/"
    ) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
