document.addEventListener(
  "DOMContentLoaded", 
  e => { 
    var bouncer = new Bouncer('form', {
      disableSubmit: true,
      messageAfterField: true,
      customValidations: {
        contaseñasNoCoinciden: campo => {
          // Obtener el selector de un campo a comparar
          // Si no hay ninguno, devolver false (no hay error)
          var selector = campo.getAttribute('data-bouncer-match');
          if (!selector) return false;
          // Obtener el campo a comparar. 
          // Si no existe devolver false (no hay error)
          var otroCampo = campo.form.querySelector(selector);
          if (!otroCampo) return false;
          // Comparar el value de ambos campos
          // Usamos comparacion negativa porque los campos se validan cuando coinciden.
          // Devolvemos true solo para las fallas lo que puede ser confuso
          return otroCampo.value !== campo.value;
        }
      },
      messages: {
        contaseñasNoCoinciden: campo => {
          var customMessage = campo.getAttribute('data-bouncer-mismatch-message');
          return customMessage ? customMessage : 'Las contraseñas deben coincidir'
        },
        missingValue: {default: 'Por favor ingresa este dato.'},
        patternMismatch: {email: 'Por favor ingresa un email válido.'},
        wrongLength: {under: 'Por favor ingresa {minLength} dígitos o más. Hasta ahora ingresaste solo {length}.'}
      }
    });

    document.addEventListener(
      'bouncerFormInvalid', 
      event => {
        window.scrollTo(0, event.detail.errors[0].offsetTop);
      }, 
      false
    );

    document.addEventListener(
      'bouncerFormValid', 
      () => {
        var url = ''

        fetch('registro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            Telefono: document.getElementById('telefono').value,
            email: document.getElementById('email').value,
            
          })
        })
      }, 
      false
    );
  }
)

//aqui inicia la logica de los select


const estadoSelect = document.getElementById('estado');

const municipioSelect = document.getElementById('municipio');

const parroquiaSelect = document.getElementById('parroquia');


//my snippet

function populateSelect(selectElement, options, textKey, valueKey) {

    selectElement.innerHTML = '<option value="">Seleccione una opción</option>'; // Limpiamos el select y agregamos la opción predeterminada

    options.forEach(option => {

        const opt = document.createElement('option');

        opt.value = option[valueKey];

        opt.textContent = option[textKey];

        selectElement.appendChild(opt);

    });

}


// Obtener estados

async function fetchEstados() {

    try {

        const response = await fetch("https://unem.edu.ve/unem/index.php?method=GET&action=obtener_estados");

        const estados = await response.json();

        populateSelect(estadoSelect, estados, 'nombre', 'id'); // Usamos 'nombre' como texto y 'id' como valor

    } catch (error) {

        // console.error("Error al obtener estados:", error);

    }

}


// Obtener municipios

async function fetchMunicipios(estadoId) {

    try {

        const response = await fetch(`https://unem.edu.ve/unem/index.php?method=GET&action=obtener_municipios&estado_me_id=${estadoId}`);

        const municipios = await response.json();

        populateSelect(municipioSelect, municipios, 'nombre', 'id'); // Usamos 'nombre' como texto y 'id' como valor

    } catch (error) {

        // console.error("Error al obtener municipios:", error);

    }

}


// Obtener parroquias

async function fetchParroquias(municipioId) {

    try {

        const response = await fetch(`https://unem.edu.ve/unem/index.php?method=GET&action=obtener_parroquias&municipio_me_id=${municipioId}`);

        const parroquias = await response.json();

        populateSelect(parroquiaSelect, parroquias, 'nombre', 'parroquia_me_id'); // Usamos 'nombre' como texto y 'id' como valor

    } catch (error) {

        // console.error("Error al obtener parroquias:", error);

    }

}


// Eventos para los cambios en los selectores

estadoSelect.addEventListener('change', async () => {

    const estadoId = estadoSelect.value;

    municipioSelect.innerHTML = ''; // Limpiamos municipios y parroquias

    parroquiaSelect.innerHTML = '';

    if (estadoId) {

        await fetchMunicipios(estadoId); // Cargamos municipios correspondientes

    }

});


municipioSelect.addEventListener('change', async () => {

    const municipioId = municipioSelect.value;

    parroquiaSelect.innerHTML = ''; // Limpiamos parroquias

    if (municipioId) {

        await fetchParroquias(municipioId); // Cargamos parroquias correspondientes

    }

});


// Cargamos los estados al iniciar

fetchEstados();

