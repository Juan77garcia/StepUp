document.addEventListener('DOMContentLoaded', () => {
  let productos = [];
  let currentList = [];
  let favoritos = [];
  let carrito = [];



 function cargarProductosPorMarca(marca) {
  fetch('https://stepup-proyect.onrender.com/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      limit: "10",
      criteria: [
        {
          nameField: "brand",
          value: marca
        }
      ]
    })
  })
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => {
          throw new Error(`Error del servidor: ${text}`);
        });
      }
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data)) {
        console.error('❌ La API no devolvió una lista:', data);
        return;
      }

      productos = data.map(p => ({
        _id: p.id?.toString(),
        shoeName: p.name || p.title || 'Sin nombre',
        brand: p.brand || 'Sin marca',
        thumbnail: p.thumbnail || (p.images && p.images[0]) || 'img/placeholder.jpg',
        lowestResellPrice: {
          stockx: p.price || 0
        }
      }));

      currentList = productos;
      filtrarYMostrar(productos, marca.toUpperCase());
    })
    .catch(err => {
      console.error('🚨 Error al conectar con la API:', err.message);
    });
}


  document.getElementById('btn-home').onclick = () => {
    currentList = [];
    limpiarVista();
    document.getElementById('hero-container')?.classList.remove('hidden');
  };

  document.getElementById('btn-all').onclick = () => {
    currentList = productos.slice();
    filtrarYMostrar(currentList, 'Todo');
  };

  document.getElementById('btn-men').onclick = () => cargarProductosPorMarca('nike');
document.getElementById('btn-women').onclick = () => cargarProductosPorMarca('puma');
document.getElementById('btn-jordan').onclick = () => cargarProductosPorMarca('jordan');




  document.getElementById('btn-new').onclick = () => alert('“Nuevas” pendiente');
  document.getElementById('btn-sale').onclick = () => alert('“Ofertas” pendiente');

  // =============================
  // BÚSQUEDA
  // =============================
  document.getElementById('search').oninput = () => {
    const texto = document.getElementById('search').value.trim().toLowerCase();
    const fuente = currentList.length ? currentList : productos;
    const resultado = texto === ''
      ? currentList
      : fuente.filter(p => p.shoeName.toLowerCase().includes(texto));
    
    document.getElementById('hero-container')?.classList.add('hidden');
    pintar(resultado);
  };

  // =============================
  // FAVORITOS
  // =============================
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

  // =============================
  // MODAL DE PRODUCTO
  // =============================
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

  // =============================
  // CARRITO
  // =============================
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

  // =============================
  // FUNCIONES AUXILIARES
  // =============================
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
    console.log('Imagen del producto:', p.thumbnail); // ✅ Verifica la URL en consola
    zona.innerHTML += `
      <div class="card" onclick="mostrarProducto('${p._id}')">
        <button class="fav-btn" onclick="event.stopPropagation(); marcarFavorito('${p._id}')">
          ${favoritos.includes(p._id) ? '💖' : '🤍'}
        </button>
        <img src="${p.thumbnail}" alt="${p.shoeName}">
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

  
  const imagenesBanner = ['/img/prin22.png','/img/prin7.png'];
  let indice = 0;
  const banner = document.getElementById('banner-img');

  setInterval(() => {
    banner.classList.add('fade-out');
    setTimeout(() => {
      indice = (indice + 1) % imagenesBanner.length;
      banner.src = imagenesBanner[indice];
      banner.classList.remove('fade-out');
    }, 1000);
  }, 10000);

document.addEventListener("DOMContentLoaded", function () {
  const cartButton = document.querySelector(".cart");
  const cartDrawer = document.getElementById("cart-drawer");
  const closeCart = document.getElementById("close-cart");

  if (!cartButton || !cartDrawer || !closeCart) {
    console.error("🚨 No se encontró uno de los elementos necesarios.");
    return;
  }

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
});

window.onload = function () {
  console.log("✅ script.js cargado con window.onload");

  const cartButton = document.querySelector(".cart");
  const cartDrawer = document.getElementById("cart-drawer");
  const closeCart = document.getElementById("close-cart");

  console.log("cartButton:", cartButton);
  console.log("cartDrawer:", cartDrawer);
  console.log("closeCart:", closeCart);

  if (!cartButton || !cartDrawer || !closeCart) {
    console.error("❌ Elementos no encontrados");
    return;
  }

  cartButton.addEventListener("click", () => {
    console.log("🛒 Click en el carrito");
    cartDrawer.classList.remove("hidden");
    cartDrawer.classList.add("active");
  });

  closeCart.addEventListener("click", () => {
    console.log("❌ Cerrar carrito");
    cartDrawer.classList.remove("active");
    setTimeout(() => {
      cartDrawer.classList.add("hidden");
    }, 300);
  });
};







  

  
});
