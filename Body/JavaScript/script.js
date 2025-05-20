const MARCAS_VALIDAS = [
  "nike", "adidas", "jordan", "new balance", "converse",
  "puma", "reebok", "vans", "asics", "hoka one one",
  "timberland", "crocs", "salomon", "balenciaga", "gucci"
];

let zapatillasCargadas = [];

const input = document.getElementById("marcaInput");
input.addEventListener("keyup", () => {
  const marca = input.value.trim().toLowerCase();
  if (marca && MARCAS_VALIDAS.includes(marca)) {
    ocultarHero();
    mostrarFiltros();
    buscarZapatillas([{ nameField: "brand", value: marca }]);
  }
});

// -------------------- MOSTRAR / OCULTAR ------------------

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

// -------------------- FILTROS Y BÚSQUEDA ------------------

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
  const marca = document.getElementById("marcaFiltro").value;
  const precioMin = document.getElementById("precioMin").value;
  const precioMax = document.getElementById("precioMax").value;

  const criterios = [];
  if (marca) criterios.push({ nameField: "brand", value: marca });
  if (precioMin) criterios.push({ nameField: "retailPrice", min: parseInt(precioMin) });
  if (precioMax) criterios.push({ nameField: "retailPrice", max: parseInt(precioMax) });

  buscarZapatillas(criterios);
}

// -------------------- API CALL ------------------

function buscarZapatillas(criterios) {
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "";

  fetch("https://stepup-proyect.onrender.com/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ limit: "95", criteria: criterios })
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

// -------------------- MOSTRAR ZAPATILLAS ------------------

function mostrarZapatillas(zapatillas) {

  document.getElementById("zapas-caras").classList.add("oculto-en-inicio");;

  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "";
  zapatillasCargadas = zapatillas;

  zapatillas.forEach(z => {
    const img = z.image?.original || z.image?.small || z.image?.thumbnail;
    if (!img) return;

    const card = document.createElement("div");
    card.className = "card-zapatilla";

    const favBtn = document.createElement("button");
    favBtn.className = "favorito-btn";
    favBtn.textContent = esFavorito(z) ? "❤️" : "🤍";
    favBtn.addEventListener("click", () => toggleFavorito(z));

    const info = document.createElement("div");
    info.className = "info";
    info.innerHTML = `
      <h3>${z.name}</h3>
      <p><strong>Marca:</strong> ${z.brand}</p>
      <p><strong>Color:</strong> ${z.colorway}</p>
      <p><strong>Precio:</strong> €${z.retailPrice || "N/A"}</p>
    `;

    const btnCarrito = document.createElement("button");
    btnCarrito.textContent = "Añadir a la cesta";
    btnCarrito.addEventListener("click", () => añadirAlCarrito(z));
    info.appendChild(btnCarrito);

    card.innerHTML = `<img src="${img}" alt="${z.name}">`;
    card.appendChild(favBtn);
    card.appendChild(info);
    resultado.appendChild(card);
  });
}

// -------------------- FAVORITOS ------------------
function mostrarFavoritos() {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  // Ocultar el hero y mostrar los filtros si es necesario
  ocultarHero();
  mostrarFiltros();

  if (favoritos.length === 0) {
    document.getElementById("resultado").innerHTML = "<p>No tienes favoritos aún.</p>";
    return;
  }

  mostrarZapatillas(favoritos); // Ya tienes esta función, se reutiliza
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

//-- carrito
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
  mostrarCarrito(); // opcional: mostrar inmediatamente
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
  // Si tienes una página real puedes usar:
  // window.location.href = "cesta.html";
}


document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);






// -------------------- BANNER ------------------

const imagenesBanner = ['img/prin7.png', 'img/prin22.png'];
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

// -------------------- INICIO AUTOMÁTICO ------------------

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
  mostrarInicio(); // muestra banner
});

//------------mostrar al inicio----------------//

function mostrarInicio() {
  document.getElementById("hero-container").classList.remove("hidden");
  document.getElementById("filtros").classList.add("oculto-en-inicio");
  document.getElementById("resultado").innerHTML = "";
  document.getElementById("zapas-caras").classList.remove("oculto-en-inicio");

  // mostrar las más caras
  fetch("https://stepup-proyect.onrender.com/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ limit: 100, criteria: [] })
  })
    .then(res => res.json())
    .then(data => {
      const zapatillas = data.results || [];
      const masCaras = zapatillas
        .filter(z => z.retailPrice)
        .sort((a, b) => b.retailPrice - a.retailPrice)
        .slice(0, 4); // top 4 más caras
      mostrarZapatillasEnInicio(masCaras);
    });
}

 function mostrarZapatillasEnInicio(zapatillas) {
  const contenedor = document.getElementById("zapas-caras");
  contenedor.classList.remove("oculto-en-inicio");

  // Filtrar solo las que tienen imagen y precio
  const validas = zapatillas.filter(z => z.image?.original && z.retailPrice);

  // Ordenar por precio descendente y tomar las top 4 más caras
  const topCaras = validas.sort((a, b) => b.retailPrice - a.retailPrice).slice(0, 4);

  const grid = document.createElement("div");
  grid.className = "grid-caras";

  topCaras.forEach(z => {
    const card = document.createElement("div");
    card.className = "zapa-cara";

    card.innerHTML = `
      <img src="${z.image.original}" alt="${z.name}">
      <div class="zapa-cara-info">
        <h3>${z.name}</h3>
        <p>${z.brand}</p>
        <p><strong>€ ${z.retailPrice}</strong></p>
        <button onclick='añadirAlCarrito(${JSON.stringify(z)})'>Añadir a la cesta</button>
      </div>
    `;

    grid.appendChild(card);
  });

  contenedor.innerHTML = `
    <h2 style="text-align: center;">Zapatillas más caras</h2>
  `;
  contenedor.appendChild(grid);
}


//------------mostrar al inicio----------------//
