import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoutes = createRouteMatcher([
    "/onboarding(.*)",
    "/organization(.*)",
    "/project(.*)",
    "/issue(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
    // if user is logged out and trying to access protected route then redirect it to signin page.
    if (!(await auth()).userId && isProtectedRoutes(req)) {
        return (await auth()).redirectToSignIn();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
