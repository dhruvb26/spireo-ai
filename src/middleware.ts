import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    const token = req.nextauth.token;

    // Redirect unauthenticated users to signin page
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // Handle dashboard access
    if (path.startsWith("/dashboard")) {
      const hasAccess = token.hasAccess;

      if (!hasAccess) {
        // Redirect to payment link when trial is over and user doesn't have access
        return NextResponse.redirect(
          new URL("https://buy.stripe.com/test_3cs16B3DI68Ycve001", req.url),
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/ai/:path*",
    "/api/schedule/:path*",
    "/api/queue/:path*",
  ],
};
