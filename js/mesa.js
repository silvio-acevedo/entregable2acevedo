document.addEventListener("DOMContentLoaded", () => {
    const saludo = document.getElementById("saludo");
    const selectMesa = document.getElementById("mesa");
    const btnContinuar = document.getElementById("btnContinuar");
    const mensajeError = document.getElementById("mensajeError");

    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (usuarioActivo) {
        const nombre = usuarioActivo.nombre || usuarioActivo.username ||"Invitado";
        saludo.textContent = `Bienvenido, ${nombre}`
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

        const datosSesion = {
            ...usuarioActivo, 
            mesa: mesaSeleccionada
        };

        localStorage.setItem("usuarioActivo", JSON.stringify(datosSesion));

        window.location.href = "./menu.html";
    });
});
