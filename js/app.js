function iniciarApp() {
  const selectCategorias = document.querySelector("#categorias");

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
}

document.addEventListener("DOMContentLoaded", iniciarApp);
