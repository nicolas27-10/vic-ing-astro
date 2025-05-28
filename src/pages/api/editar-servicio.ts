import type { APIRoute } from "astro";
import { db } from "../../data/db";

export const PUT: APIRoute = async ({ request }) => {
  try {
    const servicioActualizado = await request.json();

    const { nombre, descripcion, precioBase, id } = servicioActualizado;

    if (!nombre || !descripcion || typeof precioBase !== "number") {
      return new Response("Datos inválidos", { status: 400 });
    }

    const [result] = await db.execute(
      "UPDATE servicios SET nombre = ? ,descripcion = ?, precioBase = ? WHERE id = ?",
      [nombre, descripcion, precioBase, id]
    );

    // Podés verificar si realmente se actualizó algo
    if ((result as any).affectedRows === 0) {
      return new Response("Servicio no encontrado", { status: 404 });
    }

    return new Response(JSON.stringify({ mensaje: "Servicio actualizado con éxito." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error actualizando el servicio:", error);
    return new Response("Error interno del servidor", { status: 500 });
  }
};
