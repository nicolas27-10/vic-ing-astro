
import { db } from "../data/db";

export async function editarServicioEnDB({
  id,
  nombre,
  descripcion,
  precioBase,
  rutaImagen
}: {
  id: string;
  nombre: string;
  descripcion: string;
  precioBase: number;
  rutaImagen: string | null;
}) {
  if (!id || !nombre || !descripcion || isNaN(precioBase)) {
    throw new Error("Datos inválidos");
  }

  const [rows] = await db.execute("SELECT id FROM servicios WHERE id = ?", [id]);
  const servicio = (rows as any[])[0];

  if (!servicio) {
    throw new Error("Servicio no encontrado");
  }

  const [result]: any = await db.execute(
    "UPDATE servicios SET nombre = ?, descripcion = ?, precioBase = ?, imagen = ? WHERE id = ?",
    [nombre, descripcion, precioBase, rutaImagen, id]
  );

  if (result.affectedRows === 0) {
    throw new Error("No se actualizó el servicio");
  }

  return {
    mensaje: "Servicio actualizado con éxito.",
    nuevaImagen: rutaImagen,
  };
}
