import createMiddleware from 'next-intl/middleware';

import { defaultLocale, localePrefix, locales } from '../i18n';

import { type MiddlewareFactory } from './compose-middlewares';

const intlMiddleware = createMiddleware({
  locales,
  localePrefix,
  defaultLocale,
  localeDetection: true,
});

export const withIntl: MiddlewareFactory = (next) => {
  return async (request, event) => {
    const intlResponse = intlMiddleware(request);

    // If intlMiddleware redirects, return it immediately
    if (intlResponse.redirected) {
      return intlResponse;
    }

    // Extract locale from intlMiddleware response
    const locale = intlResponse.headers.get('x-middleware-request-x-next-intl-locale') ?? '';

    request.headers.set('x-bc-locale', locale);

    // Continue the middleware chain
    const response = await next(request, event);

    // Copy headers from intlResponse to response, excluding 'x-middleware-rewrite'
    intlResponse.headers.forEach((v, k) => {
      if (k !== 'x-middleware-rewrite') {
        response?.headers.set(k, v);
      }
    });

    return response;
  };
};
