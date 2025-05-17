document.getElementById("login-form").addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.querySelector('input[name="email"]').value;
      const password = document.querySelector('input[name="password"]').value;

      fetch("https://TU_BACKEND/login", { // ← CAMBIA ESTA URL por la que te dé tu compañero
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })
      .then(res => res.json())
      .then(data => {
        const mensaje = document.getElementById("mensaje");

        if (data.ok && data.token) {
          localStorage.setItem("token", data.token); // guardar sesión
          mensaje.textContent = "✅ Sesión iniciada correctamente";
          setTimeout(() => {
            window.location.href = "/dashboard.html"; // o la ruta que uses
          }, 1500);
        } else {
          mensaje.textContent = "❌ " + (data.error || "Correo o contraseña incorrectos.");
        }
      })
      .catch(err => {
        console.error(err);
        document.getElementById("mensaje").textContent = "❌ Error al conectar con el servidor.";
      });
    });