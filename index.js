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
