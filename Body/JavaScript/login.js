 document.getElementById("login-form").addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.querySelector('input[name="email"]').value.trim();
      const password = document.querySelector('input[name="password"]').value.trim();
      const mensaje = document.getElementById("mensaje");

      if (!email || !password) {
        mensaje.textContent = "❌ Debes completar todos los campos.";
        return;
      }

      const url = `https://stepup-proyect.onrender.com/customer/get/verify/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          console.log("Respuesta login:", data);

          if (data === true) {
            mensaje.textContent = "✅ Sesión iniciada correctamente";

            // Guardamos email en localStorage
            localStorage.setItem("usuarioLogeado", email);

            // Verificamos si viene del checkout
            const redirigirAPago = localStorage.getItem("redirigirAPago");

            setTimeout(() => {
              if (redirigirAPago === "true") {
                localStorage.removeItem("redirigirAPago");
                window.location.href = "checkout.html";
              } else {
                window.location.href = "index.html";
              }
            }, 1500);
          } else {
            mensaje.textContent = "❌ Correo o contraseña incorrectos o cuenta no verificada.";
          }
        })
        .catch(err => {
          console.error("Error al conectar:", err);
          mensaje.textContent = "❌ Error al conectar con el servidor.";
        });
    });