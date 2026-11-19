
let productos = [];

const contenedor = document.getElementById("lista-productos");
const buscar = document.getElementById("buscar");
const categoria = document.getElementById("categoria");
const ordenar = document.getElementById("ordenar");
const disponibilidad = document.getElementById("disponibilidad");

async function cargarProductos() {
  try {
    const respuesta = await fetch("data/productos.json");

    if (!respuesta.ok) {
      throw new Error("No se pudieron cargar los productos");
    }

    productos = await respuesta.json();
    mostrarProductos(productos);

  } catch (error) {
    contenedor.innerHTML =
      "<p>Error al cargar los productos. Verifica el archivo JSON.</p>";

    console.error(error);
  }
}

function mostrarProductos(lista) {
  contenedor.innerHTML = "";

  document.getElementById("cantidad-resultados").textContent =
    `Se encontraron ${lista.length} productos`;

  if (lista.length === 0) {
    contenedor.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }

  lista.forEach(producto => {
    const estado = producto.stock > 0
      ? `<span class="stock disponible">Disponible: ${producto.stock}</span>`
      : `<span class="stock agotado">Producto agotado</span>`;

    const tarjeta = document.createElement("article");
    tarjeta.className = "producto-card";

    tarjeta.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}"
           loading="lazy">

      <div class="producto-info">
        <h3>${producto.nombre}</h3>

        <p>${producto.descripcion}</p>

        <p>Categoría: ${producto.categoria}</p>

        <div class="precio">Bs ${producto.precio.toFixed(2)}</div>

        ${estado}

        <br><br>

        <button class="btn" data-detalle="${producto.id}">
          Ver detalles
        </button>

        <button class="btn" data-agregar="${producto.id}"
          ${producto.stock === 0 ? "disabled" : ""}>
          Agregar al carrito
        </button>
      </div>
    `;

    contenedor.appendChild(tarjeta);
  });
}

function filtrarProductos() {
  let resultado = [...productos];

  const texto = buscar.value.toLowerCase();
  const cat = categoria.value;
  const orden = ordenar.value;
  const estado = disponibilidad.value;

  resultado = resultado.filter(producto =>
    producto.nombre.toLowerCase().includes(texto)
  );

  if (cat) {
    resultado = resultado.filter(p => p.categoria === cat);
  }

  if (estado === "disponible") {
    resultado = resultado.filter(p => p.stock > 0);
  }

  if (estado === "agotado") {
    resultado = resultado.filter(p => p.stock === 0);
  }

  if (orden === "menor") {
    resultado.sort((a, b) => a.precio - b.precio);
  }

  if (orden === "mayor") {
    resultado.sort((a, b) => b.precio - a.precio);
  }

  mostrarProductos(resultado);
}

buscar.addEventListener("input", filtrarProductos);
categoria.addEventListener("change", filtrarProductos);
ordenar.addEventListener("change", filtrarProductos);
disponibilidad.addEventListener("change", filtrarProductos);

contenedor.addEventListener("click", evento => {
  const agregar = evento.target.closest("[data-agregar]");
  const detalle = evento.target.closest("[data-detalle]");

  if (agregar) {
    agregarAlCarrito(Number(agregar.dataset.agregar));
  }

  if (detalle) {
    const id = Number(detalle.dataset.detalle);
    const producto = productos.find(p => p.id === id);

    alert(
      `${producto.nombre}\n\n${producto.descripcion}\n\n` +
      `Precio: Bs ${producto.precio}\nStock: ${producto.stock}`
    );
  }
});

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);

  if (!producto || producto.stock <= 0) return;

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const existente = carrito.find(p => p.id === id);

  if (existente) {
    if (existente.cantidad >= producto.stock) {
      alert("No hay suficiente stock disponible.");
      return;
    }

    existente.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  actualizarContador();

  alert("¡Producto agregado al carrito!");
}

cargarProductos();
