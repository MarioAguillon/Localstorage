document.addEventListener('DOMContentLoaded', () => {
    // ====================================
    // 1. OBTENCIÓN DE REFERENCIAS AL DOM
    // ====================================
    const form = document.getElementById('userForm');
    const dataDisplay = document.getElementById('dataDisplay'); 

    // Referencias a los inputs del formulario
    const inputs = {
        nombre: document.getElementById('nombre'),
        email: document.getElementById('email'),
        edad: document.getElementById('edad')
    };

    // Referencias a los mensajes de error
    const errors = {
        nombre: document.getElementById('errorNombre'),
        email: document.getElementById('errorEmail'),
        edad: document.getElementById('errorEdad')
    };

    // Referencias a los botones
    const btnGuardar = document.getElementById('guardarBtn');
    const btnVerOcultar = document.getElementById('verDatosBtn');
    const btnLimpiarForm = document.getElementById('limpiarFormBtn');
    const btnBorrarDatos = document.getElementById('borrarDatosBtn');

    // ====================================
    // 2. FUNCIONES DE UTILIDAD Y CORE
    // ====================================

    /**
     * Muestra u oculta el mensaje de error y aplica estilos al input.
     * @param {HTMLElement} inputElement - El input a afectar.
     * @param {HTMLElement} errorElement - El elemento donde se muestra el mensaje.
     * @param {boolean} isVisible - Si el error debe ser visible.
     * @param {string} message - El mensaje de error a mostrar.
     */
    function toggleError(inputElement, errorElement, isVisible, message = '') {
        if (isVisible) {
            inputElement.classList.add('input-error');
            errorElement.textContent = message; // Asigna el mensaje de error
            errorElement.style.display = 'block';
        } else {
            inputElement.classList.remove('input-error');
            errorElement.textContent = ''; // Limpia el mensaje
            errorElement.style.display = 'none';
        }
    }

    /**
     * Valida un campo individualmente y muestra/oculta su error.
     * @param {string} campo - El nombre del campo ('nombre', 'email', 'edad').
     * @returns {boolean} - True si el campo es válido, False si no lo es.
     */
    function validarCampo(campo) {
        let isValid = true;
        const inputElement = inputs[campo];
        const errorElement = errors[campo];
        const value = inputElement.value.trim();

        // Limpiar error anterior antes de validar
        toggleError(inputElement, errorElement, false);

        switch (campo) {
            case 'nombre':
                if (value === '') {
                    toggleError(inputElement, errorElement, true, 'Debes ingresar tu nombre.');
                    isValid = false;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value === '') {
                    toggleError(inputElement, errorElement, true, 'El email debe ser Válido.');
                    isValid = false;
                } else if (!emailRegex.test(value)) {
                    toggleError(inputElement, errorElement, true, 'El formato del email no es válido.');
                    isValid = false;
                }
                break;
            case 'edad':
                const edadValue = parseInt(value);
                // Permite cadena vacía para que el formulario completo no lo marque como error si está vacío.
                if (value === '') {
                    toggleError(inputElement, errorElement, true, 'Debes ingresar tu edad.');
                    isValid = false;
                } else if (isNaN(edadValue) || edadValue < 1 || !Number.isInteger(edadValue)) {
                    toggleError(inputElement, errorElement, true, 'La edad debe ser un número entero positivo (mínimo 1).');
                    isValid = false;
                }
                break;
        }

        return isValid;
    }

    /**
     * Función principal de Validación del formulario al hacer Submit.
     * Valida todos los campos y muestra los errores individuales.
     * @returns {boolean} - True si todo el formulario es válido.
     */
    function validarFormulario() {
        let isValid = true;
        let allInputsEmpty = true;
        
        // 1. Validar cada campo individualmente y actualizar el estado general
        // Esta es la parte crucial que hace aparecer los mensajes de error
        Object.keys(inputs).forEach(key => {
            // Llama a la validación individual, que muestra el error si lo hay
            if (!validarCampo(key)) { 
                isValid = false; 
            }
            // Chequeo de contenido para la alerta de formulario vacío
            if (inputs[key].value.trim() !== '') {
                allInputsEmpty = false;
            }
        });

        // 2. Alerta de formulario completamente vacío
        if (allInputsEmpty && !isValid) {
             alert('❌ No puedes guardar. El formulario está completamente vacío. Por favor, ingresa tus datos.');
             return false;
        }

        return isValid;
    }

    // Lógica para limpiar el formulario
    const limpiarFormulario = (mostrarAlerta = true) => {
        let debeLimpiar = false;
        
        // Revisamos si hay contenido o errores visibles
        if (mostrarAlerta) {
            const camposVacios = Object.values(inputs).every(input => input.value.trim() === '');
            const erroresOcultos = Object.values(errors).every(error => error.style.display === 'none' || error.textContent === '');
            
            debeLimpiar = !(camposVacios && erroresOcultos);
    
            if (!debeLimpiar) {
                alert('❕ No hay nada para limpiar.');
                return;
            }
        } else {
            debeLimpiar = true; // Si se llama al guardar, siempre limpiamos (silenciosamente)
        }

        // 2. Proceder a la limpieza
        form.reset();
        Object.keys(inputs).forEach(key => {
            toggleError(inputs[key], errors[key], false); // Limpia los estilos de error
        });
        
        // 3. Mostrar alerta solo si se solicitó
        if (mostrarAlerta && debeLimpiar) {
            alert('🧹 Formulario limpiado correctamente.');
        }
    };

    // Lógica para borrar un usuario específico
    const borrarUsuarioIndividual = (index) => {
        const dataString = localStorage.getItem('usuarios');
        if (!dataString) return;

        let listaUsuarios = JSON.parse(dataString);
        
        if (index >= 0 && index < listaUsuarios.length) {
            const nombreUsuario = listaUsuarios[index].nombre;
            listaUsuarios.splice(index, 1);
            localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
            
            alert(`🗑 Usuario ${nombreUsuario} borrado correctamente. La lista ha sido reordenada.`);
            
            // Re-renderizar la lista
            setTimeout(toggleMostrarDatos, 10); 
        }
    };

    // Función principal para mostrar/ocultar datos (toggle)
    const toggleMostrarDatos = () => {
        // Bloque de OCULTAR
        if (dataDisplay.style.display === 'block') {
            dataDisplay.style.display = 'none';
            btnVerOcultar.textContent = 'Ver Datos';
            return;
        }

        // Bloque de MOSTRAR
        const dataString = localStorage.getItem('usuarios'); 
        dataDisplay.innerHTML = ''; 

        if (dataString) {
            const listaUsuarios = JSON.parse(dataString);

            if (listaUsuarios.length > 0) {
                let htmlResultado = '<h3>Usuarios Guardados:</h3>';
                
                listaUsuarios.forEach((usuario, index) => {
                    const numeroUsuario = index + 1;
                    
                    htmlResultado += `
                        <div class="usuario">
                            <p><strong>Usuario #${numeroUsuario}</strong></p>
                            <p><strong>Nombre:</strong> <span>${usuario.nombre}</span></p>
                            <p><strong>Email:</strong> <span>${usuario.email}</span></p>
                            <p><strong>Edad:</strong> <span>${usuario.edad}</span></p>
                            <button class="btn-borrar-individual" data-index="${index}">Borrar Usuario</button>
                        </div>
                        <hr>
                    `;
                });
                
                dataDisplay.innerHTML = htmlResultado;
                dataDisplay.style.display = 'block'; 
                btnVerOcultar.textContent = 'Ocultar Datos';
                
                // Asignar eventos a los nuevos botones de borrado individual
                document.querySelectorAll('.btn-borrar-individual').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const indexToDelete = parseInt(e.target.dataset.index);
                        borrarUsuarioIndividual(indexToDelete);
                    });
                });
                
            } else {
                dataDisplay.style.display = 'none'; 
                btnVerOcultar.textContent = 'Ver Datos';
                alert('La lista de usuarios está vacía.');
            }
        } else {
            dataDisplay.style.display = 'none'; 
            btnVerOcultar.textContent = 'Ver Datos';
            alert('No se encontró la lista de usuarios en LocalStorage.');
        }
    };


    // ====================================
    // 3. ASIGNACIÓN DE EVENTOS
    // ====================================

    // EVENTOS PARA VALIDACIÓN INDIVIDUAL (al salir del campo - on blur)
    Object.keys(inputs).forEach(key => {
        inputs[key].addEventListener('blur', () => validarCampo(key)); 
    });
    
    // EVENTO 1: Guardar datos (Submit del Formulario)
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Al llamar a validarFormulario(), se validan y se muestran los errores
        if (validarFormulario()) {
            // Solo si es válido, se procede a guardar
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

            const nuevoUsuario = {
                nombre: inputs.nombre.value.trim(),
                email: inputs.email.value.trim(),
                edad: parseInt(inputs.edad.value.trim())
            };

            usuarios.push(nuevoUsuario);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            // Alerta y limpieza
            alert('✅ Usuario guardado correctamente.');
            limpiarFormulario(false);
            
            // Refrescar la lista si está visible
            if (dataDisplay.style.display === 'block') {
                dataDisplay.style.display = 'none'; 
                btnVerOcultar.textContent = 'Ver Datos';
                setTimeout(toggleMostrarDatos, 50); 
            } else {
                dataDisplay.style.display = 'none';
                btnVerOcultar.textContent = 'Ver Datos'; 
            }
        }
    });

    // EVENTO 2: VER/OCULTAR DATOS GUARDADOS
    btnVerOcultar.addEventListener("click", toggleMostrarDatos);

    // EVENTO 3: Limpiar el formulario
    btnLimpiarForm.addEventListener('click', () => limpiarFormulario(true));

    // EVENTO 4: Borrar todos los datos de Local Storage
    btnBorrarDatos.addEventListener("click", () => {
        const dataString = localStorage.getItem("usuarios");
        const usuarios = JSON.parse(dataString);

        if (!usuarios || usuarios.length === 0) {
            alert("❌ No hay datos de usuarios para borrar.");
            return;
        }

        if (confirm("⚠ ¿Estás seguro de que quieres borrar TODOS los usuarios del LocalStorage?")) {
            localStorage.removeItem("usuarios");

            // Ocultar la visualización y resetear el botón
            dataDisplay.style.display = 'none';
            btnVerOcultar.textContent = 'Ver Datos';

            alert("🗑 Todos los datos han sido borrados.");
        }
    });
});