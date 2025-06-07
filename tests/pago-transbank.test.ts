import { describe, it, expect, vi } from "vitest";
import { POST } from "../src/pages/api/pagar";

function mockRequestWithBody(json: any): Request {
  return new Request("http://localhost/api/pagar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json),
  });
}

describe("API de Pago Transbank", () => {
  it("debería rechazar si falta el monto", async () => {
    const req = mockRequestWithBody({});
    const res = await POST({ request: req } as any);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toContain("Monto inválido");
  });

  it("debería rechazar si el content-type no es application/json", async () => {
    const req = new Request("http://localhost/api/pagar", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "amount=5000",
    });
    const res = await POST({ request: req } as any);
    const data = await res.json();
    expect(res.status).toBe(415);
    expect(data.error).toContain("Tipo de contenido no soportado");
  });

  it("debería crear transacción correctamente (mockeado)", async () => {
    const fakeResponse = {
      token: "mocked-token",
      url: "https://webpay3gint.transbank.cl/webpayserver/initTransaction",
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify(fakeResponse),
    });

    const req = mockRequestWithBody({ amount: 5000 });
    const res = await POST({ request: req } as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.token).toBe("mocked-token");
    expect(data.url).toContain("webpay");
  });
});
