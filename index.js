

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