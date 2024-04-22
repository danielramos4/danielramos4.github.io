const itemContent = document.getElementById("itemContent");
const searchForm = document.getElementById("searchItem");

const loadAllItems = async () => {
  let url = `https://pokeapi.co/api/v2/item?limit=50`; // Establece un límite según sea necesario
  do {
    const res = await fetch(url);
    const data = await res.json();
    data.results.forEach((itemData) => getItem(itemData.name));
    url = data.next; // Prepara la siguiente página de datos
  } while (url); // Continúa mientras haya más páginas
};

const getItem = async (itemName) => {
  try {
    const url = `https://pokeapi.co/api/v2/item/${itemName.toLowerCase()}`;
    const res = await fetch(url);
    const item = await res.json();
    displayItem(item);
  } catch (error) {
    console.error("Error fetching item:", error);
  }
};

const displayItem = (item) => {
  const itemEl = document.createElement("div");
  itemEl.classList.add("item-card");

  const imageUrl = item.sprites.default;

  itemEl.innerHTML = `
    <div class="item-image">
      <img src="${imageUrl}" alt="${item.name}">
    </div>
    <div class="item-info">
      <h3>${item.name}</h3>
      <p>${
        item.effect_entries.find((entry) => entry.language.name === "en")
          ?.effect
      }</p>
    </div>
  `;

  itemContent.appendChild(itemEl);
};

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const itemName = document.getElementById("item").value;
  itemContent.innerHTML = ""; // Clear previous results
  getItem(itemName);
});

document.addEventListener("DOMContentLoaded", loadAllItems); // Carga todos los objetos al cargar la página
