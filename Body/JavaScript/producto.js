// =========================
// MOSTRAR DETALLE DEL PRODUCTO
// =========================

const z = JSON.parse(localStorage.getItem("productoSeleccionado"));
if (!z) {
  alert("Producto no encontrado.");
  window.location.href = "index.html";
}

// Mostrar datos del producto
const imagenZapa = z.image?.original || z.image?.small || z.image?.thumbnail || "img/zapa-generica.png";
document.getElementById("img-zapa").src = imagenZapa;
document.getElementById("nombre-zapa").textContent = z.name || "Sin nombre";
document.getElementById("marca-zapa").textContent = "Marca: " + (z.brand || "Desconocida");
document.getElementById("color-zapa").textContent = "Color: " + (z.colorway || "N/A");
document.getElementById("precio-zapa").textContent = "Precio: €" + (z.retailPrice || "N/A");

// Generar tallas
const genero = z.gender || "unisex";
const tallas = obtenerTallasPorGenero(genero);
const tallasGrid = document.getElementById("tallas-grid");
const tallaInput = document.getElementById("talla-seleccionada");

tallas.forEach(t => {
  const btn = document.createElement("button");
  btn.className = "talla-btn";
  btn.textContent = `${t} EU`;
  btn.addEventListener("click", () => {
    document.querySelectorAll(".talla-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    tallaInput.value = t;
  });
  tallasGrid.appendChild(btn);
});

function obtenerTallasPorGenero(genero) {
  if (genero === "child") return [28, 29, 30, 31, 32, 33, 34, 35];
  return [38, 39, 40, 41, 42, 43, 44, 45];
}

// =========================
// AÑADIR AL CARRITO
// =========================
document.getElementById("btn-cesta").addEventListener("click", () => {
  const cantidad = parseInt(document.getElementById("cantidad").value) || 1;
  const talla = document.getElementById("talla-seleccionada").value;

  if (!talla) {
    alert("Por favor selecciona una talla.");
    return;
  }

  const zapatilla = {
  name: z.name,
  retailPrice: z.retailPrice,
  talla: talla,
  cantidad: cantidad,
  image: z.image?.original || z.image?.small || z.image?.thumbnail || "img/zapa-generica.png"
};


  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const index = carrito.findIndex(p => p.name === zapatilla.name && p.talla === zapatilla.talla);

  if (index !== -1) {
    carrito[index].cantidad += cantidad;
  } else {
    carrito.push(zapatilla);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
  mostrarCarrito();
});

// =========================
// MOSTRAR CARRITO
// =========================
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
    <p>Total: €${(zapa.retailPrice * zapa.cantidad).toFixed(2)}</p>
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
  alert("Aquí irías a la página de pago o resumen de compra. 🚀");
}
