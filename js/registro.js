document.addEventListener("DOMContentLoaded", () => {
    const resgistroForm = document.getElementById("registroForm");

    resgistroForm.addEventListener("submit", function (e){
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const usuario = document.getElementById("usuario").value.trim();
        const email = document.getElementById("email").value.trim();
        const password= document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        const mensajeError = document.getElementById("mensajeError");
        const mensajeExito = document.getElementById("mensajeExito");

        mensajeError.textContent = "";
        mensajeExito.textContent = "";

        if (!nombre || !usuario || !email || !password || !confirmPassword){
            mensajeError.textContent = "Por favor, completá todos los campos.";
            return;
        }

        if (password.length < 6) {
            mensajeError.textContent = "La contraseña debe tener al menos 6 caracteres.";
            return;
        }

        if (password !== confirmPassword) {
            mensajeError.textContent = "Las contraseñas no coinciden.";
            return
        }

        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const usuarioExistente = usuarios.some(u => u.usuario === usuario);
        const emailExistente = usuarios.some(u => u.email === email);

        if (usuarioExistente) {
            mensajeError.textContent = "Ese nombre de usuario ya está en uso.";
            return;
        }

        if (emailExistente) {
            mensajeError.textContent = "Ese correo electrónico ya está registrado.";
            return;
        }

        const nuevoUsuario = {
            nombre, 
            usuario,
            email, 
            password
        };

        usuarios.push (nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        mensajeExito.textContent = "¡Registro exitoso! Redirigiendo...";

        setTimeout(() => {
            window.location.href = "../index.html"
        }, 2000);
    })
})