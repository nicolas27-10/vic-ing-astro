
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const token = formData.get('token_ws');

  const response = await fetch(`https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`, {
    method: 'PUT',
    headers: {
      'Tbk-Api-Key-Id': '597055555532',
      'Tbk-Api-Key-Secret': '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
    },
  });

  const text = await response.text();
  let result = {};
  if (text) {
    try {
      result = JSON.parse(text);
    } catch (e) {
      result = { error: 'Respuesta de Transbank no es JSON válido', raw: text };
    }
  }

  let mensaje = '';
  const estado = typeof result === 'object' && result !== null && 'status' in result ? (result as any).status : undefined;
  if (estado === 'AUTHORIZED') {
    mensaje = '<h1 style="color:green">Transacción exitosa</h1>';
  } else {
    mensaje = `<h1 style="color:red">Transacción rechazada o fallida</h1><p>Estado: ${estado || 'desconocido'}</p>`;
  }

  return new Response(`
    <html>
      <body style="font-family:sans-serif;text-align:center;margin-top:50px;">
        ${mensaje}
        <pre style="text-align:left;max-width:600px;margin:2rem auto 0;background:#f4f4f4;padding:1rem;border-radius:8px;overflow-x:auto;">${JSON.stringify(result, null, 2)}</pre>
      </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
};
