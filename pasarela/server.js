const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();

// Reemplaza con tu clave secreta de Stripe
const stripe = Stripe('sk_test_TU_CLAVE_SECRETA');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de base de datos
const db = new sqlite3.Database('./pagos.db');
db.run(`CREATE TABLE IF NOT EXISTS pagos (
  id TEXT PRIMARY KEY,
  monto INTEGER,
  moneda TEXT,
  fecha TEXT
)`);

app.post('/pagar', async (req, res) => {
  const { paymentMethodId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // en centavos
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });

    const fecha = new Date().toISOString();
    db.run(
      `INSERT INTO pagos (id, monto, moneda, fecha) VALUES (?, ?, ?, ?)`,
      [paymentIntent.id, paymentIntent.amount, paymentIntent.currency, fecha]
    );

    res.send({ message: 'Pago exitoso', id: paymentIntent.id });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
