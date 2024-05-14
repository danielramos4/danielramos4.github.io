const pokeContent = document.getElementById("pokemonContent");
const divGeneration = document.getElementById("textGen");
const loadingSpinner = document.getElementById("loadingSpinner");

function showPokemonGen(gen) {
  const pokemonGen = {
    1: [1, 151], // Gen 1: Bulbasaur (#001) to Mew (#151)
    2: [152, 251], // Gen 2: Chikorita (#152) to Celebi (#251)
    3: [252, 386], // Gen 3: Treecko (#252) to Deoxys (#386)
    4: [387, 493], // Gen 4: Turtwig (#387) to Arceus (#493)
    5: [494, 649], // Gen 5: Victini (#494) to Genesect (#649)
    6: [650, 721], // Gen 6: Chespin (#650) to Volcanion (#721)
    7: [722, 809], // Gen 7: Rowlet (#722) to Melmetal (#809)
    8: [810, 905], // Gen 8: Grookey (#810) to Enamorus (#905)
    9: [906, 1010],
  };

  const pokemonGenDefault = [1, 151];
  const generacion = pokemonGen[gen] || pokemonGenDefault;
  return generacion;
}

let generationshow = 1;
let pokemonGeneration = showPokemonGen(generationshow);

document.getElementById("arrow-right").addEventListener("click", (e) => {
  if (generationshow < 9) {
    generationshow += 1;
    pokemonGeneration = showPokemonGen(generationshow);
    divGeneration.innerHTML = "Gen " + generationshow;
    drawPokemon();
  }
});

document.getElementById("arrow-left").addEventListener("click", (e) => {
  if (generationshow > 1) {
    generationshow -= 1;
    pokemonGeneration = showPokemonGen(generationshow);
    divGeneration.innerHTML = "Gen " + generationshow;
    drawPokemon();
  }
});

const drawPokemon = async () => {
  pokeContent.innerHTML = ""; // Limpiar el contenido antes de dibujar
  loadingSpinner.style.display = "flex"; // Mostrar el spinner

  const pokemonPromises = [];

  for (let i = pokemonGeneration[0]; i <= pokemonGeneration[1]; i++) {
    pokemonPromises.push(getPokemon(i));
  }

  try {
    const pokemonData = await Promise.all(pokemonPromises);
    pokemonData.forEach((data) => {
      if (data) {
        const pokemonCard = createPokemon(data);
        pokeContent.appendChild(pokemonCard);
      }
    });
  } catch (error) {
    console.error("Error loading Pokémon:", error);
  } finally {
    loadingSpinner.style.display = "none"; // Ocultar el spinner
  }
};

async function getPokemon(id) {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const pokemon = await res.json();

    const speciesUrl = pokemon.species.url; // URL de la especie del Pokémon
    const speciesResponse = await fetch(speciesUrl);
    const speciesData = await speciesResponse.json();

    const spanishFlavorText = speciesData.flavor_text_entries.find(
      (flavor) => flavor.language.name === "es"
    );

    return {
      pokemon,
      description: spanishFlavorText
        ? spanishFlavorText.flavor_text
        : "No hay descipción en Español para este Pokémon.",
    };
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    return null;
  }
}

function createPokemon(data) {
  const { pokemon, description } = data;
  const pokemonEl = document.createElement("div");
  pokemonEl.classList.add("pokemon");
  pokemon.types.forEach((type) => {
    pokemonEl.classList.add(type.type.name.toLowerCase());
  });

  const imageUrl = pokemon.sprites.front_default;
  const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const color = colors[pokemon.types[0].type.name.toLowerCase()];

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

  pokemonEl.onclick = () => mostrarDetallesPokemon(pokemon, description);

  return pokemonEl;
}

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

function cerrarModal() {
  const modal = document.getElementById("pokemon-modal");
  modal.style.display = "none";
}

function mostrarDetallesPokemon(pokemon, description) {
  const modal = document.getElementById("pokemon-modal");
  const modalContent = document.createElement("div");
  modalContent.classList.add("pokemon-detalles");

  const baseHeight = 150;
  const imageHeight =
    pokemon.height < 30 ? baseHeight : (pokemon.height / 20) * baseHeight;

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

  modal.innerHTML = "";
  modal.appendChild(modalContent);

  modal.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("pokemon-modal");
  const modalContent = document.getElementById("modalContent");

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  window.cerrarModal = function () {
    modal.style.display = "none";
  };

  const searchBar = document.getElementById("searchBar");
  searchBar.addEventListener("input", function () {
    searchPokemonByName(this.value.toLowerCase());
  });

  drawPokemon();
});

function searchPokemonByName(searchTerm) {
  const pokemons = document.querySelectorAll(".pokemon");
  pokemons.forEach((pokemon) => {
    const pokemonName = pokemon.querySelector(".name").innerText.toLowerCase();
    const matchesName = pokemonName.includes(searchTerm);
    pokemon.style.display = matchesName ? "block" : "none";
  });
}

document.getElementById("typeSelect").addEventListener("change", function () {
  filterPokemonByType(this.value);
});

function filterPokemonByType(selectedType) {
  const pokemons = document.querySelectorAll(".pokemon");
  console.log(`Filtrando por tipo: ${selectedType}`);

  pokemons.forEach((pokemon) => {
    const matchesType =
      selectedType === "all" || pokemon.classList.contains(selectedType);
    pokemon.style.display = matchesType ? "block" : "none";
  });
}
