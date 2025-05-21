// =========================
// Marcas válidas para búsqueda rápida
// =========================
const MARCAS_VALIDAS = [
  "nike", "adidas", "jordan", "new balance", "converse",
  "puma", "reebok", "vans", "asics", "hoka one one"
  , "crocs", "salomon", "balenciaga", "gucci",
  "alexander mcqueen", "dior", "off-white","golden goose"
];

let zapatillasCargadas = []; // Se guarda el resultado de la última búsqueda para usar en favoritos o carrito

// =========================
// Búsqueda por input
// =========================
const input = document.getElementById("marcaInput");
input.addEventListener("keyup", () => {
  const marca = input.value.trim().toLowerCase();
  if (marca && MARCAS_VALIDAS.includes(marca)) {
    ocultarHero();
    mostrarFiltros();
    buscarZapatillas([{ nameField: "brand", value: marca }]);
  }
});

// =========================
// Mostrar/Ocultar secciones
// =========================

function mostrarInicio() {
  document.getElementById("hero-container").classList.remove("hidden");
  document.getElementById("filtros").classList.add("oculto-en-inicio");
  document.getElementById("resultado").innerHTML = "";
}

function ocultarHero() {
  document.getElementById("hero-container").classList.add("hidden");
  document.getElementById("filtros").classList.remove("oculto-en-inicio");
}

function mostrarFiltros() {
  document.getElementById("filtros").classList.remove("oculto-en-inicio");
}

// =========================
// Filtros dinámicos
// =========================

function filtrarPorGenero(genero) {
  ocultarHero();
  buscarZapatillas([
    { nameField: "gender", value: genero },
    ...MARCAS_VALIDAS.map(m => ({ nameField: "brand", value: m }))
  ]);
}

function buscarZapatillasSoloMarcasValidas() {
  ocultarHero();
  const criterios = MARCAS_VALIDAS.map(marca => ({
    nameField: "brand",
    value: marca
  }));
  buscarZapatillas(criterios);
}

function aplicarFiltros() {
  ocultarHero();

  const marca = document.getElementById("marcaFiltro").value.trim();
  const precioMin = parseInt(document.getElementById("precioMin").value);
  const precioMax = parseInt(document.getElementById("precioMax").value);

  const criterios = [];

  // Si se ha seleccionado una marca válida
  if (marca) {
    criterios.push({ nameField: "brand", value: marca });
  }

  // Si se ha indicado al menos un límite de precio
  if (!isNaN(precioMin) || !isNaN(precioMax)) {
    const filtroPrecio = { nameField: "retailPrice" };
    if (!isNaN(precioMin)) filtroPrecio.min = precioMin;
    if (!isNaN(precioMax)) filtroPrecio.max = precioMax;
    criterios.push(filtroPrecio);
  }

  // Mostrar zapatillas según los criterios
  buscarZapatillas(criterios);
  console.log("Criterios enviados:", criterios);

}


// =========================
// Llamada a la API
// =========================

function buscarZapatillas(criterios) {
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "";

  fetch("https://stepup-proyect.onrender.com/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ limit: "98", criteria: criterios })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.results || data.results.length === 0) {
        resultado.textContent = "No se encontraron zapatillas.";
        return;
      }
      mostrarZapatillas(data.results);
    })
    .catch(() => {
      resultado.textContent = "Error al cargar los datos.";
    });
}

// =========================
// Mostrar tarjetas de zapatillas
// =========================

function mostrarZapatillas(zapatillas) {
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "";
  zapatillasCargadas = zapatillas;

  zapatillas.forEach(z => {
    const img = z.image?.original || z.image?.small || z.image?.thumbnail;
    if (!img) return;

    const card = document.createElement("div");
    card.className = "card-zapatilla";

    // 👉 Hacer clic en la tarjeta lleva a producto.html
   card.addEventListener("click", () => {
  localStorage.setItem("productoSeleccionado", JSON.stringify(z));
  window.location.href = "producto.html";
});


    // 🖼️ Imagen principal
    const imgElement = document.createElement("img");
    imgElement.src = img;
    imgElement.alt = z.name;

    // 🔍 Botón para ampliar imagen
    const zoomBtn = document.createElement("span");
    zoomBtn.className = "zoom-icon";
    zoomBtn.textContent = "⤢";
    zoomBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // ⛔ evita que se redireccione
      ampliarZapatilla(img);
    });

    // ❤️ Botón de favorito
    const favBtn = document.createElement("button");
    favBtn.className = "favorito-btn";
    favBtn.textContent = esFavorito(z) ? "❤️" : "🤍";
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // ⛔ evita que se redireccione
      toggleFavorito(z);
    });

    // ℹ️ Info de zapatilla
    const info = document.createElement("div");
    info.className = "info";
    info.innerHTML = `
      <h3>${z.name}</h3>
      <p><strong>Marca:</strong> ${z.brand}</p>
      <p><strong>Color:</strong> ${z.colorway}</p>
      <p><strong>Precio:</strong> €${z.retailPrice || "N/A"}</p>
    `;

    // 📦 Montar tarjeta
    card.appendChild(imgElement);
    card.appendChild(zoomBtn);
    card.appendChild(favBtn);
    card.appendChild(info);
    resultado.appendChild(card);
  });
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

// =========================
// Carrito
// =========================

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
  //window.location.href = "cesta.html"; // si tienes página
}

// =========================
// Banner rotativo de inicio
// =========================

const imagenesBanner = ['img/prin8.png', 'img/prin24.png'];
let indice = 0;
const banner = document.getElementById('banner-img');

if (banner) {
  setInterval(() => {
    banner.classList.add('fade-out');
    setTimeout(() => {
      indice = (indice + 1) % imagenesBanner.length;
      banner.src = imagenesBanner[indice];
      banner.classList.remove('fade-out');
    }, 1000);
  }, 10000);
}

// =========================
// Al cargar la página
// =========================

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
  mostrarInicio(); // Solo banner al inicio
});


// Activar clic en cada logo para filtrar por marca
document.addEventListener("DOMContentLoaded", () => {
  const logos = document.querySelectorAll(".grid-marcas img");

  logos.forEach(logo => {
    logo.addEventListener("click", () => {
      const marca = logo.getAttribute("data-marca");
      if (marca) {
        ocultarHero();
        mostrarFiltros();
        buscarZapatillas([{ nameField: "brand", value: marca }]);
      }
    });
  });
});


function ampliarZapatilla(url) {
  const modal = document.getElementById("modal-zapatilla");
  const modalImg = document.getElementById("img-modal-zapa");
  modalImg.src = url;
  modal.style.display = "flex";
}

document.getElementById("cerrar-modal-zapa").addEventListener("click", () => {
  document.getElementById("modal-zapatilla").style.display = "none";
});

window.addEventListener("click", (e) => {
  const modal = document.getElementById("modal-zapatilla");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

//----destacados----//





