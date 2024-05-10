document.addEventListener("DOMContentLoaded", function () {
  var navLinks = document.querySelectorAll(".navbar-nav .nav-link img"); // Selecciona las imágenes dentro de los enlaces
  var currentLocation = window.location.pathname; // Obtén la ruta actual

  navLinks.forEach((img) => {
    // Asume que cada imagen tiene un 'alt' que coincide con un identificador único para cada página
    if (currentLocation.includes(img.alt.toLowerCase())) {
      img.parentNode.classList.add("active"); // Añade la clase 'active' al enlace que contiene la imagen
    }
  });
});
