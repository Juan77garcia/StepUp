document.getElementById("register-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const mensaje = document.getElementById("mensaje");

  const name = form.nombre.value.trim();
  const lastName = form.apellido?.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const address = form.direccion.value.trim();
  const city = form.ciudad.value.trim();
  const postalCode = form.codigo_postal.value.trim();
  const birthdate = form.fecha_nacimiento.value;
  const phone = form.telefono.value.trim();

  const datos = {
    name,
    lastName,
    email,
    password,
    address,
    city,
    postalCode,
    birthdate,
    phone,
    active: false
  };

  // 🟡 Mostrar mensaje de carga
  mensaje.textContent = "⏳ Procesando registro...";
  mensaje.classList.add("cargando");

  try {
    const res = await fetch("https://stepup-proyect.onrender.com/customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    const text = await res.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        console.error("Respuesta no es JSON válido:", text);
      }
    }

    // 🔵 Ocultar mensaje de carga
    mensaje.classList.remove("cargando");

    if (res.ok && data.ok !== false) {
      // Mostrar formulario de verificación
      document.querySelector(".register-container").innerHTML = `
        <h2>Verifica tu correo</h2>
        <p>Hemos enviado un código a <strong>${email}</strong>. Escríbelo abajo para activar tu cuenta.</p>
        <form id="verify-form">
          <input type="text" name="codigo" placeholder="Código de verificación" required>
          <input type="hidden" name="email" value="${email}">
          <button type="submit">Verificar</button>
        </form>
        <p id="mensaje-verificacion"></p>
      `;

      // Verificación del código
      document.getElementById("verify-form").addEventListener("submit", async function (e) {
        e.preventDefault();

        const codigo = document.querySelector('input[name="codigo"]').value.trim();
        const email = document.querySelector('input[name="email"]').value.trim();
        const mensaje = document.getElementById("mensaje-verificacion");

        mensaje.textContent = "⏳ Verificando código...";

        try {
          const res = await fetch(`https://stepup-proyect.onrender.com/customer/get/verify/email?email=${email}&code=${codigo}`);
          const isValid = await res.json();

          if (isValid === true) {
            mensaje.textContent = "✅ Cuenta verificada correctamente. Redirigiendo al login...";
            setTimeout(() => window.location.href = "login.html", 2000);
          } else {
            mensaje.textContent = "❌ Código incorrecto o expirado.";
          }
        } catch (err) {
          console.error("Error verificando código:", err);
          mensaje.textContent = "❌ Error de red o servidor.";
        }
      });

    } else {
      mensaje.textContent = "❌ No se pudo registrar. Intenta con otro correo.";
    }
  } catch (err) {
    console.error("Error inesperado:", err);
    mensaje.classList.remove("cargando");
    mensaje.textContent = "❌ Error de red o servidor caído.";
  }
});
