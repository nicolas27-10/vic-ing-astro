import type { APIRoute } from "astro";
import { db } from "../../data/db";

export const DELETE: APIRoute = async ({ url }) => {
    const id = url.searchParams.get("id");

    if (!id) {
        return new Response("ID del servicio no proporcionado.", { status: 400 });
    }

    try {
    // Ejecuta el DELETE desde la base de datos
    const [result]: any = await db.execute(
      "DELETE FROM servicios WHERE id = ?",
      [id]
    );

    // Verifica si se eliminó alguna fila
    if (result.affectedRows === 0) {
      return new Response("Servicio no encontrado.", { status: 404 });
    }

    return new Response("Servicio eliminado con éxito.", { status: 200 });
  } catch (error) {
    console.error("Error eliminando el servicio:", error);
    return new Response("Error eliminando el servicio.", { status: 500 });
  }
};
