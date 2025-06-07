
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { editarServicioEnDB } from "../src/lib/editarServicio";
import { db } from "../src/data/db";

let servicioId: string;

beforeAll(async () => {
  const [result]: any = await db.execute(
    "INSERT INTO servicios (nombre, descripcion, precioBase, imagen) VALUES (?, ?, ?, ?)",
    ["ServicioTemporal", "Descripción temporal", 10000, "/uploads/temporal.jpg"]
  );
  servicioId = result.insertId;
});

afterAll(async () => {
  await db.execute("DELETE FROM servicios WHERE id = ?", [servicioId]);
});

describe("editarServicioEnDB", () => {
  it("debe editar correctamente un servicio existente", async () => {
    const nuevoNombre = "Servicio Editado";
    const nuevaDescripcion = "Descripción editada";
    const nuevoPrecio = 15000;
    const nuevaImagen = "/uploads/editado.jpg";

    const result = await editarServicioEnDB({
      id: servicioId.toString(),
      nombre: nuevoNombre,
      descripcion: nuevaDescripcion,
      precioBase: nuevoPrecio,
      rutaImagen: nuevaImagen,
    });

    expect(result.mensaje).toBe("Servicio actualizado con éxito.");
    expect(result.nuevaImagen).toBe(nuevaImagen);

    const [rows]: any = await db.execute("SELECT * FROM servicios WHERE id = ?", [servicioId]);
    expect(rows[0].nombre).toBe(nuevoNombre);
    expect(rows[0].descripcion).toBe(nuevaDescripcion);
    expect(rows[0].precioBase).toBe(nuevoPrecio);
    expect(rows[0].imagen).toBe(nuevaImagen);
  });
});
