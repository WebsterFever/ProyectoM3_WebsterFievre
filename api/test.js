export default async function handler(req, res) {
  console.log("ruta test");
  return res.status(200).json({
    message: "Ruta de prueba funcionando correctamente",
  });
}