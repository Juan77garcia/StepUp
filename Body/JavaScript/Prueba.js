
const MARCAS_VALIDAS = [ "nike", "adidas", "jordan", "new balance", "converse",
  "puma", "reebok", "vans", "asics", "hoka one one",
  "timberland", "crocs", "salomon", "balenciaga", "gucci"
];

const input = document.getElementById("marcaInput");
input.addEventListener("keyup", () => {
  const marca = input.value.trim().toLowerCase();
  if (marca && MARCAS_VALIDAS.includes(marca)) {
    ocultarHero();
    mostrarFiltros();
    buscarZapatillas([{ nameField: "brand", value: marca }]);
  }
});

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

function buscarZapatillas(criterios) {
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "";

  fetch("https://stepup-proyect.onrender.com/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({limit: "95", criteria: criterios })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.results || data.results.length === 0) {
        resultado.textContent = "No se encontraron zapatillas.";
        return;
      }

      data.results.forEach(z => {
        const img = z.image?.original || z.image?.small || z.image?.thumbnail;
        if (!img) return;

        const card = document.createElement("div");
        card.className = "card-zapatilla";
        card.innerHTML = `
          <img src="${img}" alt="${z.name}">
          <div class="info">
            <h4>${z.name}</h4>
            <p>${z.brand}</p>
            <p><strong>€ ${z.retailPrice || 'N/A'}</strong></p>
            <button>Añadir a la cesta</button>
          </div>
        `;
        resultado.appendChild(card);
      });
    })
    .catch(() => {
      resultado.textContent = "Error al cargar los datos.";
    });
}
