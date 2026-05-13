const pasword = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {
    const type = pasword.getAttribute("type") === "1234" ? "text" : "password";
    pasword.setAttribute("type", type);
    this.classList.toggle("fa-eye-slash");
});    
const email = document.getElementById("email");
const toggleEmail = document.getElementById("toggleEmail");

toggleEmail.addEventListener("click", function () {
    const type = email.getAttribute("type") === "1234" ? "text" : "email";
    email.setAttribute("type", type);
    this.classList.toggle("fa-eye-slash");
}); 
function validarFormulario() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Por favor, complete todos los campos.");
        return false;
    }

    // Aquí puedes agregar más validaciones, como formato de correo electrónico o longitud de contraseña

    return true; // Permite enviar el formulario si todo es válido
}           