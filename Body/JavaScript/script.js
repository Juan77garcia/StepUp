// =========================
// Marcas válidas para búsqueda rápida
// =========================
const MARCAS_VALIDAS = [
  "nike", "adidas", "jordan", "new balance", "converse",
  "puma", "reebok", "vans", "asics", "hoka one one"
  , "crocs", "salomon", "balenciaga", "gucci",
  "alexander mcqueen", "dior", "off-white","golden goose,air jordan"
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
    document.getElementById("lanzamientos-2025").style.display = "none";
  document.getElementById("publi").style.display = "none";
  document.getElementById("genders").style.display = "none";
  document.getElementById("destacados-inicio").style.display = "none";
    document.getElementById("resultado").style.display = "grid";
    buscarZapatillas([{ nameField: "brand", value: marca }]);
  }
});

// =========================
// Mostrar/Ocultar secciones
// =========================

function mostrarInicio() {
  // Mostrar banner principal
  document.getElementById("hero-container").classList.remove("hidden");

  // Ocultar filtros y resultados
  document.getElementById("filtros").classList.add("oculto-en-inicio");
  document.getElementById("resultado").innerHTML = "";
  document.getElementById("resultado").style.display = "none";

  // Mostrar otras secciones del inicio
  const destacados = document.getElementById("destacados-inicio");
  const lanzamientos = document.getElementById("lanzamientos-2025");
  const generos = document.querySelector(".comprar-genero"); // si tienes esta sección
  const slider = document.querySelector(".slider-banner");

  if (destacados) destacados.style.display = "block";
  if (lanzamientos) lanzamientos.style.display = "block";
  if (generos) generos.style.display = "block";
  if (slider) slider.style.display = "block";
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
  document.getElementById("destacados-inicio").style.display = "none";
  document.getElementById("resultado").style.display = "grid";
  document.getElementById("lanzamientos-2025").style.display = "none";
  document.getElementById("publi").style.display = "none";
  document.getElementById("genders").style.display = "none";



}

function buscarZapatillasSoloMarcasValidas() {
  ocultarHero();
  mostrarFiltros();
  document.getElementById("destacados-inicio").style.display = "none";
  document.getElementById("resultado").style.display = "grid";
  document.getElementById("lanzamientos-2025").style.display = "none";
  document.getElementById("publi").style.display = "none";
  document.getElementById("genders").style.display = "none";



  const criterios = MARCAS_VALIDAS.map(marca => ({
    nameField: "brand",
    value: marca
  }));

  fetch("https://stepup-proyect.onrender.com/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      limit: "100", // Puedes ajustar si hay más
      criteria: criterios
    })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.results || data.results.length === 0) {
        document.getElementById("resultado").textContent = "No se encontraron zapatillas.";
        return;
      }
      mostrarZapatillas(data.results);
    })
    .catch(() => {
      document.getElementById("resultado").textContent = "Error al cargar los datos.";
    });
}


function aplicarFiltros() {
  ocultarHero();

  const marca = document.getElementById("marcaFiltro").value.trim().toLowerCase();
  const color = document.getElementById("colorFiltro").value.trim().toLowerCase();

  const criterios = [];

  // Si se ha seleccionado una marca válida
  if (marca) {
    criterios.push({ nameField: "brand", value: marca });
  }

  // Si se ha seleccionado un color
  if (color) {
    criterios.push({ nameField: "colorway", value: color });
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
  resultado.innerHTML = "Cargando zapatillas...";

  fetch("https://stepup-proyect.onrender.com/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ limit: 98, criteria: criterios })
  })
    .then(res => res.json())
    .then(data => {
      console.log("Zapatillas recibidas:", data);
      if (!data.results || data.results.length === 0) {
        resultado.innerHTML = "<p>No se encontraron zapatillas para esta marca.</p>";
        return;
      }
      mostrarZapatillas(data.results); // 👈 Asegúrate de que esta funcione
    })
    .catch(err => {
      resultado.innerHTML = "<p>Error al cargar productos.</p>";
      console.error("Error:", err);
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
  document.getElementById("lanzamientos-2025").style.display = "none";
  document.getElementById("publi").style.display = "none";
  document.getElementById("genders").style.display = "none";
  document.getElementById("destacados-inicio").style.display = "none";
  document.getElementById("resultado").style.display = "grid"; // ✅ Mostrar contenedor

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
      const precioTotal = zapa.retailPrice * zapa.cantidad;

      const item = document.createElement("li");
      item.innerHTML = `
        ${zapa.name} - €${precioTotal.toFixed(2)}
        <button onclick="eliminarDelCarrito(${i})">X</button>
      `;
      lista.appendChild(item);

      suma += precioTotal;
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



// =========================
// Banner rotativo de inicio
// =========================

const imagenesBanner = ['/Body/img/prin8.png', '/Body/img/prin24.png'];
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

  // Obtenemos posibles flags de navegación cruzada
  const params = new URLSearchParams(window.location.search);
  const genero = params.get("filtro");
  const marca = params.get("marca");
  const marcaGuardada = localStorage.getItem("marcaBusqueda");
  const favoritosFlag = localStorage.getItem("mostrarFavoritos");
  const verTodoFlag = localStorage.getItem("verTodo");

  if (marcaGuardada) {
    localStorage.removeItem("marcaBusqueda");

    ocultarHero();
    mostrarFiltros();
    buscarZapatillas([{ nameField: "brand", value: marcaGuardada }]);

    document.getElementById("resultado").style.display = "grid";
    ["lanzamientos-2025", "publi", "genders", "destacados-inicio"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });

  } else if (favoritosFlag) {
    localStorage.removeItem("mostrarFavoritos");

    ocultarHero();
    mostrarFiltros();
    document.getElementById("resultado").style.display = "grid";

    ["lanzamientos-2025", "publi", "genders", "destacados-inicio"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });

    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    if (favoritos.length === 0) {
      document.getElementById("resultado").innerHTML = "<p>No tienes favoritos aún.</p>";
    } else {
      mostrarZapatillas(favoritos);
    }

  } else if (verTodoFlag) {
    localStorage.removeItem("verTodo");

    ocultarHero();
    mostrarFiltros();
    document.getElementById("resultado").style.display = "grid";

    ["lanzamientos-2025", "publi", "genders", "destacados-inicio"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });

    buscarZapatillasSoloMarcasValidas();

  } else if (genero) {
    filtrarPorGenero(genero);

  } else if (marca) {
    ocultarHero();
    mostrarFiltros();
    document.getElementById("resultado").style.display = "grid";
    ocultarSeccionesInicio();
    buscarZapatillas([{ nameField: "brand", value: marca }]);

  } else {
    // ✅ Si no hay nada activado, mostrar la vista de inicio
    mostrarInicio();
  }
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
         document.getElementById("lanzamientos-2025").style.display = "none";
         document.getElementById("publi").style.display = "none";
         document.getElementById("genders").style.display = "none";
        document.getElementById("destacados-inicio").style.display = "none"
        document.getElementById("resultado").style.display = "grid"; 
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



function mostrarPorMarca(marca) {
  ocultarHero();
  mostrarFiltros();
   document.getElementById("lanzamientos-2025").style.display = "none";
  document.getElementById("publi").style.display = "none";
  document.getElementById("genders").style.display = "none";
  document.getElementById("destacados-inicio").style.display = "none";
  document.getElementById("resultado").style.display = "grid";

  buscarZapatillas([{ nameField: "brand", value: marca }]);
}





function animarLanzamiento() {
  const items = document.querySelectorAll('.item-zapa');
  items.forEach(item => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      item.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', animarLanzamiento);












const imagenesSlider = [
  {
    img: "/Body/img/publli2.png",
    marca: "crocs"
  },
  {
    img: "/Body/img/publi3.png",
    marca: "puma"
  },
  {
    img: "/Body/img/publi1.png",
    marca: "off-white"
  }
];

let sliderIndex = 0;

function cambiarBanner() {
  sliderIndex = (sliderIndex + 1) % imagenesSlider.length;
  const img = document.getElementById("slider-img");
  img.src = imagenesSlider[sliderIndex].img;
}

function comprarAhora() {
  const marca = imagenesSlider[sliderIndex].marca;

  ocultarHero();
  mostrarFiltros();
  document.getElementById("resultado").style.display = "grid";
  document.getElementById("lanzamientos-2025").style.display = "none";
  document.getElementById("publi").style.display = "none";
  document.getElementById("genders").style.display = "none";
  document.getElementById("destacados-inicio").style.display = "none";

  buscarZapatillas([{ nameField: "brand", value: marca }]);
}






 const toggleBtn = document.getElementById('toggleMenu');
    const navLinks = document.getElementById('navbarLinks');

    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });




    document.addEventListener("DOMContentLoaded", () => {
  const nombre = localStorage.getItem("nombreUsuario");
  const nombreContenedor = document.getElementById("nombre-usuario");

  if (nombre && nombreContenedor) {
    nombreContenedor.textContent = `Hola, ${nombre}`;
  }
});