const express = require("express");
const cors = require("cors");
require('dotenv').config({ path: '../.env' });
console.log("Token cargado:", process.env.PAYMENT_ACCESS_TOKEN ? "SÍ" : "NO");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();
app.use(express.json());
app.use(cors());


const client = new MercadoPagoConfig({
  accessToken: process.env.PAYMENT_ACCESS_TOKEN
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

    const result = await preference.create({
      body: {
        items: req.body.items,
        back_urls: {
          success: "http://127.0.0.1:5502/pages/catalogo/catalogo.html",
          failure: "http://127.0.0.1:5502/pages/catalogo/catalogo.html",
          pending: "http://127.0.0.1:5502/pages/catalogo/catalogo.html",
        },
      },
    });

    console.log("¡ÉXITO! Link generado:", result.init_point);
    res.json({ init_point: result.init_point });
  } catch (error) {
    console.error("Error detallado en Mercado Pago:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
