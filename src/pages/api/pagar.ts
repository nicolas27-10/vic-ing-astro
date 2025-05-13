
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    // Validar que el content-type sea JSON
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return new Response(JSON.stringify({ error: "Tipo de contenido no soportado. Esperado: application/json" }), {
        status: 415,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const amount = parseInt(body?.amount, 10);

    // Validar el monto recibido
    if (!amount || isNaN(amount) || amount <= 0) {
      return new Response(JSON.stringify({ error: "Monto inválido o no enviado" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Credenciales de prueba de Transbank (Webpay REST)
    const API_KEY = "597055555532"; // Código de comercio de pruebas
    const API_SECRET = "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C"; // Clave secreta de pruebas
    const TBK_API_URL = "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions";

    
    const buy_order = `orden_${Date.now()}`;
    const session_id = crypto.randomUUID();
    const return_url = "http://localhost:4321/retorno"; 

    const tbkBody = {
      buy_order,
      session_id,
      amount,
      return_url,
    };

    console.log("Enviando a Transbank:", tbkBody);
    
    const tbkRes = await fetch(TBK_API_URL, {
      method: "POST",
      headers: {
        "Tbk-Api-Key-Id": API_KEY,
        "Tbk-Api-Key-Secret": API_SECRET,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tbkBody),
    });

    
    const tbkText = await tbkRes.text();
    let tbkData: any = {};
    if (tbkText) {
      try {
        tbkData = JSON.parse(tbkText);
      } catch (e) {
        console.error("Respuesta de Transbank no es JSON válido:", tbkText);
      }
    }

    if (!tbkRes.ok) {
      console.error("Error desde Transbank:", tbkData);
      return new Response(JSON.stringify({ error: "Error al crear transacción con Transbank" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Retornar el token y URL para redirigir al usuario a Webpay
    if (tbkData.token && tbkData.url) {
      return new Response(JSON.stringify({
        token: tbkData.token,
        url: tbkData.url,
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      console.error("Respuesta de Transbank incompleta:", tbkData);
      return new Response(JSON.stringify({
        error: tbkData.error || "No se pudo obtener token o URL de pago de Transbank.",
        detalle: tbkData
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

  } catch (error) {
    console.error("Error procesando pago:", error);
    return new Response(JSON.stringify({ error: "Cuerpo JSON inválido o vacío" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};
