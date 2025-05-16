import type { APIRoute } from "astro";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.resolve("src/data/servicios.json");

export const DELETE: APIRoute = async ({ url }) => {
    const id = url.searchParams.get("id");

    if (!id) {
        return new Response("ID del servicio no proporcionado.", { status: 400 });
    }9

    try {
        console.log("ID del servicio a eliminar:", id);
        // Leer archivo existente
        const jsonData = await fs.readFile(DATA_PATH, "utf-8");
        const servicios = JSON.parse(jsonData);

        // Buscar y eliminar el servicio
        const serviciosActualizados = servicios.filter((servicio) => servicio.nombre !== id);

        if (servicios.length === serviciosActualizados.length) {
            return new Response("Servicio no encontrado.", { status: 404 });
        }

        // Guardar los servicios actualizados
        await fs.writeFile(DATA_PATH, JSON.stringify(serviciosActualizados, null, 2), "utf-8");

        return new Response("Servicio eliminado con éxito.", { status: 200 });
    } catch (error) {
        console.error("Error eliminando el servicio:", error);
        return new Response("Error eliminando el servicio.", { status: 500 });
    }
};
