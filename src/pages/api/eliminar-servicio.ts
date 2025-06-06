import type { APIRoute } from "astro";
import { db } from "../../data/db";
import fs from "fs";
import path from "path";

export const DELETE: APIRoute = async ({ url }) => {
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response("ID del servicio no proporcionado.", { status: 400 });
  }

  try {
    // Obtener la ruta de la imagen del servicio
    const [rows] = await db.execute("SELECT imagen FROM servicios WHERE id = ?", [id]);
    const servicio = (rows as any[])[0];

    if (!servicio) {
      return new Response("Servicio no encontrado.", { status: 404 });
    }

    // Eliminar imagen si existe
    if (servicio.imagen) {
      const imagenPath = path.join(process.cwd(), "public", servicio.imagen);
      if (fs.existsSync(imagenPath)) {
        fs.unlinkSync(imagenPath);
        console.log("Imagen eliminada:", imagenPath);
      }
    }

    // Eliminar el servicio de la base de datos
    const [result]: any = await db.execute(
      "DELETE FROM servicios WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return new Response("Servicio no encontrado.", { status: 404 });
    }

    return new Response("Servicio eliminado con éxito.", { status: 200 });
  } catch (error) {
    console.error("Error eliminando el servicio:", error);
    return new Response("Error eliminando el servicio.", { status: 500 });
  }
};
