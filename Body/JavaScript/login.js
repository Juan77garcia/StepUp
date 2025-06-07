document.addEventListener("DOMContentLoaded", function () {
  const emailGuardado = localStorage.getItem("usuarioLogeado");
  const nombreGuardado = localStorage.getItem("nombreUsuario");

  if (emailGuardado) {
    const container = document.querySelector(".login-container");
    container.innerHTML = `
      <h2>Ya iniciaste sesión</h2>
      <p>Hola <strong>${nombreGuardado || emailGuardado}</strong>, ya has iniciado sesión.</p>
      <button id="irInicio">Ir al inicio</button>
      <button id="cerrarSesion">Cerrar sesión</button>
    `;

    // Botón para ir al inicio
    document.getElementById("irInicio").addEventListener("click", () => {
      window.location.href = "index.html";
    });

    // Botón para cerrar sesión
    document.getElementById("cerrarSesion").addEventListener("click", () => {
      localStorage.removeItem("usuarioLogeado");
      localStorage.removeItem("nombreUsuario");
      window.location.reload(); // Vuelve a mostrar el formulario de login
    });

    return; // Ya está logueado, no mostrar formulario
  }

  // Evento de envío de formulario
  const loginForm = document.getElementById("login-form");
  const mensaje = document.getElementById("mensaje");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.querySelector('input[name="email"]').value.trim();
    const password = document.querySelector('input[name="password"]').value.trim();

    if (!email || !password) {
      mensaje.textContent = "⚠️ Debes completar todos los campos.";
      return;
    }

    mensaje.textContent = "⏳ Verificando credenciales...";
    mensaje.classList.add("cargando");

    const url = `https://stepup-proyect.onrender.com/customer/get/verify/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log("Respuesta login:", data);

        mensaje.classList.remove("cargando");

        if (data === true) {
          mensaje.textContent = "✅ Sesión iniciada correctamente";
          localStorage.setItem("usuarioLogeado", email);

          // Obtener datos del usuario
          const clienteUrl = `https://stepup-proyect.onrender.com/customer/get/customer-by-email?email=${encodeURIComponent(email)}`;

          fetch(clienteUrl)
            .then(res => res.json())
            .then(cliente => {
              if (cliente.name) {
                localStorage.setItem("nombreUsuario", cliente.name);
              }

              // Redirección según origen
              const redirigirAPago = localStorage.getItem("redirigirAPago");

              setTimeout(() => {
                if (redirigirAPago === "true") {
                  localStorage.removeItem("redirigirAPago");
                  window.location.href = "checkout.html";
                } else {
                  window.location.href = "index.html";
                }
              }, 1000);
            });
        } else {
          mensaje.textContent = "❌ Correo o contraseña incorrectos o cuenta no verificada.";
        }
      })
      .catch(err => {
        console.error("Error al conectar:", err);
        mensaje.classList.remove("cargando");
        mensaje.textContent = "❌ Error al conectar con el servidor.";
      });
  });
});
