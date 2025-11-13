document.addEventListener('DOMContentLoaded', () => {
    // ====================================
    // 1. OBTENCIÓN DE REFERENCIAS AL DOM
    // ====================================
    const form = document.getElementById('userForm');
    const display = document.getElementById('dataDisplay'); 
    
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
    const btnVer = document.getElementById('verDatosBtn');
    const btnLimpiarForm = document.getElementById('limpiarFormBtn');
    const btnBorrarDatos = document.getElementById('borrarDatosBtn');


    // ====================================
    // 2. FUNCIONES DE UTILIDAD Y CORE
    // ====================================

    // Muestra u oculta el mensaje de error y aplica la clase de estilo
    function toggleError(inputElement, errorElement, isVisible) {
        if (isVisible) {
            inputElement.classList.add('input-error');
            errorElement.style.display = 'block';
        } else {
            inputElement.classList.remove('input-error');
            errorElement.style.display = 'none';
        }
    }

    // Función: Validar Formulario
    function validarFormulario() {
        let isValid = true;
        Object.keys(inputs).forEach(key => {
            toggleError(inputs[key], errors[key], false);
        });

        if (inputs.nombre.value.trim() === '') {
            toggleError(inputs.nombre, errors.nombre, true);
            isValid = false;
        }

        if (inputs.email.value.trim() === '') {
            toggleError(inputs.email, errors.email, true);
            isValid = false;
        }

        const edadValue = parseInt(inputs.edad.value.trim());
        if (inputs.edad.value.trim() === '' || isNaN(edadValue) || edadValue < 1) {
            toggleError(inputs.edad, errors.edad, true);
            isValid = false;
        }

        return isValid;
    }

    // Función: Cargar y mostrar datos (Ahora maneja múltiples usuarios con ID)
    function mostrarDatosGuardados() {
        // Usamos la clave 'usuarios' para el array de registros
        const usuariosGuardadosJSON = localStorage.getItem('usuarios'); 
        let listaUsuarios = [];

        if (usuariosGuardadosJSON) {
            try {
                listaUsuarios = JSON.parse(usuariosGuardadosJSON);
            } catch (error) {
                console.error("Error al parsear JSON de Local Storage:", error);
                display.innerHTML = '<p class="error-message">Error: Los datos guardados no son válidos.</p>';
                return;
            }
        }
        
        display.innerHTML = ''; // Siempre limpiar antes de volver a dibujar

        if (listaUsuarios.length > 0) {
            let htmlContent = `<h3>📌 Total de Usuarios Guardados: ${listaUsuarios.length}</h3>`;
            
            // Iterar sobre el array para mostrar cada usuario con su índice (ID)
            listaUsuarios.forEach((usuario, index) => {
                htmlContent += `
                    <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
                        <h4>Índice: ${usuario.id}</h4> 
                        <p><strong>Nombre:</strong> ${usuario.nombre}</p>
                        <p><strong>Email:</strong> ${usuario.email}</p>
                        <p><strong>Edad:</strong> ${usuario.edad}</p>
                    </div>
                `;
            });
            display.innerHTML = htmlContent;
        } else {
            display.innerHTML = '<p>No hay datos de usuario guardados.</p>';
        }
    }


    // ====================================
    // 3. EVENTOS DE BOTONES (FUNCIONALIDAD)
    // ====================================

    // EVENTO 1: Guardar datos
    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        if (validarFormulario()) {
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            
            // Crea un ID único basado en el último ID o comienza en 1
            const newId = usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1;
            
            const nuevoUsuario = {
                id: newId, 
                nombre: inputs.nombre.value.trim(),
                email: inputs.email.value.trim(),
                edad: inputs.edad.value.trim()
            };

            usuarios.push(nuevoUsuario);

            try {
                localStorage.setItem('usuarios', JSON.stringify(usuarios)); 
                alert(`✅ Datos guardados correctamente en LocalStorage. (ID: ${newId})`);
                
                // Limpia el formulario
                form.reset(); 
                
                // Oculta los errores
                Object.keys(inputs).forEach(key => {
                    toggleError(inputs[key], errors[key], false);
                });
                
            } catch (error) {
                console.error("Error al guardar en Local Storage:", error);
                alert("❌ Error: No se pudo guardar la información.");
            }
        }
    });

    // EVENTO 2: Ver Datos Guardados
    btnVer.addEventListener('click', mostrarDatosGuardados);

    // ⭐ EVENTO 3: Limpiar el formulario (SOLO CAMPOS, NO DISPLAY) ⭐
    btnLimpiarForm.addEventListener('click', () => {
        form.reset(); // Limpia los campos
        
        // Ocultar mensajes de error
        Object.keys(inputs).forEach(key => {
            toggleError(inputs[key], errors[key], false);
        });
        // 🚨 SE ELIMINA: display.innerHTML = ''; 
        // El área de visualización de datos NO se borra.
    });

    // EVENTO 4: Borrar datos de Local Storage
    btnBorrarDatos.addEventListener('click', () => {
        const confirmClear = confirm('⚠️ ¿Estás seguro de que deseas borrar TODOS los datos de usuario de Local Storage?');
        if (confirmClear) {
            localStorage.removeItem('usuarios'); 
            
            alert('🗑️ Datos de Local Storage borrados.');
            mostrarDatosGuardados(); // Esto actualizará el display a "No hay datos..."
        }
    });
});