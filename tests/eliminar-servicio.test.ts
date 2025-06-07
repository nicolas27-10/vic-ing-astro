import { describe, test, expect } from 'vitest';
import { DELETE } from '../src/pages/api/eliminar-servicio';

describe('API eliminar-servicio', () => {
  test('debe fallar si no se proporciona ID', async () => {
    const fakeUrl = new URL('http://localhost/api/eliminar-servicio');

    const result = await DELETE({ url: fakeUrl } as any);
    const text = await result.text();

    expect(result.status).toBe(400);
    expect(text).toContain('ID del servicio no proporcionado');
  });
});
