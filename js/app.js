function iniciarApp() {
  const selectCategorias = document.querySelector("#categorias");

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
    });
  }
}

document.addEventListener("DOMContentLoaded", iniciarApp);
