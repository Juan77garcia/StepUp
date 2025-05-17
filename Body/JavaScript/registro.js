 document.getElementById("register-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.querySelector('input[name="nombre"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    fetch("/api/registrarse", { // Cambia esta URL si tu compañero usa otra
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password })
    })
    .then(res => res.json())
    .then(data => {
      const mensaje = document.getElementById("mensaje");

      if (data.ok) {
        mensaje.textContent = "✅ Cuenta creada. Revisa tu correo para confirmarla.";
        // Redirigir si quieres
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        mensaje.textContent = "❌ " + (data.error || "No se pudo registrar.");
      }
    })
    .catch(err => {
      console.error(err);
      document.getElementById("mensaje").textContent = "❌ Error al conectar con el servidor.";
    });
  });