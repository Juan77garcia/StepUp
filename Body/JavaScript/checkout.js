// =========================
// CARGAR CARRITO EN CHECKOUT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const container = document.getElementById("cart-items");
  const subtotal = document.getElementById("subtotal");
  const total = document.getElementById("total");

  if (carrito.length === 0) {
    container.innerHTML = "<p>Tu cesta está vacía 🚖</p>";
    subtotal.textContent = "0.00";
    total.textContent = "0.00";
    return;
  }

  let suma = 0;

  carrito.forEach((zapa, i) => {
    const div = document.createElement("div");
    div.className = "item";

    const img = document.createElement("img");
    img.src = zapa.image || "img/no-image.png";
    img.alt = zapa.name;

    const info = document.createElement("div");
    info.className = "item-info";
    info.innerHTML = `
      <h3>${zapa.name}</h3>
      <p><strong>Marca:</strong> ${zapa.brand || "Desconocida"}</p>
      <p><strong>Precio:</strong> €${zapa.retailPrice || 0}</p>
      <p><strong>Talla:</strong> ${zapa.talla}</p>
      <label><strong>Cantidad:</strong>
        <input type="number" min="1" value="${zapa.cantidad}" data-index="${i}" class="cantidad-input" />
      </label>
      <p><strong>Total:</strong> €${(zapa.retailPrice * zapa.cantidad).toFixed(2)}</p>
    `;

    div.appendChild(img);
    div.appendChild(info);
    container.appendChild(div);

    suma += zapa.retailPrice * zapa.cantidad;
  });

  subtotal.textContent = suma.toFixed(2);
  total.textContent = suma.toFixed(2);

  // Cambiar cantidad
  document.querySelectorAll(".cantidad-input").forEach(input => {
    input.addEventListener("change", (e) => {
      const index = e.target.dataset.index;
      const nuevaCantidad = parseInt(e.target.value);

      if (nuevaCantidad < 1 || isNaN(nuevaCantidad)) return;

      carrito[index].cantidad = nuevaCantidad;
      localStorage.setItem("carrito", JSON.stringify(carrito));
      location.reload();
    });
  });
});

// =========================
// FINALIZAR COMPRA
// =========================
function finalizarCompra() {
  const total = document.getElementById("total").textContent.replace("€", "").trim();
  localStorage.setItem("totalFinal", total); // guarda el total si quieres usarlo en pago.html

  window.location.href = `pago.html?total=${total}`;
}


// =========================
// FUNCIONES DE NAVEGACIÓN COMO EN PRODUCTO
// =========================
function mostrarInicio() {
  window.location.href = "index.html";
}

function filtrarPorGenero(genero) {
  window.location.href = `index.html?filtro=${genero}`;
}

function buscarZapatillasSoloMarcasValidas() {
  window.location.href = "index.html?todo=true";
}

function mostrarFavoritos() {
  window.location.href = "index.html?favoritos=true";
}

// =========================
// MARCAS FUNCIONALES EN CHECKOUT
// =========================

document.addEventListener("DOMContentLoaded", () => {
  const logos = document.querySelectorAll(".grid-marcas img");
  logos.forEach(logo => {
    logo.addEventListener("click", () => {
      const marca = logo.getAttribute("data-marca");
      if (marca) {
        window.location.href = `index.html?marca=${encodeURIComponent(marca.toLowerCase())}`;
      }
    });
  });
});
