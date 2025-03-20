document.addEventListener("DOMContentLoaded", () => {
    const saludo = document.getElementById("saludo");
    const selectMesa = document.getElementById("mesa");
    const btnContinuar = document.getElementById("btnContinuar");
    const mensajeError = document.getElementById("mensajeError");

    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (usuarioActivo && usuarioActivo.nombre) {
        saludo.textContent = `Hola, ${usuarioActivo.nombre}`;
    } else {
        saludo.textContent = "Hola, Invitado";
    }

    selectMesa.addEventListener("change", () => {
        const mesaSeleccionada = selectMesa.value;

        if (mesaSeleccionada) {
            btnContinuar.disabled = false;
            mensajeError.textContent = "";
        } else {
            btnContinuar.disabled = true;
        }
    });

    btnContinuar.addEventListener("click", () => {
        const mesaSeleccionada = selectMesa.value;

        if (!mesaSeleccionada) {
            mensajeError.textContent = "Por favor, selecciona una mesa antes de continuar.";
            return;
        }

        localStorage.setItem("mesaSeleccionada", mesaSeleccionada);

        window.location.href = "./menu.html";
    });
});
