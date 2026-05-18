const express = require("express");
const cors = require("cors");
const path = require("path");
require('dotenv').config();
const { MercadoPagoConfig, Preference } = require("mercadopago");
 
const app = express();
app.use(express.json());
app.use(cors());
 
const client = new MercadoPagoConfig({
  accessToken: process.env.PAYMENT_ACCESS_TOKEN
});
 
// __dirname es js/, subimos un nivel para llegar a la raíz
const ROOT = path.join(__dirname, '..');
 
app.use(express.static(ROOT));
 
app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT, 'pages', 'home', 'home.html'));
});
 
app.post("/create_preference", async (req, res) => {
  try {
    const preference = new Preference(client);
 
    const itemsLimpios = req.body.items.map(item => ({
      title: item.title,
      unit_price: Number(item.unit_price),
      quantity: Number(item.quantity),
      currency_id: "COP"
    }));
 
    // En producción usa el dominio de Render; en local, localhost:3000
    const BASE_URL = process.env.BASE_URL
      || (process.env.NODE_ENV === "production"
          ? "https://e-commerce-historias-de-cafe.onrender.com"
          : "http://localhost:3000");
 
    const result = await preference.create({
      body: {
        items: itemsLimpios,
        back_urls: {
          success: `${BASE_URL}/pages/catalogo/catalogo.html`,
          failure: `${BASE_URL}/pages/catalogo/catalogo.html`,
          pending: `${BASE_URL}/pages/catalogo/catalogo.html`,
        },
        // auto_return: "approved", // redirige automáticamente si el pago fue exitoso
      },
    });
 
    console.log("¡ÉXITO! Link generado:", result.init_point);
    res.json({ init_point: result.init_point });
 
  } catch (error) {
    console.error("Error detallado en Mercado Pago:", error);
    res.status(500).json({ error: error.message });
  }
});
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const BASE_URL = process.env.BASE_URL
    || (process.env.NODE_ENV === "production"
        ? "https://e-commerce-historias-de-cafe.onrender.com"
        : `http://localhost:${PORT}`);
  console.log(`Servidor corriendo en ${BASE_URL}`);
});