document.addEventListener('DOMContentLoaded', () => {
    const infoContainer = document.getElementById('info-card');

    fetch('map_locations.json')
        .then(response => response.json())
        .then(data => {
            document.querySelectorAll('area').forEach(area => {
                area.addEventListener('click', (event) => {
                    event.preventDefault();
                    const cityName = event.target.alt;
                    const cityInfo = data[cityName];
                    if (cityInfo) {
                        updateInfoContainer(cityInfo);
                    }
                });
            });
        })
        .catch(error => console.error('Error al cargar los datos:', error));

    function updateInfoContainer(cityInfo) {
        infoContainer.innerHTML = `<h2>${cityInfo.nombre}</h2><p>${cityInfo.descripción}</p>`;
        infoContainer.style.display = 'block'; // Cambio clave para asegurar que se muestra
        setTimeout(() => {
            infoContainer.classList.add('show');
        }, 10); // Pequeño delay antes de agregar la clase 'show'
    }

    document.addEventListener('click', (event) => {
        if (!infoContainer.contains(event.target) && !event.target.closest('map')) {
            infoContainer.classList.remove('show');
            setTimeout(() => {
                infoContainer.style.display = 'none';
            }, 500); // Delay para esperar que termine la transición de desaparición
        }
    });
});
