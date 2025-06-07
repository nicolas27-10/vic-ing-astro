import fs from "fs";
import path from "path";

export function limpiarArchivosBasura() {
  const dir = path.join(process.cwd(), "public/uploads");
  const archivos = fs.readdirSync(dir);

  for (const archivo of archivos) {
    const fullPath = path.join(dir, archivo);

    // Elimina archivos sin extensión (probablemente temporales)
    if (!path.extname(archivo)) {
      fs.unlinkSync(fullPath);
      console.log("Archivo temporal eliminado:", archivo);
    }
  }
}
