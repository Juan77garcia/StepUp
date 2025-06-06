document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.querySelector('input[name="email"]').value.trim();
  const password = document.querySelector('input[name="password"]').value.trim();
  const mensaje = document.getElementById("mensaje");

  if (!email || !password) {
    mensaje.textContent = "Debes completar todos los campos.";
    return;
  }

  const url = `https://stepup-proyect.onrender.com/customer/get/verify/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log("Respuesta login:", data);

      if (data === true) {
        //Sesión correcta
        mensaje.textContent = "✅ Sesión iniciada correctamente";

        //Guardar email
        localStorage.setItem("usuarioLogeado", email);

        //Ahora pedimos los datos del cliente
        const clienteUrl = `https://stepup-proyect.onrender.com/customer/get/customer-by-email?email=${encodeURIComponent(email)}`;

        fetch(clienteUrl)
          .then(res => res.json())
          .then(cliente => {
            

            //Guardar nombre en localStorage
            if (cliente.name) {
              localStorage.setItem("nombreUsuario", cliente.name);
            }

            const redirigirAPago = localStorage.getItem("redirigirAPago");

            setTimeout(() => {
              if (redirigirAPago === "true") {
                localStorage.removeItem("redirigirAPago");
                window.location.href = "checkout.html";
              } else {
                window.location.href = "index.html";
              }
            },);
          });

      } else {
        mensaje.textContent = " Correo o contraseña incorrectos o cuenta no verificada.";
      }
    })
    .catch(err => {
      console.error("Error al conectar:", err);
      mensaje.textContent = " Error al conectar con el servidor.";
    });
});


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

    // Ir al inicio
    document.getElementById("irInicio").addEventListener("click", () => {
      window.location.href = "index.html";
    });

    // Cerrar sesión
    document.getElementById("cerrarSesion").addEventListener("click", () => {
      localStorage.removeItem("usuarioLogeado");
      localStorage.removeItem("nombreUsuario");
      window.location.reload(); // recarga la página para volver a mostrar el formulario
    });
  }
});
