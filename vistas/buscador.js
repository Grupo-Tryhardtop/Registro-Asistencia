document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const tipoCedula = document.getElementById('tipoCedula').value;
    const numeroCedula = document.getElementById('numeroCedula').value;

    if (tipoCedula && numeroCedula) {
        alert(`Buscando cédula: ${tipoCedula}-${numeroCedula}`);
        // Aquí puedes agregar la lógica para realizar la búsqueda
    } else {
        alert('Por favor, complete todos los campos.');
    }
});



document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario

    const tipoCedula = document.getElementById('tipoCedula').value;
    const numeroCedula = document.getElementById('numeroCedula').value;

    if (tipoCedula && numeroCedula) {
        // Construir la URL de la API
        const apiUrl = `http://10.10.10.17:3000/BuscarPersona/${tipoCedula}/${numeroCedula}`;

        // Realizar la solicitud a la API
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la búsqueda de datos');
                }
                return response.json(); // Convertir la respuesta a JSON
            })
            .then(data => {
                // Suponiendo que la API devuelve un array de objetos
                const persona = data[0]; // Obtener el primer objeto del array

                // Almacenar los datos en sessionStorage
                sessionStorage.setItem('cedula', persona.cedula) ;
                sessionStorage.setItem('nacionalidad', persona.nacionalidad.trim());
                sessionStorage.setItem('primer_nombre', persona.primer_nombre);
                sessionStorage.setItem('segundo_nombre', persona.segundo_nombre);
                sessionStorage.setItem('primer_apellido', persona.primer_apellido);
                sessionStorage.setItem('segundo_apellido', persona.segundo_apellido);
              
                // Redirigir a la otra vista
                window.location.href = '/src/index.html'; // Cambia esto a la ruta de tu otra vista
            })
            .catch(error => {
                console.error('Error:', error);
                alert('No se pudo encontrar la persona. Verifica el número de cédula.');
            });
    } else {
        alert('Por favor, complete todos los campos.');
    }
});
