const pokeContent = document.getElementById("pokemonContent");
let pokeForm = document.getElementById("searchPokemon");
let generationshow = 1;
const modalSearch = document.getElementById("pokemonContent");
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

let pokemonGeneration = showPokemonGen(generationshow);

/*cambiar de generacion*/

let arrowRight = document
  .getElementById("arrow-right")
  .addEventListener("click", (e) => {
    if (generationshow < 4) {
      modalSearch.innerHTML = "";
      generationshow += 1;
      pokemonGeneration = showPokemonGen(generationshow);
      divGeneration.innerHTML = "Gen " + generationshow;
      drawPokemon();
    }
  });

let arrowleft = document
  .getElementById("arrow-left")
  .addEventListener("click", (e) => {
    if (generationshow > 0) {
      modalSearch.innerHTML = "";
      generationshow -= 1;
      pokemonGeneration = showPokemonGen(generationshow);
      divGeneration.innerHTML = "Gen " + generationshow;
      drawPokemon();
      console.log(generationshow);
    }
  });

const drawPokemon = async () => {
  for (let i = pokemonGeneration[0]; i <= pokemonGeneration[1]; i++) {
    await getPokemon(i);
  }
};

const getPokemon = async (id, modal) => {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const pokemon = await res.json();
    createPokemon(pokemon, modal);
  } catch (error) {
    console.error(error);
    // Maneja el error, por ejemplo, mostrando un mensaje al usuario
  }
};

function createPokemon(pokemon, modal) {
  const pokemonEl = document.createElement("div");
  pokemonEl.classList.add("pokemon");

  const poke_types = pokemon.types.map((type) => type.type.name);
  const type = main_types.find((type) => poke_types.indexOf(type) > -1);
  const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  const color = colors[type];

  pokemonEl.style.backgroundColor = color;

  // Utilizar la imagen oficial proporcionada por PokeAPI
  const imageUrl = pokemon.sprites.other["showdown"].front_default;

  const pokeInnerHTML = `
        <div class="img-container">
            <img src="${imageUrl}" alt="${name}" />
        </div>
        <div class="info">
            <span class="number">#${pokemon.id
              .toString()
              .padStart(3, "0")}</span>
            <h3 class="name">${name}</h3>
            <small class="type">Tipo: <span>${type}</span></small>
        </div>
    `;

  pokemonEl.innerHTML = pokeInnerHTML;

  if (!modal) {
    pokeContent.appendChild(pokemonEl);
  } else {
    modalSearch.innerHTML = pokeInnerHTML;
  }
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

drawPokemon();

/*Buscar pokemon*/

pokeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let searchPokemon = document.getElementById("pokemon").value;
  getPokemon(searchPokemon, true);
});

function exitModal() {
  const modalPokemon = document.getElementById("modalPokemon");
  modalPokemon.style.display = "none";
  drawPokemon();
}
