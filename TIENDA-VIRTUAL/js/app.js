
// OBTENER LOS PRODUCTOS DEL CARRITO
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

// ACTUALIZAR EL CONTADOR DEL CARRITO
function actualizarContador() {

    const carrito = obtenerCarrito();

    const total = carrito.reduce(
        (suma, producto) => suma + producto.cantidad,
        0
    );

    document.querySelectorAll(".contador-carrito").forEach(elemento => {
        elemento.textContent = total;
    });
}

// ACTUALIZAR EL CONTADOR AL ABRIR LA PÁGINA
document.addEventListener("DOMContentLoaded", function() {
    actualizarContador();
});
