function iniciarApp() {
  const selectCategorias = document.querySelector("#categorias");
  const resultado = document.querySelector("#resultado");
  const modal = new bootstrap.Modal("#modal", {});

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

      const comidaCard = document.createElement("div");
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
      // comidaButton.dataset.bsTarget = "#modal";
      // comidaButton.dataset.bsToggle = "modal";
      comidaButton.onclick = () => seleccionarReceta(idMeal);

      comidaCardBody.appendChild(comidaHeading);
      comidaCardBody.appendChild(comidaButton);

      comidaCard.appendChild(comidaImagen);
      comidaCard.appendChild(comidaCardBody);

      comidaContenedor.appendChild(comidaCard);

      resultado.appendChild(comidaContenedor);
    });
  }

  async function seleccionarReceta(id) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    try {
      const respuesta = await fetch(url);
      const receta = await respuesta.json();
      mostrarRecetaModal(receta.meals[0]);
    } catch (error) {
      console.log(error);
    }
  }

  function mostrarRecetaModal(receta) {
    const { idMeal, strInstructions, strMeal, strMealThumb } = receta;

    const modalTitle = document.querySelector(".modal .modal-title");
    const modalBody = document.querySelector(".modal .modal-body");
    const modalFooter = document.querySelector(".modal-footer");

    // Limpiar HTML previo
    limpiarHTML(modalBody);
    limpiarHTML(modalFooter);

    modalTitle.textContent = strMeal;

    const modalImage = document.createElement("img");
    modalImage.classList.add("img-fluid");
    modalImage.alt = `Receta de ${strMeal}`;
    modalImage.src = strMealThumb;

    const headingInstructions = document.createElement("h3");
    headingInstructions.classList.add("my-3");
    headingInstructions.textContent = "Instrucciones";

    const instructions = document.createElement("p");
    instructions.textContent = strInstructions;

    const headingIngredients = document.createElement("h3");
    headingIngredients.classList.add("my-3");
    headingIngredients.textContent = "Ingredientes y Cantidades";

    modalBody.appendChild(modalImage);
    modalBody.appendChild(headingInstructions);
    modalBody.appendChild(instructions);
    modalBody.appendChild(headingIngredients);

    const listGroup = document.createElement("ul");
    listGroup.classList.add("list-group");

    // Contar el numero de ingredientes
    const eRegular = /strIngredient\d\d*/;
    const nIngredients = Object.keys(receta).reduce(
      (total, propiedad) =>
        eRegular.test(propiedad) && receta[propiedad] !== ""
          ? total + 1
          : total,
      0
    );

    // Mostrar cantidades e ingredientes
    for (let i = 1; i <= nIngredients; i++) {
      const ingrediente = receta[`strIngredient${i}`];
      const cantidad = receta[`strMeasure${i}`];

      const ingredienteLi = document.createElement("li");
      ingredienteLi.classList.add("list-group-item");
      ingredienteLi.textContent = `${ingrediente} - ${cantidad}`;

      listGroup.appendChild(ingredienteLi);
    }

    modalBody.appendChild(listGroup);

    // Botones de cerrar y favorito
    const btnFavorito = document.createElement("button");
    btnFavorito.classList.add("btn", "btn-danger", "col");
    btnFavorito.textContent = "Guardar Favorito";
    btnFavorito.onclick = () =>
      agregarFavorito({ id: idMeal, titulo: strMeal, img: strMealThumb });

    const btnCerrarModal = document.createElement("button");
    btnCerrarModal.classList.add("btn", "btn-secondary", "col");
    btnCerrarModal.textContent = "Cerrar";
    btnCerrarModal.onclick = () => modal.hide();

    modalFooter.appendChild(btnFavorito);
    modalFooter.appendChild(btnCerrarModal);
    modal.show();
  }

  function agregarFavorito(receta) {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];
    localStorage.setItem("favoritos", JSON.stringify([...favoritos, receta]));
  }

  function limpiarHTML(referencia) {
    while (referencia.firstChild) {
      referencia.removeChild(referencia.firstChild);
    }
  }
}

document.addEventListener("DOMContentLoaded", iniciarApp);
