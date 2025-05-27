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
function buscarZapatillasSoloMarcasValidas() {
  localStorage.setItem("Todo", "true");
  window.location.href = "index.html";
}


function filtrarPorGenero(genero) {
  window.location.href = `index.html?filtro=${genero}`;
}


function mostrarFavoritos() {
  localStorage.setItem("mostrarFavoritos", "true");
  window.location.href = "index.html";
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



const input = document.getElementById("marcaInput");

if (input) {
  input.addEventListener("keyup", () => {
    const marca = input.value.trim().toLowerCase();
    const MARCAS_VALIDAS = [
      "nike", "adidas", "jordan", "new balance", "converse",
      "puma", "reebok", "vans", "asics", "hoka one one",
      "crocs", "salomon", "balenciaga", "gucci",
      "alexander mcqueen", "dior", "off-white", "golden goose", "air jordan"
    ];

    if (marca && MARCAS_VALIDAS.includes(marca)) {
      localStorage.setItem("marcaBusqueda", marca);
      window.location.href = "index.html?buscar=true";
    }
  });
}



document.addEventListener("DOMContentLoaded", () => {
  const logos = document.querySelectorAll("[data-marca]");

  logos.forEach(logo => {
    logo.addEventListener("click", () => {
      const marca = logo.getAttribute("data-marca");
      if (marca) {
        localStorage.setItem("marcaBusqueda", marca.toLowerCase());
        window.location.href = "index.html";
      }
    });
  });
});




//------CARRITO--//

function mostrarCarrito() {
  const modal = document.getElementById("carrito-modal");
  const lista = document.getElementById("lista-carrito");
  const total = document.getElementById("total-carrito");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  lista.innerHTML = "";
  let suma = 0;

  if (carrito.length === 0) {
    lista.innerHTML = `<li>La cesta está vacía</li>`;
    total.textContent = "0";
  } else {
    carrito.forEach((zapa, i) => {
      const subtotal = zapa.retailPrice * zapa.cantidad;

      const item = document.createElement("li");
      item.classList.add("item-carrito");

      item.innerHTML = `
        <img src="${zapa.image}" alt="${zapa.name}">
        <div class="info-zapa-carrito">
          <strong>${zapa.name}</strong>
          <p>Talla ${zapa.talla} x ${zapa.cantidad}</p>
          <p>Total: €${subtotal.toFixed(2)}</p>
          <button onclick="eliminarDelCarrito(${i})">Quitar</button>
        </div>
      `;

      lista.appendChild(item);
      suma += subtotal;
    });

    total.textContent = suma.toFixed(2);
  }

  modal.classList.add("visible");
}

function eliminarDelCarrito(index) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  actualizarContadorCarrito();
}

function cerrarCarrito() {
  document.getElementById("carrito-modal").classList.remove("visible");
}

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const contador = document.getElementById("contador-carrito");
  if (contador) contador.textContent = total;
}

document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);

function irACesta() {
  window.location.href = "checkout.html";
}

function mostrarFavoritos() {
  localStorage.setItem("mostrarFavoritos", "true");
  window.location.href = "index.html";
}
