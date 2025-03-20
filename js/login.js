const usuarioRegistrados = JSON.parse(localStorage.getItem("usuarios")) || [];

const loginForm = document.getElementById("loginForm");
const invitadosBtn = document.getElementById("invitados");
const mensajeDiv = document.getElementById("mensaje");

function mostrarMensaje(texto, tipo = "info") {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = "mensaje";
    mensajeDiv.classList.add(tipo);

    setTimeout(() => {
        mensajeDiv.textContent = "";
        mensajeDiv.className = "mensaje"; 
    }, 3000);
}

loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const usuario = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    console.log("Usuario ingresado:", usuario);
    console.log("Contraseña ingresada:", password);
    console.log("Usuarios registrados en localStorage:", usuarioRegistrados);
    
    const usuarioEncontrado = usuarioRegistrados.find((user) => user.usuario === usuario && user.password === password);

    if (usuarioEncontrado) {
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));
        mostrarMensaje(`Bienvenido, ${usuarioEncontrado.nombre}!`, "exito");

        setTimeout(() => {
            window.location.href = "./page/mesa.html";
        }, 1000);
    } else {
        mostrarMensaje("Usuario o contraseña incorrectos.", "error");
    }
});

invitadosBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const invitado = {
        username: "Invitado",
        tipo: "guest"
    };

    localStorage.setItem("usuarioActivo", JSON.stringify(invitado));
    mostrarMensaje("Ingresaste como invitado", "exito");

    setTimeout(() => {
        window.location.href = "./page/mesa.html";
    }, 1000);
});
