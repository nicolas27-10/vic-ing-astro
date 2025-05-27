import type { APIRoute } from "astro";
import { db } from "../../data/db";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const nombre = formData.get("nombre")?.toString().trim();
    const descripcion = formData.get("descripcion")?.toString().trim();
    const precioBase = parseInt(formData.get("precioBase") as string, 10);

    if (!nombre || !descripcion || isNaN(precioBase)) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: `/admin?mensaje=Datos incompletos o inválidos.&tipo=error`,
        },
      });
    }

    // Verificar si el servicio ya existe
    const [rows] = await db.execute(
      "SELECT id FROM servicios WHERE nombre = ?",
      [nombre]
    );

    if ((rows as any[]).length > 0) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: `/admin?mensaje=El servicio ya existe, no se puede agregar.&tipo=error`,
        },
      });
    }

    // Insertar nuevo servicio
    await db.execute(
      "INSERT INTO servicios (nombre, descripcion, precio) VALUES (?, ?, ?)",
      [nombre, descripcion, precioBase]
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: `/admin?mensaje=El servicio se ha agregado correctamente.&tipo=exito`,
      },
    });
  } catch (error) {
    console.error("Error guardando en la base de datos:", error);
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/admin?mensaje=Error guardando el servicio en la base de datos.&tipo=error`,
      },
    });
  }
};
