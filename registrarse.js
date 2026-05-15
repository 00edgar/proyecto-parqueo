document.getElementById('formRegistro').addEventListener('submit', function(e) {
    e.preventDefault(); // Evitamos que la página se recargue

    // Capturamos los datos
    const nombre = document.getElementById('regNombre').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;

    // 1. Obtener la lista de usuarios ya registrados (o crear una vacía si no hay)
    // Usamos JSON.parse para convertir el texto de localStorage en un Array de JS
    let usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];

    // 2. Verificar si el correo ya existe
    const existe = usuarios.find(u => u.email === email);
    if (existe) {
        alert("Este correo ya está registrado. Intenta con otro.");
        return;
    }

    // 3. Crear el nuevo objeto usuario
    const nuevoUsuario = {
        nombre: nombre,
        email: email,
        password: pass
    };

    // 4. Agregarlo a nuestra lista
    usuarios.push(nuevoUsuario);

    // 5. Guardar la lista actualizada en LocalStorage
    // Usamos JSON.stringify porque LocalStorage solo guarda TEXTO
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));

    alert("¡Usuario registrado con éxito!");
    
    // 6. Mandarlo al login para que entre
    window.location.href = "index.html";
});