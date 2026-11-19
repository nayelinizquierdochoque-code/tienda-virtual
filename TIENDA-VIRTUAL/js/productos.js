let todosLosProductos = [];

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    actualizarContador();
});

function normalizarTexto(texto) {
    return (texto || "")
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

async function cargarProductos() {
    try {
        const respuesta = await fetch("data/productos.json");
        todosLosProductos = await respuesta.json();
        configurarFiltros();
        aplicarFiltros();
    } catch (error) {
        console.error("Error al cargar productos.json:", error);
    }
}

function configurarFiltros() {
    const inputBuscar = document.querySelector(".controles input");
    const selects = document.querySelectorAll(".controles select");

    // Si vienes desde un enlace como productos.html?categoria=Electronica
    const params = new URLSearchParams(window.location.search);
    const catUrl = params.get("categoria");
    if (catUrl && selects[0]) {
        for (const opcion of selects[0].options) {
            if (
                normalizarTexto(opcion.value) === normalizarTexto(catUrl) ||
                normalizarTexto(opcion.text) === normalizarTexto(catUrl)
            ) {
                selects[0].value = opcion.value;
                break;
            }
        }
    }

    if (inputBuscar) {
        inputBuscar.addEventListener("input", aplicarFiltros);
    }

    selects.forEach(select => {
        select.addEventListener("change", aplicarFiltros);
    });
}

function aplicarFiltros() {
    const inputBuscar = document.querySelector(".controles input");
    const selects = document.querySelectorAll(".controles select");

    const textoBusqueda = inputBuscar ? normalizarTexto(inputBuscar.value) : "";
    const categoriaSel = selects[0] ? normalizarTexto(selects[0].value) : "";
    const ordenPrecio = selects[1] ? normalizarTexto(selects[1].value) : "";
    const estadoStock = selects[2] ? normalizarTexto(selects[2].value) : "";

    let filtrados = [...todosLosProductos];

    // 1. Buscar por nombre o descripción
    if (textoBusqueda !== "") {
        filtrados = filtrados.filter(p =>
            normalizarTexto(p.nombre).includes(textoBusqueda) ||
            normalizarTexto(p.descripcion).includes(textoBusqueda)
        );
    }

    // 2. Filtrar por categoría
    if (categoriaSel !== "" && !categoriaSel.includes("todas")) {
        filtrados = filtrados.filter(p =>
            normalizarTexto(p.categoria) === categoriaSel
        );
    }

    // 3. Filtrar por disponibilidad / stock
    if (estadoStock !== "" && !estadoStock.includes("todos")) {
        filtrados = filtrados.filter(p => {
            const tieneStock = p.stock !== undefined ? Number(p.stock) > 0 : p.disponible !== false;
            if (estadoStock.includes("disponible") || estadoStock.includes("stock")) {
                return tieneStock;
            }
            if (estadoStock.includes("agotado") || estadoStock.includes("sin")) {
                return !tieneStock;
            }
            return true;
        });
    }

    // 4. Ordenar por precio (menor a mayor / mayor a menor)
    if (ordenPrecio.includes("menor") || ordenPrecio.includes("asc")) {
        filtrados.sort((a, b) => Number(a.precio) - Number(b.precio));
    } else if (ordenPrecio.includes("mayor") || ordenPrecio.includes("desc")) {
        filtrados.sort((a, b) => Number(b.precio) - Number(a.precio));
    }

    mostrarProductos(filtrados);
}

function mostrarProductos(lista) {
    const contenedor = document.querySelector(".productos-grid") || document.getElementById("lista-productos");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron productos con esos filtros.</p>";
        return;
    }

    lista.forEach(producto => {
        const tieneStock = producto.stock !== undefined ? Number(producto.stock) > 0 : producto.disponible !== false;
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("producto-card");

        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='img/logo.png'">
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion || ""}</p>
                <p class="stock ${tieneStock ? "disponible" : "agotado"}">
                    ${tieneStock ? `Disponible${producto.stock !== undefined ? ` (${producto.stock})` : ""}` : "Agotado"}
                </p>
                <p class="precio">$${Number(producto.precio).toFixed(2)}</p>
                <button class="btn" ${!tieneStock ? "disabled" : ""} onclick="agregarAlCarrito(${producto.id})">
                    ${tieneStock ? "Agregar al carrito" : "Sin stock"}
                </button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}

function agregarAlCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const producto = todosLosProductos.find(p => p.id === id);
    if (!producto) return;

    const existente = carrito.find(item => item.id === id);
    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
    alert(`"${producto.nombre}" se agregó al carrito.`);
}

function actualizarContador() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const contador = document.getElementById("contador-carrito") || document.getElementById("carrito-contador");
    if (contador) contador.textContent = total;
}