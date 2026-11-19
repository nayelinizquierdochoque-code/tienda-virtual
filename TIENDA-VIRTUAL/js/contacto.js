
const formulario = document.getElementById("formulario-contacto");

formulario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const celular = document.getElementById("celular").value.trim();
    const asunto = document.getElementById("asunto").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (!nombre || !correo || !celular || !asunto || !mensaje) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    if (!/^[0-9]{7,15}$/.test(celular)) {
        alert("Ingresa un número de celular válido.");
        return;
    }

    document.getElementById("confirmacion").textContent =
        "¡Gracias " + nombre + "! Tu mensaje fue enviado correctamente.";

    formulario.reset();

});
