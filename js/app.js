function iniciarApp() {
  const selectCategorias = document.querySelector("#categorias");
  const resultado = document.querySelector("#resultado");

  selectCategorias.addEventListener("change", filtrarPorCategoria);

  obtenerCategorias();

  async function obtenerCategorias() {
    const url = "https://www.themealdb.com/api/json/v1/1/categories.php";

    try {
      const respuesta = await fetch(url);
      const categorias = await respuesta.json();
      mostrarCategorias(categorias.categories);
    } catch (error) {
      console.log(error);
    }
  }

  function mostrarCategorias(categorias = []) {
    categorias.forEach((categoria) => {
      const { strCategory } = categoria;
      const option = document.createElement("option");
      option.value = strCategory;
      option.textContent = strCategory;
      selectCategorias.appendChild(option);
    });
  }

  async function filtrarPorCategoria(e) {
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${e.target.value}`;
    try {
      const respuesta = await fetch(url);
      const comidas = await respuesta.json();
      mostrarRecetas(comidas.meals);
    } catch (error) {
      console.log(error);
    }
  }

  function mostrarRecetas(comidas = []) {
    // Limpiar el HTML previo
    limpiarHTML(resultado);

    const heading = document.createElement("h2");
    heading.classList.add("text-center", "text-black", "my-5");
    heading.textContent = comidas.length ? "Resultados" : "No hay resultados";

    resultado.appendChild(heading);

    comidas.forEach((comida) => {
      const { idMeal, strMeal, strMealThumb } = comida;

      const comidaContenedor = document.createElement("div");
      comidaContenedor.classList.add("col-md-4");

      const comidaCard =  document.createElement("div");
      comidaCard.classList.add("card", "mb-4");

      const comidaImagen = document.createElement("img");
      comidaImagen.classList.add("card-img-top");
      comidaImagen.alt = `Imagen de la comida ${strMeal}`;
      comidaImagen.src = strMealThumb;

      const comidaCardBody = document.createElement("div");
      comidaCardBody.classList.add("card-body");

      const comidaHeading = document.createElement("h3");
      comidaHeading.classList.add("card-title", "mb-3", "text-center");
      comidaHeading.textContent = strMeal;

      const comidaButton = document.createElement("button");
      comidaButton.classList.add("btn", "btn-danger", "w-100");
      comidaButton.textContent = "Ver receta";

      comidaCardBody.appendChild(comidaHeading);
      comidaCardBody.appendChild(comidaButton);

      comidaCard.appendChild(comidaImagen);
      comidaCard.appendChild(comidaCardBody);

      comidaContenedor.appendChild(comidaCard);

      resultado.appendChild(comidaContenedor);
    });
  }

  function limpiarHTML(referencia) {
    while (referencia.firstChild) {
      referencia.removeChild(referencia.firstChild);
    }
  }
}

document.addEventListener("DOMContentLoaded", iniciarApp);
