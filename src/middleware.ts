// src/middleware.ts
import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { pathname } = new URL(context.request.url);
  if (pathname.startsWith('/admin')) {
    const cookie = context.cookies.get('admin_session');
    if (!cookie || cookie.value !== 'ok') {
      return context.redirect('/login');
    }
  }
  return next();
};