
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
  }
  
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
  
  document.addEventListener("DOMContentLoaded", actualizarContador);
  