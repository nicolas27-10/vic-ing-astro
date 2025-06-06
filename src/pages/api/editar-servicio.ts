import type { APIRoute } from "astro";
import { db } from "../../data/db";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

export const prerender = false;

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

export const PUT: APIRoute = async ({ request }) => {
  const form = formidable({
  multiples: false,
  uploadDir: path.join(process.cwd(), "public/uploads"),
  keepExtensions: true,
  allowEmptyFiles: true,
  minFileSize: 0,  // <-- aquí para aceptar archivos vacíos sin error
});

  fs.mkdirSync(path.join(process.cwd(), "public/uploads"), { recursive: true });

  return new Promise((resolve) => {
    const compatibleReq = buildCompatibleRequest(request);

    form.parse(compatibleReq, async (err, fields, files) => {
      if (err) {
        console.error("Error al parsear el formulario:", err);
        return resolve(new Response("Error al procesar datos", { status: 400 }));
      }

      const id = fields.id?.toString();
      let nombre = fields.nombre?.toString().trim();
      const descripcion = fields.descripcion?.toString().trim();
      const precioBase = parseInt(fields.precioBase?.toString() || "0", 10);
      const imagenActual = fields.imagenActual?.toString() || "";

      function capitalizarPrimeraLetra(str: string): string {
        if (!str) {
          return str; 
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
      nombre = capitalizarPrimeraLetra(nombre);

      if (!id || !nombre || !descripcion || isNaN(precioBase)) {
        return resolve(new Response("Datos inválidos", { status: 400 }));
      }

      const [rows] = await db.execute("SELECT imagen FROM servicios WHERE id = ?", [id]);
      const servicio = (rows as any[])[0];

      if (!servicio) {
        return resolve(new Response("Servicio no encontrado", { status: 404 }));
      }

      let rutaImagen = servicio.imagen || imagenActual; // Por si acaso usa imagenActual si DB está vacía

      // Procesar nueva imagen si se subió y tiene tamaño > 0
      let nuevaImagen = files.imagen;
      if (Array.isArray(nuevaImagen)) {
        nuevaImagen = nuevaImagen[0];
      }

      if (nuevaImagen && nuevaImagen.size > 0 && nuevaImagen.newFilename) {
        // Si había imagen anterior, eliminarla
        if (rutaImagen) {
          const oldPath = path.join(process.cwd(), "public", rutaImagen);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
            console.log("Imagen anterior eliminada:", oldPath);
          }
        }
        rutaImagen = `/uploads/${nuevaImagen.newFilename}`;
        console.log("Nueva imagen subida:", rutaImagen);
      } else {
        // No se subió imagen nueva, conservar la actual
        console.log("No se subió nueva imagen. Se conserva la actual:", rutaImagen);
      }

      const [result]: any = await db.execute(
        "UPDATE servicios SET nombre = ?, descripcion = ?, precioBase = ?, imagen = ? WHERE id = ?",
        [nombre, descripcion, precioBase, rutaImagen, id]
      );

      if (result.affectedRows === 0) {
        return resolve(new Response("No se actualizó el servicio", { status: 404 }));
      }

      return resolve(
        new Response(
          JSON.stringify({
            mensaje: "Servicio actualizado con éxito.",
            nuevaImagen: rutaImagen,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        )
      );
    });
  });
};
