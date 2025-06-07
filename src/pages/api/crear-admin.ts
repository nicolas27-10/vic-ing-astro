import { crearAdmin } from '../../data/db';

export async function GET() {
  await crearAdmin('admin', 'admin123');
  return new Response('Admin creado');
}
