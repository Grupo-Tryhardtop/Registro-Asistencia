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
        var url = 'https://codepen.io/lucasn1974/pen/yQrZma'

        fetch('registro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            contraseña: sha3_512(sha3_512(document.getElementById('contraseña').value) + url)
          })
        })
      }, 
      false
    );
  }
)