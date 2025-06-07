import { describe, test, expect } from 'vitest';
import { handleAgregarServicio } from '../src/pages/api/agregar-servicio';

describe('API agregar-servicio (unit)', () => {
  test('debe rechazar si faltan campos', async () => {
    const result = await handleAgregarServicio({
      nombre: '',
      descripcion: '',
      precioBase: '',
    });

    expect(result.status).toBe(400);
    const texto = await result.text();
    expect(texto).toContain('Campos requeridos faltantes');
  });

  test('debe aceptar si todos los campos están completos', async () => {
    const result = await handleAgregarServicio({
      nombre: 'Test',
      descripcion: 'Servicio de prueba',
      precioBase: '1000',
    });

    expect(result.status).toBe(200);
    const texto = await result.text();
    expect(texto).toBe('Servicio agregado');
  });
});
