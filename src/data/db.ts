import mysql from "mysql2/promise";

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