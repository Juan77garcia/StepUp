document.getElementById("register-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;

  const name = form.nombre.value.trim();
  const lastName = form.apellido?.value.trim(); // usar ? por si no existe
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

  console.log("✅ Datos enviados:", datos);

  try {
    const res = await fetch("https://stepup-proyect.onrender.com/customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    // Esperar texto primero
    const text = await res.text();

    // Intentar parsear JSON si hay contenido
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        console.error("❌ Respuesta no es JSON válido:", text);
      }
    }

    // Mostrar verificación si todo va bien
    if (res.ok && data.ok !== false) {
      
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

      // Verificar código
      document.getElementById("verify-form").addEventListener("submit", async function (e) {
        e.preventDefault();

        const codigo = document.querySelector('input[name="codigo"]').value;
        const email = document.querySelector('input[name="email"]').value;

        try {
          const res = await fetch(`https://stepup-proyect.onrender.com/customer/get/verify/email?email=${email}&code=${codigo}`);
          const isValid = await res.json();

          const mensaje = document.getElementById("mensaje-verificacion");
          if (isValid === true) {
            mensaje.textContent = "✅ Cuenta verificada correctamente. Redirigiendo al login...";
            setTimeout(() => window.location.href = "login.html", 2000);
          } else {
            mensaje.textContent = "❌ Código incorrecto o expirado.";
          }
        } catch (err) {
          console.error("❌ Error verificando código:", err);
          document.getElementById("mensaje-verificacion").textContent = "❌ Error de red.";
        }
      });
    } else {
      console.error("❌ Error en respuesta:", data);
      document.getElementById("mensaje").textContent = "❌ No se pudo completar el registro. Verifica los datos.";
    }

  } catch (err) {
    console.error("❌ Error inesperado:", err);
    document.getElementById("mensaje").textContent = "❌ Error de red o servidor caído.";
  }
});
