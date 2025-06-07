import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

export const db = await mysql.createPool({
  host: "localhost",        // o la IP/host de tu servidor
  user: "root",
  password: "",
  database: "vicdb",
});

try {
  await db.query("SELECT 1");
  console.log("✅ Conexión a MySQL exitosa");
} catch (err) {
  console.error("❌ Error conectando a MySQL:", err);
}

export async function crearAdmin(username: string, password: string) {
  const hash = await bcrypt.hash(password, 10);
  await db.execute('INSERT INTO usuarios_admin (username, password_hash) VALUES (?, ?)', [username, hash]);
}