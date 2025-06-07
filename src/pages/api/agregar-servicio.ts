import type { APIRoute } from "astro";
import { db } from "../../data/db";
import formidable, { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

// Desactiva el prerendering
export const prerender = false;

// Convierte el Request en un ReadableStream con headers válidos para formidable
function buildCompatibleRequest(req: Request): any {
  const contentType = req.headers.get("content-type") || "";
  const contentLength = req.headers.get("content-length") || "";

  const reader = req.body?.getReader();
  const stream = new Readable({
    async read() {
      if (!reader) return this.push(null);
      const { done, value } = await reader.read();
      if (done) this.push(null);
      else this.push(value);
    },
  });

  return Object.assign(stream, {
    headers: {
      "content-type": contentType,
      "content-length": contentLength,
    },
  });
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const uploadDir = path.join(process.cwd(), "public/uploads");
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
  });

  const compatibleReq = buildCompatibleRequest(request);

  return new Promise((resolve) => {
    form.parse(compatibleReq, async (err, fields, files) => {
      if (err) {
        console.error("Error al parsear el formulario:", err);
        return resolve(
          redirect("/admin?mensaje=Error al subir imagen.&tipo=error", 302)
        );
      }

      let nombre = fields.nombre?.toString().trim();
      const descripcion = fields.descripcion?.toString().trim();
      const precio = parseInt(fields.precio?.toString() || "", 10);
      const imagen = files.imagen;

      function capitalizarPrimeraLetra(str: string): string {
        if (!str) {
          return str; 
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
      nombre = capitalizarPrimeraLetra(nombre);

      console.log("imagen recibida:", imagen);

      if (!nombre || !descripcion || isNaN(precio)) {
        return resolve(
          redirect("/admin?mensaje=Datos incompletos.&tipo=error", 302)
        );
      }

      const [rows] = await db.execute("SELECT id FROM servicios WHERE nombre = ?", [nombre]);

      if ((rows as any[]).length > 0) {
        return resolve(
          redirect("/admin?mensaje=Servicio ya existe.&tipo=error", 302)
        );
      }

      let rutaImagen = null;

      if (imagen) {
        const archivo = Array.isArray(imagen) ? imagen[0] : imagen;

        console.log("Archivo procesado:", archivo);

        if (archivo.newFilename) {
          rutaImagen = `/uploads/${archivo.newFilename}`;
        }
      }

      console.log("imangen subida:", rutaImagen);
      await db.execute(
        "INSERT INTO servicios (nombre, descripcion, precioBase, imagen) VALUES (?, ?, ?, ?)",
        [nombre, descripcion, precio, rutaImagen]
      );

      return resolve(
        redirect("/admin?mensaje=Servicio agregado con imagen.&tipo=exito", 302)
      );
    });
  });
};

export async function handleAgregarServicio({ nombre, descripcion, precioBase }: {
  nombre: string;
  descripcion: string;
  precioBase: string;
}) {
  if (!nombre || !descripcion || !precioBase) {
    return new Response("Campos requeridos faltantes", { status: 400 });
  }

  // Simula inserción exitosa
  return new Response("Servicio agregado", { status: 200 });
}

