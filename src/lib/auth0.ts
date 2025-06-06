import { getSession } from '@auth0/nextjs-auth0';

export const auth0 = {
  getSession,
  authorizationParameters: {
    response_type: 'code',
    scope: 'openid profile email'
  }
}; 