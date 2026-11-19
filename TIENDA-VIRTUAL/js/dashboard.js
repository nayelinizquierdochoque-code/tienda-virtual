
async function cargarDashboard() {
    try {
        const respuesta = await fetch("data/productos.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar productos.json");
        }

        const productos = await respuesta.json();

        // CALCULAR ESTADÍSTICAS

        const totalProductos = productos.length;

        const categorias = [...new Set(
            productos.map(p => p.categoria)
        )];

        const valorInventario = productos.reduce(
            (total, p) => total + (p.precio * p.stock), 0
        );

        const disponibles = productos.filter(
            p => p.stock > 0
        ).length;

        const agotados = productos.filter(
            p => p.stock === 0
        ).length;

        const bajoStock = productos.filter(
            p => p.stock > 0 && p.stock <= 5
        );

        // MOSTRAR ESTADÍSTICAS

        document.getElementById("total-productos").textContent =
            totalProductos;

        document.getElementById("total-categorias").textContent =
            categorias.length;

        document.getElementById("valor-inventario").textContent =
            "Bs " + valorInventario.toLocaleString("es-BO");

        document.getElementById("disponibles").textContent =
            disponibles;

        document.getElementById("agotados").textContent =
            agotados;

        document.getElementById("bajo-stock").textContent =
            bajoStock.length;

        // FECHA Y HORA

        document.getElementById("actualizacion").textContent =
            "Última actualización: " +
            new Date().toLocaleString("es-BO");

        // PRODUCTOS POR CATEGORÍA

        const cantidadesCategoria = categorias.map(categoria => {
            return productos.filter(
                p => p.categoria === categoria
            ).length;
        });

        new Chart(document.getElementById("grafico-categorias"), {
            type: "bar",
            data: {
                labels: categorias,
                datasets: [{
                    label: "Cantidad de productos",
                    data: cantidadesCategoria,
                    backgroundColor: [
                        "#2563eb",
                        "#38bdf8",
                        "#172554"
                    ],
                    borderRadius: 7
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });

        // DISTRIBUCIÓN DEL STOCK

        const stockNormal = productos.filter(
            p => p.stock > 5
        ).length;

        const stockBajo = bajoStock.length;

        const stockAgotado = agotados;

        new Chart(document.getElementById("grafico-stock"), {
            type: "doughnut",
            data: {
                labels: [
                    "Stock normal",
                    "Stock bajo",
                    "Agotados"
                ],
                datasets: [{
                    data: [
                        stockNormal,
                        stockBajo,
                        stockAgotado
                    ],
                    backgroundColor: [
                        "#16a34a",
                        "#f59e0b",
                        "#dc2626"
                    ]
                }]
            },
            options: {
                responsive: true
            }
        });

        // TABLA DE BAJO INVENTARIO

        const tabla = document.getElementById("tabla-bajo-stock");

        tabla.innerHTML = "";

        if (bajoStock.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="4">No hay productos con bajo stock.</td>
                </tr>
            `;
        } else {
            bajoStock.forEach(producto => {
                tabla.innerHTML += `
                    <tr>
                        <td>${producto.nombre}</td>
                        <td>${producto.categoria}</td>
                        <td>Bs ${producto.precio.toFixed(2)}</td>
                        <td>${producto.stock}</td>
                    </tr>
                `;
            });
        }

    } catch (error) {
        console.error("Error en el dashboard:", error);

        document.getElementById("error-dashboard").textContent =
            "Error al cargar los datos. Verifica productos.json y utiliza Live Server.";
    }
}

cargarDashboard();
