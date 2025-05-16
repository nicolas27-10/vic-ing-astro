// src/pages/api/agregar-servicio.ts
import type { APIRoute } from "astro";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.resolve("src/data/servicios.json");

export const POST: APIRoute = async ({ request, redirect }) => {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });

    try {
        await fs.access(DATA_PATH);
    } catch {
        await fs.writeFile(DATA_PATH, "[]", "utf-8");
    }

    const formData = await request.formData();

    const nuevoServicio = {
        nombre: formData.get("nombre"),
        descripcion: formData.get("descripcion"),
        precioBase: parseInt(formData.get("precioBase") as string, 10),
    };

    try {
        let data = [];

        // Leer archivo existente
        try {
            const jsonData = await fs.readFile(DATA_PATH, "utf-8");
            data = JSON.parse(jsonData);
        } catch (err) {
            console.log("Archivo no encontrado, se creará uno nuevo.");
        }

        // Verificar si el servicio ya existe
        const servicioExistente = data.find((servicio) => servicio.nombre === nuevoServicio.nombre);
        if (servicioExistente) {
            // Redirigir con mensaje de error
            return new Response(null, {
                status: 302,
                headers: {
                    Location: `/admin?mensaje=El servicio ya existe, no se puede agregar.&tipo=error`,
                },
            });
        } else {
            data.push(nuevoServicio);
        }

        // Guardar el nuevo servicio
        await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");

        // Redirigir con mensaje de éxito
        return new Response(null, {
            status: 302,
            headers: {
                Location: `/admin?mensaje=El servicio se ha agregado correctamente.&tipo=exito`,
            },
        });
    } catch (error) {
        console.error("Error guardando el servicio:", error);
        // Redirigir con mensaje de error
        return new Response(null, {
            status: 302,
            headers: {
                Location: `/admin?mensaje=Error guardando el servicio.&tipo=error`,
            },
        });
    }
};
