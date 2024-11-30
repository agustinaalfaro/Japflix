let moviesData = []; // Variable global para almacenar los datos de las películas

// Función que se ejecuta al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Cargar datos de la API
        const response = await fetch("https://japceibal.github.io/japflix_api/movies-data.json");
        moviesData = await response.json();
        console.log("Películas cargadas:", moviesData); // Depuración
    } catch (error) {
        console.error("Error al cargar las películas:", error);
    }
});

// Evento para buscar películas
document.getElementById("btnBuscar").addEventListener("click", () => {
    const query = document.getElementById("inputBuscar").value.toLowerCase(); // Valor del input
    if (!query) {
        alert("Por favor, ingresa un texto para buscar.");
        return;
    }

    // Filtrar películas según la búsqueda
    const results = moviesData.filter(movie =>
        movie.title.toLowerCase().includes(query) ||
        movie.genres.some(genre => typeof genre === "string" && genre.toLowerCase().includes(query)) || // Verificación de tipo
        (movie.tagline && movie.tagline.toLowerCase().includes(query)) ||
        (movie.overview && movie.overview.toLowerCase().includes(query))
    );

    // Renderizar los resultados en la página
    renderMovies(results);
});

// Función para renderizar las películas en la lista
function renderMovies(movies) {
    const lista = document.getElementById("lista");
    lista.innerHTML = ""; // Limpiar resultados anteriores

    if (movies.length === 0) {
        lista.innerHTML = `<li class="list-group-item text-white bg-dark">No se encontraron resultados.</li>`;
        return;
    }

    movies.forEach(movie => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "bg-dark", "text-white", "mb-2");

        // Título y tagline
        listItem.innerHTML = `
            <h5>${movie.title}</h5>
            <p>${movie.tagline || "Sin tagline"}</p>
            <div>${renderStars(movie.vote_average)}</div>
        `;

        // Evento al hacer clic para mostrar detalles
        listItem.addEventListener("click", () => showMovieDetails(movie));

        lista.appendChild(listItem);
    });
}

// Función para mostrar estrellas según el promedio de votos
function renderStars(voteAverage) {
    const stars = Math.round(voteAverage / 2); // Convertir a una escala de 5
    return "★".repeat(stars) + "☆".repeat(5 - stars);
}

// Función para mostrar detalles de la película seleccionada
function showMovieDetails(movie) {
    // Crear contenido del modal
    const modalContent = `
        <h2>${movie.title}</h2>
        <p>${movie.overview || "Sin descripción disponible."}</p>
        <p><strong>Géneros:</strong> ${movie.genres.join(", ")}</p>
        <button class="btn btn-secondary dropdown-toggle mt-2" data-bs-toggle="dropdown">
            Más detalles
        </button>
        <ul class="dropdown-menu">
            <li><strong>Año:</strong> ${movie.release_date.split("-")[0]}</li>
            <li><strong>Duración:</strong> ${movie.runtime || "N/A"} mins</li>
            <li><strong>Presupuesto:</strong> $${movie.budget.toLocaleString()}</li>
            <li><strong>Ganancias:</strong> $${movie.revenue.toLocaleString()}</li>
        </ul>
    `;

    // Crear el modal dinámicamente
    const modal = document.createElement("div");
    modal.classList.add("offcanvas", "offcanvas-top", "bg-dark", "text-white");
    modal.innerHTML = `
        <div class="offcanvas-header">
            <h5 class="offcanvas-title">${movie.title}</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            ${modalContent}
        </div>
    `;

    document.body.appendChild(modal);

    // Mostrar el modal
    const offcanvas = new bootstrap.Offcanvas(modal);
    offcanvas.show();

    // Eliminar el modal del DOM al cerrarlo
    modal.addEventListener("hidden.bs.offcanvas", () => modal.remove());
}
