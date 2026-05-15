document.querySelector('.login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('email').value;
    const passInput = document.getElementById('password').value;

    // POSICIONAMIENTO: Primero traemos los usuarios del LocalStorage
    const usuariosCargados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];

    // Buscamos si existe un usuario que coincida con ambos datos
    const usuarioValido = usuariosCargados.find(u => u.email === emailInput && u.password === passInput);

    if (usuarioValido) {
        alert("¡Bienvenido " + usuarioValido.nombre + "!");
        window.location.href = "parqueo.html";
    } else {
        alert("Correo o contraseña incorrectos. ¿Ya te registraste?");
    }
});



// Esperamos a que el DOM esté cargado para evitar errores
document.addEventListener('DOMContentLoaded', () => {
    
    // Seleccionamos el formulario usando su clase
    const loginForm = document.querySelector('.login-form');

    // Escuchamos el evento de envío (submit)
    loginForm.addEventListener('submit', (e) => {
        // 1. Prevenimos que el formulario recargue la página
        e.preventDefault();

        // 2. Capturamos los valores de los inputs por su ID
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // 3. Validación básica
        // Aquí puedes cambiar 'admin@correo.com' y '1234' por lo que desees
        if (email === "" || password === "") {
            alert("Por favor, completa todos los campos.");
            return;
        }
        
        // Simulación de validación de credenciales
        if (email === "usuario@ejemplo.com" && password === "123456") {
            
            alert("¡Bienvenido a Smart-Parking!");
            
            // 4. Redirección a la página de parqueo
            window.location.href = "parqueo.html";

        } else {
            // Si los datos son incorrectos
            alert("Correo o contraseña incorrectos. Intenta de nuevo.");
        }
    });
});
