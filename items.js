const itemContent = document.getElementById("itemContent");
const searchForm = document.getElementById("searchItem");
const loadingSpinner = document.getElementById("loadingSpinner");

function formatItemName(itemName) {
  return itemName
    .toLowerCase() // Convertir todo a minúsculas para manejar la consistencia
    .split("-") // Dividir el nombre en partes por el guión
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizar la primera letra de cada palabra
    .join(" "); // Unir las palabras con un espacio
}

const categoryColors = {
  1: "#ffcccb",
  2: "#ffebcd",
  3: "#f0f8fe",
  4: "#f0f8fa",
  5: "#f0f8aa",
  6: "#f0f6ff",
  7: "#f0f7ff",
  8: "#e0f7fa",
  9: "#ccffcc",
  10: "#cfe8f3",
  11: "#fdebd0",
  12: "#fafad2",
  13: "#d3f8ef",
  14: "#f1cbff",
  15: "#f7c6e7",
  16: "#e7ffd5",
  17: "#d5fffb",
  18: "#f3e5ab",
  19: "#e2eff1",
  20: "#e6e6fa",
  21: "#fff0f5",
  22: "#ffe4e1",
  23: "#faf0e6",
  24: "#f0fff0",
  25: "#f5fffa",
  26: "#f0ffff",
  27: "#f5f5f5",
  28: "#fff5ee",
  29: "#f5f5dc",
  30: "#fdf5e6",
  31: "#fffafa",
  32: "#fffff0",
  33: "#faebd7",
  34: "#d2b48c",
  35: "#ffdead",
  36: "#deb887",
  37: "#ffdab9",
  38: "#e9967a",
  39: "#fa8072",
  40: "#ffa07a",
  41: "#dc143c",
  42: "#ff6347",
  43: "#ff4500",
  44: "#ff8c00",
  45: "#ffd700",
  46: "#ffffe0",
  47: "#fffacd",
  48: "#f0e68c",
  49: "#bdb76b",
  50: "#556b2f",
  51: "#66cdaa",
  52: "#8fbc8f",
  53: "#20b2aa",
  54: "#008b8b",
  55: "#00ffff",
  56: "#00ced1",
  57: "#40e0d0",
  58: "#48d1cc",
  59: "#00bfff",
  60: "#1e90ff",
  61: "#6495ed",
  62: "#4682b4",
  63: "#5f9ea0",
  64: "#b0c4de",
  65: "#add8e6",
  66: "#b0e0e6",
  67: "#afeeee",
  68: "#87cefa",
  69: "#87ceeb",
  70: "#00bfff",
};

const loadAllItems = async () => {
  let url = `https://pokeapi.co/api/v2/item?limit=50`; // Establece un límite según sea necesario
  let count = 0; // Contador para el número de objetos cargados
  const itemPromises = []; // Almacenar promesas de fetch

  loadingSpinner.style.display = "flex"; // Mostrar el spinner

  do {
    try {
      const res = await fetch(url);
      const data = await res.json();
      for (let itemData of data.results) {
        if (count >= 400) break; // Detiene la carga si ya se han cargado 400 objetos
        itemPromises.push(getItem(itemData.name)); // Añadir promesas de fetch al array
        count++; // Incrementa el contador por cada objeto cargado
      }
      url = count >= 400 ? null : data.next; // Detiene la iteración si se alcanza el máximo
    } catch (error) {
      console.error("Error fetching the items page:", error);
      break; // Sale del bucle si hay un error de red o de API
    }
  } while (url); // Continúa mientras haya más páginas y no se alcance el máximo

  // Espera a que todas las promesas de fetch se completen
  await Promise.all(itemPromises);

  loadingSpinner.style.display = "none"; // Ocultar el spinner
};

const getItem = async (itemName) => {
  try {
    const url = `https://pokeapi.co/api/v2/item/${itemName.toLowerCase()}`;
    const res = await fetch(url);
    const item = await res.json();

    // Extrae el ID de la categoría desde la URL de la categoría
    const categoryId = item.category.url.split("/").filter(Boolean).pop();
    displayItem(item, categoryId);
  } catch (error) {
    console.error("Error fetching item:", error);
    const itemEl = document.createElement("div");
    itemEl.classList.add("item-card");
    itemEl.textContent = `Failed to load ${itemName}`;
    itemContent.appendChild(itemEl);
  }
};

const displayItem = (item, categoryId) => {
  const itemEl = document.createElement("div");
  itemEl.classList.add("item-card");
  itemEl.setAttribute("data-category", categoryId); // Añade el ID de categoría como atributo data

  // Aplica el color basado en el ID de la categoría
  const color = categoryColors[categoryId] || "#ffffff"; // Color blanco por defecto
  itemEl.style.backgroundColor = color;

  const imageUrl = item.sprites.default;

  itemEl.innerHTML = `
    <div class="item-image">
      <img src="${imageUrl}" alt="${formatItemName(item.name)}">
    </div>
    <div class="item-info">
      <h3>${formatItemName(item.name)}</h3>
    </div>
  `;

  itemEl.onclick = () => {
    const modal = document.getElementById("itemModal");
    document.getElementById("itemName").textContent = formatItemName(item.name);
    document.getElementById("itemImage").src = imageUrl;
    document.getElementById("itemImage").alt = formatItemName(item.name);
    document.getElementById("itemDescription").textContent =
      item.effect_entries.find((entry) => entry.language.name === "en")?.effect;
    modal.style.display = "block";
  };

  itemContent.appendChild(itemEl);
};

// Función para cerrar el modal
window.onclick = function (event) {
  const modal = document.getElementById("itemModal");
  if (event.target == modal || event.target.className === "close") {
    modal.style.display = "none";
  }
};

// Función para buscar y filtrar los objetos por nombre
document.getElementById("item").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase().trim();
  searchItemsByName(searchTerm);
});

function searchItemsByName(searchTerm) {
  const items = document.querySelectorAll(".item-card");
  items.forEach((item) => {
    const itemName = item
      .querySelector(".item-info h3")
      .innerText.toLowerCase();
    const matchesName = itemName.includes(searchTerm);
    item.style.display = matchesName ? "block" : "none";
  });
}

document.addEventListener("DOMContentLoaded", loadAllItems); // Carga todos los objetos al cargar la página

document
  .getElementById("categorySelect")
  .addEventListener("change", function () {
    const selectedCategory = this.value;
    filterItemsByCategory(selectedCategory);
  });

function filterItemsByCategory(categoryId) {
  const items = document.querySelectorAll(".item-card");
  const berryCategories = ["2", "3", "4", "5", "6", "7", "8"]; // IDs de categorías que son berries
  const miscCategories = ["11", "12", "13", "14", "16"]; // IDs de categorías que son misceláneas

  items.forEach((item) => {
    if (categoryId === "all") {
      item.style.display = "block";
    } else if (
      categoryId === "berries" &&
      berryCategories.includes(item.getAttribute("data-category"))
    ) {
      item.style.display = "block";
    } else if (
      categoryId === "misc" &&
      miscCategories.includes(item.getAttribute("data-category"))
    ) {
      item.style.display = "block";
    } else if (item.getAttribute("data-category") === categoryId) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}
