import type { APIRoute } from 'astro';
import bcrypt from 'bcrypt';
import { db } from '../../data/db';

export const POST: APIRoute = async ({ request, cookies }) => {
  const { username, password } = await request.json();

  if (!username || !password) {
    return new Response('Faltan credenciales', { status: 400 });
  }
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
  cookies.set('admin_session', 'ok', {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    maxAge: 60 * 30, // 2 horas
  });

  console.log(cookies.get('admin_session'));

  console.log('Usuario autenticado:', usuario.username);
  return new Response('Login exitoso', { status: 200 });
};
