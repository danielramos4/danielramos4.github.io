const pokeContent = document.getElementById("pokemonContent");
const divGeneration = document.getElementById("textGen");
/*ordenar xr generacion*/
/*Primera Gen 1-151*/
/*Segunda Gen 152-251*/
/*tercera Gen 252-386*/

function showPokemonGen(gen) {
  const pokemonGen = {
    1: [1, 151],
    2: [152, 251],
    3: [252, 386],
  };

  const pokemonGenDefault = [1, 151];
  const generacion = pokemonGen[gen] || pokemonGenDefault;
  return generacion;
}

let generationshow = 1;
let pokemonGeneration = showPokemonGen(generationshow);

/*cambiar de generacion*/

let arrowRight = document
  .getElementById("arrow-right")
  .addEventListener("click", (e) => {
    if (generationshow < 4) {
      pokeContent.innerHTML = "";
      generationshow += 1;
      pokemonGeneration = showPokemonGen(generationshow);
      divGeneration.innerHTML = "Gen " + generationshow;
      drawPokemon();
    }
  });

let arrowLeft = document
  .getElementById("arrow-left")
  .addEventListener("click", (e) => {
    if (generationshow > 1) {
      pokeContent.innerHTML = "";
      generationshow -= 1;
      pokemonGeneration = showPokemonGen(generationshow);
      divGeneration.innerHTML = "Gen " + generationshow;
      drawPokemon();
    }
  });

const drawPokemon = async () => {
  for (let i = pokemonGeneration[0]; i <= pokemonGeneration[1]; i++) {
    await getPokemon(i);
  }
};

// Actualiza tu función getPokemon para manejar el clic en cada tarjeta Pokémon
async function getPokemon(id) {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const pokemon = await res.json();

    // Fetch adicional para obtener información de la especie, incluida la descripción
    const speciesUrl = pokemon.species.url; // URL de la especie del Pokémon
    const speciesResponse = await fetch(speciesUrl);
    const speciesData = await speciesResponse.json();

    // Encuentra la descripción en inglés
    const englishFlavorText = speciesData.flavor_text_entries.find(
      (flavor) => flavor.language.name === "es"
    );

    const pokemonCard = createPokemon(pokemon);
    pokemonCard.onclick = () =>
      mostrarDetallesPokemon(
        pokemon,
        englishFlavorText
          ? englishFlavorText.flavor_text
          : "No description available."
      );
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
  }
}

function createPokemon(pokemon) {
  const pokemonEl = document.createElement("div");
  pokemonEl.classList.add("pokemon");
  pokemon.types.forEach((type) => {
    pokemonEl.classList.add(type.type.name.toLowerCase()); // Asegúrate de que las clases están en minúsculas
  });

  const imageUrl = pokemon.sprites.front_default;
  const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const color = colors[pokemon.types[0].type.name.toLowerCase()]; // Asegúrate de que el acceso a los colores también esté en minúsculas

  pokemonEl.style.backgroundColor = color;
  pokemonEl.innerHTML = `
      <div class="img-container">
          <img src="${imageUrl}" alt="${name}" />
      </div>
      <div class="info">
          <span class="number">#${pokemon.id.toString().padStart(3, "0")}</span>
          <h3 class="name">${name}</h3>
          <small class="type">Tipo: ${pokemon.types
            .map((type) => type.type.name)
            .join(", ")}</small>
      </div>
  `;

  pokeContent.appendChild(pokemonEl);
  return pokemonEl;
}

/*pintar card pokemon*/
const colors = {
  fire: "#FD7D24",
  grass: "#9BCC50",
  electric: "#EED535",
  water: "#4592C4",
  ground: "#AB9842",
  rock: "#A38C21",
  poison: "#B97FC9",
  bug: "#729F3F",
  dragon: "#150eeb",
  psychic: "#F366B9",
  flying: "#95bdbf",
  fighting: "#D56723",
  normal: "#A4ACAF",
  ghost: "#7B62A3",
  fairy: "#FDB9E9",
  steel: "#9EB7B8",
  ice: "#51C4E7",
  dark: "#707070",
};

const main_types = Object.keys(colors);

// Función para cerrar el modal
function cerrarModal() {
  const modal = document.getElementById("pokemon-modal");
  modal.style.display = "none";
}

// Función para crear y mostrar el modal con más información del Pokémon
function mostrarDetallesPokemon(pokemon, description) {
  const modal = document.getElementById("pokemon-modal");
  const modalContent = document.createElement("div");
  modalContent.classList.add("pokemon-detalles");

  // Base size for Pokémon image is 100px for 1 meter (10 decimeters)
  const baseHeight = 150; // 100 pixels
  const imageHeight =
    pokemon.height < 30 ? baseHeight : (pokemon.height / 20) * baseHeight; // Scale based on Pokémon height if it's greater than or equal to 1 meter

  // Agrega aquí más detalles que quieras mostrar en tu modal
  modalContent.innerHTML = `
    <h2>${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h2>
    <img src="${pokemon.sprites.other["showdown"].front_default}" alt="${
    pokemon.name
  }" style="height: ${imageHeight}px;" />
    <p>Tipo: ${pokemon.types.map((type) => type.type.name).join(", ")}</p>
    <p>Altura: ${pokemon.height / 10} metros</p>
    <p>Peso: ${pokemon.weight / 10} KG</p>
    <p>Descripción: ${description}</p>
    <a type="button" class="btn btn-outline-light" href="https://www.pokemon.com/es/pokedex/${
      pokemon.name
    }" target="_blank" rel="noopener noreferrer">Más información</a>
    
    <button type="button" class="btn btn-outline-danger" onclick="cerrarModal()">Cerrar</button>
    `;

  // Limpia el contenido anterior y agrega el nuevo
  modal.innerHTML = "";
  modal.appendChild(modalContent);

  // Muestra el modal
  modal.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("pokemon-modal");
  const modalContent = document.getElementById("modalContent");

  modal.addEventListener("click", function (event) {
    // Verifica si el clic fue fuera del contenido del modal
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Función para cerrar el modal que puede ser llamada por un botón de cierre
  window.cerrarModal = function () {
    modal.style.display = "none";
  };
});

// Asegúrate de llamar a la función drawPokemon al cargar la página o cuando sea necesario
drawPokemon();

/*Buscar pokemon*/

function exitModal() {
  const modalPokemon = document.getElementById("modalPokemon");
  modalPokemon.style.display = "none";
  drawPokemon();
}

document.getElementById("typeSelect").addEventListener("change", function () {
  filterPokemonByType(this.value); // Pasar el valor seleccionado a la función de filtrado
});

function filterPokemonByType(selectedType) {
  const pokemons = document.querySelectorAll(".pokemon");
  console.log(`Filtrando por tipo: ${selectedType}`); // Para depuración

  pokemons.forEach((pokemon) => {
    const matchesType =
      selectedType === "all" || pokemon.classList.contains(selectedType);
    pokemon.style.display = matchesType ? "block" : "none";
  });
}
