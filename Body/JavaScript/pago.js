
// Verificar si el usuario está logeado


document.addEventListener("DOMContentLoaded", async () => {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const resumenZapatillas = document.getElementById("resumen-zapatillas");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");

  let total = 0;
  resumenZapatillas.innerHTML = "";

  carrito.forEach(item => {
    const div = document.createElement("div");
    div.className = "item-checkout";

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-checkout-info">
        <p><strong>${item.name}</strong></p>
        <p>Talla ${item.talla} X ${item.cantidad}</p>
        <p>Precio unitario: €${item.retailPrice}</p>
        <p>Total: €${(item.retailPrice * item.cantidad).toFixed(2)}</p>
      </div>
    `;

    resumenZapatillas.appendChild(div);
    total += item.retailPrice * item.cantidad;
  });

  subtotalEl.textContent = `€${total.toFixed(2)}`;
  totalEl.textContent = `€${total.toFixed(2)}`;

  const stripe = Stripe("pk_test_51RReWT4J9OJ26E30jZS8V9deHVLiNr1OaFPCstlcYEsFekSQWugiLswFcdTPrtbnqRobpwHv374gDuICeK6lHb56001gBdDFpT");
  const elements = stripe.elements();
  const card = elements.create("card");
  card.mount("#card-element");

  document.getElementById("pagar").onclick = async () => {
    const resultado = document.getElementById("resultado");
    resultado.textContent = "Procesando...";

    const amountInCents = Math.round(total * 100);

    try {
      const res = await fetch("https://stepup-proyect.onrender.com/payment/pay/sneakers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInCents })
      });

      if (!res.ok) throw new Error("Error en la comunicación con el servidor.");

      const data = await res.json();
      if (!data.clientSecret) throw new Error("No se recibió clientSecret del backend.");

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: card }
      });

      if (result.error) {
        resultado.textContent = " Error: " + result.error.message;
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        resultado.textContent = "✅ ¡Pago exitoso! Generando factura...";

        const emailCliente = localStorage.getItem("usuarioLogeado"); //si prefieres mantener esta clave
        if (!emailCliente) {
          resultado.textContent = " No se encontró el correo del cliente.";
          return;
        }

        const pedido = carrito.map(item => ({
          productCode: item.productCode || "product1", // Asegurate de tener el sku real
          amount: item.cantidad,
          price: item.retailPrice,
          description: item.name
        }));

        try {
          const resPedido = await fetch(`https://stepup-proyect.onrender.com/order?email=${emailCliente}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
          });

          if (!resPedido.ok) throw new Error("No se pudo guardar el pedido.");

          resultado.textContent = "✅ Factura enviada al correo. Redirigiendo...";
          localStorage.removeItem("carrito");
          setTimeout(() => window.location.href = "gracias.html", 3000);

        } catch (err) {
          console.error("Error al guardar pedido:", err);
          resultado.textContent = "✅ Pago exitoso, pero hubo un error al guardar el pedido.";
        }
      } else {
        resultado.textContent = "Estado de pago inesperado.";
      }

    } catch (error) {
      console.error("Error en el proceso de pago:", error);
      resultado.textContent = "Error al procesar el pago.";
    }
  };
});