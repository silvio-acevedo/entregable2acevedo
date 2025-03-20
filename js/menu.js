let cart = [];
let total = 0;

function addToCart(price, product) {
  cart.push({ product, price });
  total += price;
  updateCart();
  }

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const totalPrice = document.getElementById("total-price");

  if (cart.length > 0) {
    const itemsList = cart.map(item => `${item.product} - $${item.price.toFixed(2)}`).join('<br>');
    cartItems.innerHTML = itemsList;
    totalPrice.innerHTML = total.toFixed(2);
    } else {
        cartItems.innerHTML = "No hay productos en el carrito.";
        totalPrice.innerHTML = "0.00";
        }
  }