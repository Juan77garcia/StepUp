if (data.ok) {
  // En lugar de redirigir de inmediato:
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

  document.getElementById("verify-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const codigo = document.querySelector('input[name="codigo"]').value;
    const email = document.querySelector('input[name="email"]').value;

    fetch("/api/verificar-codigo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, codigo })
    })
    .then(res => res.json())
    .then(data => {
      const mensaje = document.getElementById("mensaje-verificacion");
      if (data.ok) {
        mensaje.textContent = "✅ Cuenta verificada correctamente. Redirigiendo al login...";
        setTimeout(() => window.location.href = "login.html", 2000);
      } else {
        mensaje.textContent = "❌ Código incorrecto o expirado.";
      }
    })
    .catch(err => {
      console.error(err);
      document.getElementById("mensaje-verificacion").textContent = "❌ Error al verificar el código.";
    });
  });
}
