document.addEventListener("DOMContentLoaded", () => {
  let productos = [];
  let carritos = [];

  const btnOrdenar = document.getElementById("ordenarBtn");
  const btnEfectivo = document.getElementById("pagoEfectivo");
  const btnTarjeta = document.getElementById("pagoTarjeta");
  const btnQR = document.getElementById("pagoQR");
  const formTarjeta = document.getElementById("formTarjeta");
  const qrPago = document.getElementById("qrPago");
  const descuentoElem = document.getElementById("descuento");


  //--------------- JSON

  fetch('../data/productos.json')
    .then(res => res.json())
    .then(data => {
      productos = data;
      mostrarProductos("todos");
      activarBotonesCategorias(); 
    })
    .catch(error => console.error('Error al cargar los productos:', error));

  //--------------- SALUDO INICIAL

  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (usuarioActivo) {
    const saludo = document.getElementById("saludoMenu");
    const nombreParaMostrar = usuarioActivo.nombre || usuarioActivo.usuario || "Invitado";
    saludo.textContent = `${nombreParaMostrar}, ¿qué vas a comer hoy?`;
  }

    //--------------- MESA SELECCIONADA
  if (usuarioActivo && usuarioActivo.mesa) {
    const mesaElemento = document.getElementById("mesaSeleccionada");
    if (mesaElemento) {
      mesaElemento.textContent = `Mesa ${usuarioActivo.mesa}`;
    }
  }

  //--------------- CATEGORIAS Y CARDS

  function activarBotonesCategorias() {
    document.querySelectorAll(".categoria").forEach(boton => {
      boton.addEventListener("click", () => {
        const categoria = boton.getAttribute("data-categoria");
        document.querySelectorAll(".categoria").forEach(b => b.classList.remove("active"));
        boton.classList.add("active");
        mostrarProductos(categoria);
      });
    });
  }

  function mostrarProductos(categoria) {
    const lista = document.querySelector(".listaDeProductos");
    lista.innerHTML = "";

    const productosFiltrados = categoria === "todos"
      ? productos
      : productos.filter(p => p.categoria === categoria);

    productosFiltrados.forEach(producto => {
      const itemEnCarrito = carritos.find(p => p.id === producto.id);
      const cantidad = itemEnCarrito ? itemEnCarrito.cantidad : 0;

      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${producto.img}" alt="${producto.nombre}">
        <h2>${producto.nombre}</h2>
        <p>$${producto.precio}</p>
        <div class="controlesCantidad">
          ${cantidad === 0
            ? `<button class="agregar" data-id="${producto.id}">Agregar</button>`
            : `
              <button class="restar" data-id="${producto.id}">-</button>
              <span class="cantidad" id="cantidad-${producto.id}">${cantidad}</span>
              <button class="sumar" data-id="${producto.id}">+</button>
            `
          }
        </div>
      `;

      lista.appendChild(card);
    });

    activarBotonesCards();
  }

  function activarBotonesCards() {
    document.querySelectorAll(".agregar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        agregarAlCarrito(id);
        mostrarProductos(document.querySelector(".categoria.active").getAttribute("data-categoria"));
      });
    });

    document.querySelectorAll(".sumar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        const item = carritos.find(p => p.id === id);
        item.cantidad++;
        actualizarCarrito();
        mostrarProductos(document.querySelector(".categoria.active").getAttribute("data-categoria"));
      });
    });

    document.querySelectorAll(".restar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        const item = carritos.find(p => p.id === id);
        if (item.cantidad > 1) {
          item.cantidad--;
        } else {
          carritos = carritos.filter(p => p.id !== id);
        }
        actualizarCarrito();
        mostrarProductos(document.querySelector(".categoria.active").getAttribute("data-categoria"));
      });
    });
  }

  //--------------- CARRITO
  

  function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const existe = carritos.find(p => p.id === id);

    if (existe) {
      existe.cantidad++;
    } else {
      carritos.push({ ...producto, cantidad: 1 });
    }

    actualizarCarrito();
  }

  function actualizarCarrito() {
    const carritoItems = document.getElementById('carritoItems');
    carritoItems.innerHTML = '';

    let subtotal = 0;

    carritos.forEach(item => {
      subtotal += item.precio * item.cantidad;

      const div = document.createElement('div');
      div.classList.add('itemCarrito');
      div.innerHTML = `
        <img src="${item.img}" alt="${item.nombre}" class="miniatura">
        <div class="infoCarrito">
          <h4>${item.nombre}</h4>
          <p>$${item.precio} x ${item.cantidad}</p>
        </div>
      `;

      carritoItems.appendChild(div);
    });

    document.getElementById('subTotal').textContent = `Sub Total: $${subtotal}`;
    document.getElementById('totalFinal').textContent = `Total: $${subtotal}`;

    btnOrdenar.disabled = carritos.length === 0;

    descuentoElem.style.display = 'none';
    formTarjeta.style.display = 'none';
    qrPago.style.display = 'none';
  }

  //--------------- ORDENAR

  btnOrdenar.addEventListener("click", () => {
    Swal.fire({
      title: "¡Orden recibida!",
      text: "Elegí un método de pago para continuar.",
      icon: "success",
      confirmButtonText: "Aceptar"
    }).then(() => {
      btnEfectivo.disabled = false;
      btnTarjeta.disabled = false;
      btnQR.disabled = false;

      btnEfectivo.classList.remove("pago-disabled")
      btnTarjeta.classList.remove("pago-disabled")
      btnQR.classList.remove("pago-disabled")

      btnEfectivo.classList.remove("pago-enabled")
      btnTarjeta.classList.remove("pago-enabled")
      btnQR.classList.remove("pago-enabled")

      document.getElementById("mensajePedido").style.display = "block";
    });
  });

//--------------- EFECTIVO

btnEfectivo.addEventListener("click", () => {
  const nombreUsuario = localStorage.getItem("nombreUsuario") || "Invitado";

  const subtotal = carritos.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const descuento = subtotal * 0.1;
  const totalConDescuento = subtotal - descuento;

  document.getElementById("totalFinal").textContent = `Total: $${totalConDescuento.toFixed(2)}`;
  descuentoElem.style.display = 'block';
  descuentoElem.textContent = `Descuento 10%: $${descuento.toFixed(2)}`;

  Swal.fire({
    title: `Gracias por tu compra! 💵`,
    text: `Pagás en efectivo. Total con 10% de descuento: $${totalConDescuento.toFixed(2)}`,
    icon: "success",
    timer: 5000,
    showConfirmButton: false
  }).then(() => {
    window.location.href = "../index.html";
  });
});


  //--------------- TARJETAS

btnTarjeta.addEventListener("click", () => {
  Swal.fire({
    title: 'Ingresá los datos de tu tarjeta 💳',
    html: `
        <input type="text" id="nombreTitular" class="swal2-input" placeholder="Nombre del titular">
        <input type="text" id="numeroTarjeta" class="swal2-input" placeholder="Número de tarjeta (16 dígitos)">
        <input type="text" id="vencimiento" class="swal2-input" placeholder="Vencimiento (MM/AA)">
        <input type="text" id="cvv" class="swal2-input" placeholder="CVV (3 dígitos)">
    `,
    confirmButtonText: 'Pagar',
    showCancelButton: true,
    focusConfirm: false,
    preConfirm: () => {
      const nombre = document.getElementById('nombreTitular').value.trim();
      const numero = document.getElementById('numeroTarjeta').value.trim();
      const vencimiento = document.getElementById('vencimiento').value.trim();
      const cvv = document.getElementById('cvv').value.trim();

      if (!nombre || !numero || !vencimiento || !cvv) {
        Swal.showValidationMessage('Completá todos los campos');
        return false;
      }

      const numeroValido = /^[0-9]{16}$/.test(numero);
      const cvvValido = /^[0-9]{3}$/.test(cvv);
      const vencimientoValido = /^(0[1-9]|1[0-2])\/\d{2}$/.test(vencimiento);

      if (!numeroValido) {
        Swal.showValidationMessage('El número de tarjeta debe tener 16 dígitos');
        return false;
      }

      if (!vencimientoValido) {
        Swal.showValidationMessage('Formato de vencimiento inválido (MM/AA)');
        return false;
      }

      const [mesStr, anioStr] = vencimiento.split("/");
      const mes = parseInt(mesStr, 10);
      const anio = 2000 + parseInt(anioStr, 10); 

      const fechaActual = new Date();
      const mesActual = fechaActual.getMonth() + 1; 
      const anioActual = fechaActual.getFullYear();

      if (anio < anioActual || (anio === anioActual && mes < mesActual)) {
        Swal.showValidationMessage('La tarjeta ya está vencida');
        return false;
      }

      if (!cvvValido) {
        Swal.showValidationMessage('El CVV debe tener 3 dígitos');
        return false;
      }

      return { nombre, numero, vencimiento, cvv };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: 'success',
        title: 'Pago exitoso',
        text: `Gracias por tu compra!`,
        timer: 5000,
        showConfirmButton: false
      }).then(() => {
        window.location.href = "../index.html";
      });
    }
  });
});

//--------------- MERCADO PAGO

btnQR.addEventListener("click", () => {
  formTarjeta.style.display = "none";
  qrPago.style.display = "block";

  const pagoVentana = window.open("https://www.mercadopago.com.ar", "_blank");

  const chequeoIntervalo = setInterval(() => {
    if (pagoVentana.closed) {
      clearInterval(chequeoIntervalo);
      
      Swal.fire({
        icon: 'success',
        title: '¡Gracias por tu compra!',
        text: 'Te estamos redirigiendo al inicio...',
        timer: 5000,
        showConfirmButton: false
      }).then(() => {
        window.location.href = "../index.html";
      });
    }
  }, 1000); 
});
});
