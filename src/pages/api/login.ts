import type { APIRoute } from 'astro';
import bcrypt from 'bcrypt';
import { db } from '../../data/db';

export const POST: APIRoute = async ({ request, cookies }) => {
  const { username, password } = await request.json();


  const [rows]: any = await db.execute(
    'SELECT * FROM usuarios_admin WHERE username = ? LIMIT 1',
    [username]
  );

  if (!rows.length) {
    return new Response('Credenciales inválidas', { status: 401 });
  }

  const usuario = rows[0];
  const valido = await bcrypt.compare(password, usuario.password_hash);

  if (!valido) {
    return new Response('Credenciales inválidas', { status: 401 });
  }

  // Guardamos sesión simple en una cookie
  cookies.set('admin_auth', 'true', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 2, // 2 horas
  });

  return new Response('OK', { status: 200 });
};
