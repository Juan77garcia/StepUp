// Obtener producto desde localStorage
const z = JSON.parse(localStorage.getItem("productoSeleccionado"));

// Si no existe, redirige
if (!z) {
  alert("Producto no encontrado.");
  window.location.href = "index.html";
}

// Mostrar imagen
const imagenZapa = z.image?.original || z.image?.small || z.image?.thumbnail;
const imgEl = document.getElementById("img-zapa");
if (imagenZapa) {
  imgEl.src = imagenZapa;
  imgEl.alt = z.name;
} else {
  imgEl.alt = "Imagen no disponible";
}

// Mostrar datos
document.getElementById("nombre-zapa").textContent = z.name || "Sin nombre";
document.getElementById("marca-zapa").textContent = "Marca: " + (z.brand || "Desconocida");
document.getElementById("color-zapa").textContent = "Color: " + (z.colorway || "N/A");
document.getElementById("precio-zapa").textContent = "Precio: €" + (z.retailPrice || "N/A");

// Generar botones de talla
const genero = z.gender || "unisex";
const tallas = obtenerTallasPorGenero(genero);
const tallasGrid = document.getElementById("tallas-grid");
const tallaInput = document.getElementById("talla-seleccionada");

tallas.forEach(t => {
  const btn = document.createElement("button");
  btn.className = "talla-btn";
  btn.textContent = `${t} EU`;
  btn.addEventListener("click", () => {
    // Quitar selección anterior
    document.querySelectorAll(".talla-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    tallaInput.value = t;
  });
  tallasGrid.appendChild(btn);
});







// Añadir al carrito
document.getElementById("btn-cesta").addEventListener("click", () => {
  const talla = tallaInput.value;
  const cantidad = parseInt(document.getElementById("cantidad").value);

  if (!talla || cantidad < 1) {
    return;
  }

  const producto = {
    ...z,
    talla,
    cantidad
  };

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));

  actualizarContadorCarrito(); // 👈 esto actualiza el número al lado del 🛒

});


// Función para tallas según género
function obtenerTallasPorGenero(genero) {
  if (genero === "child") return [28, 29, 30, 31, 32, 33, 34, 35, 36];
  return [38, 39, 40, 41, 42, 43, 44, 45, 46, 47];
}

function mostrarCarrito() {
  const modal = document.getElementById("carrito-modal");
  const lista = document.getElementById("lista-carrito");
  const total = document.getElementById("total-carrito");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  lista.innerHTML = "";

  if (carrito.length === 0) {
    lista.innerHTML = `<p class="vacio">La cesta está vacía</p>`;
    total.textContent = "0";
  } else {
    let suma = 0;
    carrito.forEach((zapa, i) => {
      const item = document.createElement("li");
      item.innerHTML = `
        ${zapa.name} - €${zapa.retailPrice || 0}
        <button onclick="eliminarDelCarrito(${i})">X</button>
      `;
      lista.appendChild(item);
      suma += zapa.retailPrice || 0;
    });
    total.textContent = suma.toFixed(2);
  }

  modal.classList.add("visible");
}

function cerrarCarrito() {
  document.getElementById("carrito-modal").classList.remove("visible");
}

function eliminarDelCarrito(index) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  actualizarContadorCarrito();
}

function añadirAlCarrito(zapatilla) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push(zapatilla);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
  mostrarCarrito(); // Mostrar de inmediato
}

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contador = document.getElementById("contador-carrito");
  if (contador) {
    contador.textContent = carrito.length;
  }
}

function irACesta() {
  alert("Aquí irías a la página de pago o resumen de compra. 🚀");
  // window.location.href = "cesta.html"; // si tienes página
}



// =========================
// Favoritos
// =========================

function mostrarFavoritos() {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  ocultarHero();
  mostrarFiltros();

  if (favoritos.length === 0) {
    document.getElementById("resultado").innerHTML = "<p>No tienes favoritos aún.</p>";
    return;
  }

  mostrarZapatillas(favoritos);
}

function esFavorito(zapatilla) {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  return favoritos.some(f => f.name === zapatilla.name);
}

function toggleFavorito(zapatilla) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const index = favoritos.findIndex(f => f.name === zapatilla.name);
  if (index > -1) {
    favoritos.splice(index, 1);
  } else {
    favoritos.push(zapatilla);
  }
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  mostrarZapatillas(zapatillasCargadas);
}


