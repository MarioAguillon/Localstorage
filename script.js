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
    const btnGuardar = document.getElementById('guardarBtn'); // Guardar
    const btnVerOcultar = document.getElementById('verDatosBtn'); // Ver/Ocultar
    const btnLimpiarForm = document.getElementById('limpiarFormBtn'); // Limpiar Form
    const btnBorrarDatos = document.getElementById('borrarDatosBtn'); // Borrar Todos

    // ====================================
    // 2. FUNCIONES DE UTILIDAD Y CORE
    // ====================================

    // Función para mostrar/ocultar errores en los campos
    function toggleError(inputElement, errorElement, isVisible) {
        if (isVisible) {
            inputElement.classList.add('input-error');
            errorElement.style.display = 'block';
        } else {
            inputElement.classList.remove('input-error');
            errorElement.style.display = 'none';
        }
    }

    // Función de Validación del formulario (Incluye validación para formulario completamente vacío)
    function validarFormulario() {
        let isValid = true;
        let allInputsEmpty = true; 

        // 1. Limpiar todos los errores y verificar si hay contenido
        Object.keys(inputs).forEach(key => {
            toggleError(inputs[key], errors[key], false);
            // Si algún campo tiene contenido, el formulario no está vacío
            if (inputs[key].value.trim() !== '') {
                allInputsEmpty = false;
            }
        });

        // 1.1. VALIDACIÓN: Si todos los campos están vacíos
        if (allInputsEmpty) {
            alert('❌ No puedes guardar. El formulario está completamente vacío. Por favor, ingresa tus datos.');
            return false;
        }

        // 2. Validar Nombre
        if (inputs.nombre.value.trim() === '') {
            toggleError(inputs.nombre, errors.nombre, true);
            errors.nombre.textContent = 'El nombre es obligatorio.';
            isValid = false;
        }

        // 3. Validar Email
        const emailValue = inputs.email.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailValue === '') {
            toggleError(inputs.email, errors.email, true);
            errors.email.textContent = 'El email es obligatorio.';
            isValid = false;
        } else if (!emailRegex.test(emailValue)) {
            toggleError(inputs.email, errors.email, true);
            errors.email.textContent = 'El formato del email no es válido.';
            isValid = false;
        }

        // 4. Validar Edad
        const edadValue = parseInt(inputs.edad.value.trim());
        if (inputs.edad.value.trim() === '' || isNaN(edadValue) || edadValue < 1) {
            toggleError(inputs.edad, errors.edad, true);
            errors.edad.textContent = 'La edad debe ser un número positivo (mínimo 1).';
            isValid = false;
        }

        return isValid;
    }

    // Lógica para limpiar el formulario (con alerta condicional)
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
            debeLimpiar = true; // Si se llama al guardar, siempre limpiamos
        }

        // 2. Proceder a la limpieza
        form.reset();
        Object.keys(inputs).forEach(key => {
            toggleError(inputs[key], errors[key], false);
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
            
            // Eliminar el usuario en la posición 'index'
            listaUsuarios.splice(index, 1);
            
            // Guardar la nueva lista en LocalStorage
            localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
            
            alert(`🗑 Usuario ${nombreUsuario} borrado correctamente. La lista ha sido reordenada.`);
            
            // Re-renderizar la lista (forzando el toggle)
            setTimeout(() => {
                // Simula un clic para que la función toggle decida si mostrar o no
                btnVerOcultar.click(); 
            }, 10); 
        }
    };


    // Función principal para mostrar/ocultar datos (toggle)
    const toggleMostrarDatos = () => {
        // >>>>> BLOQUE DE OCULTAR (Si ya está visible) <<<<<
        if (dataDisplay.style.display === 'block' && dataDisplay.innerHTML.trim() !== '') {
            dataDisplay.style.display = 'none';
            btnVerOcultar.textContent = 'Ver Datos'; // Cambiar a 'Ver Datos'
            return;
        }

        // >>>>> BLOQUE DE MOSTRAR (Si está oculto) <<<<<
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
                btnVerOcultar.textContent = 'Ocultar Datos'; // Cambiar a 'Ocultar Datos'
                
                // Asignar eventos a los nuevos botones de borrado individual
                document.querySelectorAll('.btn-borrar-individual').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const indexToDelete = parseInt(e.target.dataset.index);
                        borrarUsuarioIndividual(indexToDelete);
                    });
                });
                
            } else {
                // Lista existe pero está vacía
                dataDisplay.style.display = 'none'; 
                btnVerOcultar.textContent = 'Ver Datos';
                alert('La lista de usuarios está vacía.');
            }
        } else {
            // Lista no existe en LocalStorage
            dataDisplay.style.display = 'none'; 
            btnVerOcultar.textContent = 'Ver Datos';
            alert('No se encontró la lista de usuarios en LocalStorage.');
        }
    };


    // ====================================
    // 3. ASIGNACIÓN DE EVENTOS
    // ====================================

    // EVENTO 1: Guardar datos (Submit del Formulario) - MODIFICADO para auto-refresco
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validarFormulario()) {
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

            const nuevoUsuario = {
                nombre: inputs.nombre.value.trim(),
                email: inputs.email.value.trim(),
                edad: parseInt(inputs.edad.value.trim())
            };

            usuarios.push(nuevoUsuario);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            // 1. Alerta de guardado
            alert('✅ Usuario guardado correctamente.');

            // 2. Limpieza silenciosa
            limpiarFormulario(false);
            
            // 3. Lógica para refrescar/actualizar la lista de datos si está visible (CAMBIO APLICADO)
            if (dataDisplay.style.display === 'block') {
                // Paso A: Ocultamos el display, preparando el escenario para el toggle (refresco)
                dataDisplay.style.display = 'none'; 
                btnVerOcultar.textContent = 'Ver Datos';
                
                // Paso B: Llamamos a la función para que recargue y muestre con los nuevos datos.
                // Usamos setTimeout para asegurar que el DOM se actualice antes de re-renderizar.
                setTimeout(toggleMostrarDatos, 50); 
                
            } else {
                // Si estaba oculta, solo nos aseguramos de que el botón diga 'Ver Datos'
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