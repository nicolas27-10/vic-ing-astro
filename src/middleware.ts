// src/middleware.ts
import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url);
  if (url.pathname.startsWith('/admin')) {
    const cookie = context.cookies.get('admin_auth');
    if (!cookie || cookie.value !== 'true') {
      return context.redirect('/login');
    }
  }

  return next();
};
export const onError: MiddlewareHandler = async (context, error) => {
  console.error('Error en middleware:', error);
  return new Response('Internal Server Error', { status: 500 });
};