
function mostrarCarrito() {

    const carrito = obtenerCarrito();
    const lista = document.getElementById("lista-carrito");

    lista.innerHTML = "";

    if (carrito.length === 0) {
        lista.innerHTML = `
            <div id="mensaje-carrito">
                <h2>Tu carrito está vacío</h2>
                <p>Agrega productos para comenzar tu compra.</p>
            </div>
        `;

        actualizarResumen();
        return;
    }

    carrito.forEach(producto => {

        const elemento = document.createElement("article");
        elemento.className = "producto-carrito";

        elemento.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">

            <div>
                <h3>${producto.nombre}</h3>

                <p>Precio: Bs ${producto.precio.toFixed(2)}</p>

                <div class="cantidad">
                    <button data-restar="${producto.id}">-</button>

                    <strong>${producto.cantidad}</strong>

                    <button data-sumar="${producto.id}">+</button>
                </div>
            </div>

            <button class="eliminar" data-eliminar="${producto.id}">
                Eliminar
            </button>
        `;

        lista.appendChild(elemento);
    });

    actualizarResumen();
}

function actualizarResumen() {

    const carrito = obtenerCarrito();

    const cantidad = carrito.reduce(
        (suma, p) => suma + p.cantidad, 0
    );

    const total = carrito.reduce(
        (suma, p) => suma + p.precio * p.cantidad, 0
    );

    document.getElementById("cantidad-total").textContent =
        "Productos: " + cantidad;

    document.getElementById("total-compra").textContent =
        "Total: Bs " + total.toFixed(2);

    actualizarContador();
}

function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

async function cambiarCantidad(id, cambio) {

    const carrito = obtenerCarrito();

    const producto = carrito.find(p => p.id === id);

    if (!producto) return;

    if (cambio > 0) {
        const respuesta = await fetch("data/productos.json");
        const productos = await respuesta.json();

        const original = productos.find(p => p.id === id);

        if (!original || producto.cantidad >= original.stock) {
            alert("No hay más unidades disponibles.");
            return;
        }
    }

    producto.cantidad += cambio;

    if (producto.cantidad <= 0) {
        return eliminarProducto(id);
    }

    guardarCarrito(carrito);
}

function eliminarProducto(id) {

    const carrito = obtenerCarrito().filter(
        p => p.id !== id
    );

    guardarCarrito(carrito);
}

function vaciarCarrito() {

    if (!confirm("¿Deseas vaciar todo el carrito?")) {
        return;
    }

    localStorage.removeItem("carrito");

    document.getElementById("mensaje-final").textContent = "";

    mostrarCarrito();
}

function finalizarCompra() {

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const total = carrito.reduce(
        (suma, p) => suma + p.precio * p.cantidad, 0
    );

    alert(
        "¡Compra simulada correctamente!\n" +
        "Total: Bs " + total.toFixed(2) +
        "\nGracias por comprar en NOVA STORE."
    );

    localStorage.removeItem("carrito");

    document.getElementById("mensaje-final").textContent =
        "¡Gracias por tu compra!";

    mostrarCarrito();
}

document.getElementById("lista-carrito").addEventListener(
    "click", evento => {

        const sumar = evento.target.closest("[data-sumar]");
        const restar = evento.target.closest("[data-restar]");
        const eliminar = evento.target.closest("[data-eliminar]");

        if (sumar) {
            cambiarCantidad(Number(sumar.dataset.sumar), 1);
        }

        if (restar) {
            cambiarCantidad(Number(restar.dataset.restar), -1);
        }

        if (eliminar) {
            eliminarProducto(Number(eliminar.dataset.eliminar));
        }
    }
);

mostrarCarrito();
