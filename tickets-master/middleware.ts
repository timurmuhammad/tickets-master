import createIntlMiddleware from "next-intl/middleware";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { defineRouting } from 'next-intl/routing';
import { getDomainConfig } from '@/utils/domainConfig'
import { getI18nConfig } from '@/helpers/main'

export default async function middleware(req, event) {
  const host = req.nextUrl.host;
  const pathname = req.nextUrl.pathname;

  // Authentication check with next-auth
  const authResult = await withAuth({
    callbacks: {
      authorized: ({ token }) => {
        const pathSegments = req.nextUrl.pathname.split('/');
        const containsU = pathSegments.some(segment => segment === 'u');
        return !containsU || token !== null;
      },
    },
  })(req, event);

  if (authResult) return authResult;

  // Find the current domain configuration
  const { langs, isComingSoon } = getDomainConfig({ host });

  // Handle coming soon redirect
  if (isComingSoon && pathname !== '/') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Define routing using next-intl
  const routing = defineRouting({
    ...getI18nConfig(langs),
    localePrefix: 'as-needed',
    localeDetection: false,
  });

  // Middleware to handle routing from next-intl
  const intlMiddleware = createIntlMiddleware(routing);

  // Handle locale detection and domain routing
  const intlResult = intlMiddleware(req);
  if (intlResult) {
    intlResult.headers.set("x-current-domain", host);
    return intlResult;
  }

  // Default response
  const response = NextResponse.next();
  response.headers.set("x-current-domain", host);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|static|_next|_vercel|.*\\..*).*)",
  ],
};
