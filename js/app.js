function iniciarApp() {
  obtenerCategorias();

  async function obtenerCategorias() {
    const url = "https://www.themealdb.com/api/json/v1/1/categories.php";

    try {
      const respuesta = await fetch(url);
      const categorias = await respuesta.json();
      console.log(categorias);
    } catch (error) {
      console.log(error);
    }
  }
}

document.addEventListener("DOMContentLoaded", iniciarApp);
