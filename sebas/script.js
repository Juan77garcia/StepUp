document.addEventListener('DOMContentLoaded', () => {
  let productos = [];
  let currentList = [];
  let favoritos = [];
  let carrito = [];
  const marcasPermitidas = [
  "Nike", "Adidas", "Jordan", "New Balance", "Converse",
  "Puma", "Reebok", "Vans", "Asics", "Hoka One One",
  "Timberland", "Crocs", "Salomon", "Balenciaga", "Gucci"
];


  function cargarProductosPorCampo(campo, valor) {
  limpiarVista();

  const zona = document.getElementById('productos');
  zona.innerHTML = '<p style="text-align:center; font-size: 18px;">🔄 Cargando productos...</p>';

  const criterios = marcasPermitidas.map(marca => ({
    nameField: "brand",
    value: marca
  }));

  if (campo && valor) {
    criterios.push({ nameField: campo, value: valor });
  }

  fetch('https://stepup-proyect.onrender.com/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      limit: "90",
      criteria: criterios
    })
  })
    .then(res => {
      if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!data.results || !Array.isArray(data.results)) {
        zona.innerHTML = '<p style="text-align:center;">No se encontraron resultados.</p>';
        return;
      }

      productos = data.results
        .filter(p => p.image?.original || p.image?.small || p.image?.thumbnail)
        .map(p => ({
          _id: p.id?.toString(),
          shoeName: p.name || p.title || 'Sin nombre',
          brand: p.brand || 'Sin marca',
          thumbnail: p.image.original || p.image.small || p.image.thumbnail,
          lowestResellPrice: { stockx: p.retailPrice || 0 }
        }));

      currentList = productos;
      filtrarYMostrar(productos, `${campo.toUpperCase()}: ${valor}`);
    })
    .catch(err => {
      console.error('🚨 Error al conectar con la API:', err.message);
      zona.innerHTML = '<p style="text-align:center; color: red;">Error al cargar los productos.</p>';
    });
}


  const btnAll = document.getElementById('btn-all');
  if (btnAll) {
    btnAll.onclick = () => {
      currentList = productos.slice();
      filtrarYMostrar(currentList, 'Todo');
    };
  }

  document.getElementById('btn-men')?.addEventListener('click', () => cargarProductosPorCampo('gender', 'men'));
  document.getElementById('btn-women')?.addEventListener('click', () => cargarProductosPorCampo('gender', 'women'));
  document.getElementById('btn-niño')?.addEventListener('click', () => cargarProductosPorCampo('gender', 'youth'));
  document.getElementById('btn-unisex')?.addEventListener('click', () => cargarProductosPorCampo('gender', 'unisex'));

  document.getElementById('btn-new')?.addEventListener('click', () => alert('“Nuevas” pendiente'));
  document.getElementById('btn-sale')?.addEventListener('click', () => alert('“Ofertas” pendiente'));

  document.getElementById('search')?.addEventListener('input', () => {
    const texto = document.getElementById('search').value.trim().toLowerCase();
    const fuente = currentList.length ? currentList : productos;
    const resultado = texto === ''
      ? currentList
      : fuente.filter(p => p.shoeName.toLowerCase().includes(texto));

    document.getElementById('hero-container')?.classList.add('hidden');
    pintar(resultado);
  });

  window.verFavoritos = () => {
    const lista = productos.filter(p => favoritos.includes(p._id));
    currentList = lista;
    document.getElementById('search').value = '';
    document.getElementById('categoria-titulo').innerText = `Favoritos – ${lista.length} resultados`;
    document.getElementById('hero-container')?.classList.add('hidden');
    pintar(lista);
  };

  window.marcarFavorito = (id) => {
    favoritos = favoritos.includes(id)
      ? favoritos.filter(f => f !== id)
      : [...favoritos, id];

    pintar(currentList);
  };

  window.mostrarProducto = (id) => {
    const producto = productos.find(p => p._id === id);
    const modal = document.getElementById('producto-modal');
    const contenido = document.getElementById('modal-content');
    const tallas = generarTallas();

    contenido.innerHTML = `
      <button class="close-btn" onclick="cerrarModal()">✖</button>
      <img src="${producto.thumbnail}" alt="${producto.shoeName}" style="width:100%;">
      <h2>${producto.shoeName}</h2>
      <p><strong>Marca:</strong> ${producto.brand}</p>
      <p><strong>Precio:</strong> $${producto.lowestResellPrice?.stockx || 'N/A'}</p>
      <label>Talla:</label>
      <select id="talla-seleccionada">
        ${tallas.map(t => `<option value="${t}">${t}</option>`).join('')}
      </select>
      <button onclick="agregarAlCarrito('${producto._id}')">Añadir al carrito 🛒</button>
    `;

    modal.classList.remove('hidden');
  };

  window.cerrarModal = () => {
    document.getElementById('producto-modal')?.classList.add('hidden');
  };

  window.agregarAlCarrito = (id) => {
    const producto = productos.find(p => p._id === id);
    const talla = document.getElementById('talla-seleccionada').value;
    carrito.push({ ...producto, talla });
    cerrarModal();
    actualizarContadorCarrito();
    alert(`🛒 Añadido: ${producto.shoeName} - Talla ${talla}`);
  };

  function actualizarContadorCarrito() {
    const boton = document.querySelector('.cart');
    if (boton) boton.innerText = `🛒 (${carrito.length})`;
  }

  function generarTallas() {
    const base = ['38', '39', '40', '41', '42', '43', '44'];
    return base.filter(() => Math.random() > 0.3);
  }

  function pintar(lista) {
    const zona = document.getElementById('productos');
    zona.innerHTML = '';

    if (!lista.length) {
      zona.innerHTML = '<p style="text-align:center;">No hay productos.</p>';
      return;
    }

    lista.forEach(p => {
      zona.innerHTML += `
        <div class="card" onclick="mostrarProducto('${p._id}')">
          <button class="fav-btn" onclick="event.stopPropagation(); marcarFavorito('${p._id}')">
            ${favoritos.includes(p._id) ? '💖' : '🤍'}
          </button>
          <img src="${p.thumbnail}" alt="${p.shoeName}" onerror="this.src='https://via.placeholder.com/100?text=Sin+imagen';">
          <h3>${p.shoeName}</h3>
          <p>$${p.lowestResellPrice?.stockx || 'N/A'}</p>
        </div>
      `;
    });
  }

  function limpiarVista() {
    document.getElementById('productos').innerHTML = '';
    document.getElementById('search').value = '';
    document.getElementById('categoria-titulo').innerText = '';
  }

  function filtrarYMostrar(lista, titulo) {
    document.getElementById('search').value = '';
    document.getElementById('categoria-titulo').innerText = `${titulo} – ${lista.length} resultados`;
    document.getElementById('hero-container')?.classList.add('hidden');
    pintar(lista);
  }

  // Banner rotativo
  const imagenesBanner = ['img/prin22.png', 'img/prin7.png'];
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

  // Drawer del carrito
  const cartButton = document.querySelector(".cart");
  const cartDrawer = document.getElementById("cart-drawer");
  const closeCart = document.getElementById("close-cart");

  if (cartButton && cartDrawer && closeCart) {
    cartButton.addEventListener("click", () => {
      cartDrawer.classList.remove("hidden");
      cartDrawer.classList.add("active");
    });

    closeCart.addEventListener("click", () => {
      cartDrawer.classList.remove("active");
      setTimeout(() => {
        cartDrawer.classList.add("hidden");
      }, 300);
    });
  }
});
