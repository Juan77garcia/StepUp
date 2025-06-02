const nombre = localStorage.getItem("nombreUsuario") || "Cliente";
    const email = localStorage.getItem("usuarioLogeado") || "[correo no encontrado]";

    document.getElementById("nombre-cliente").textContent = `Hola, ${nombre}`;
    document.getElementById("mensaje-confirmacion").textContent = `La factura fue enviada a ${email}`;