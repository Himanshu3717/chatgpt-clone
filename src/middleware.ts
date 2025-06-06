import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    '/chat/:path*',
    '/api/chat/:path*',
    '/api/trpc/:path*'
  ]
}; 