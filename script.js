const cartCountElement = document.querySelector('.bask-cnt');
let cart = {};

const cartModal = document.getElementById('cartModal');
const cartItemsCont = document.querySelector('.cart-items');
const cartTotalElement = document.getElementById('cartTotal');
const closeBtn = document.querySelector('.close');
const baskIcon = document.querySelector('.bask img');

const orderForm = document.getElementById('orderForm');
const orderModal = document.getElementById('orderModal');
const checkoutBtn = document.getElementById('checkoutBtn');
const closeOrderBtn = document.querySelector('.close-order');
const msg = document.getElementById('order-message');
const emptyMsg = document.getElementById('cart-empty-message');

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
  const data = localStorage.getItem('cart');
  if (data) {
    cart = JSON.parse(data);
    updateCartCount();
  }
}

document.querySelectorAll('.prod-add').forEach(button => {
  button.addEventListener('click', () => {
    const product = button.closest('.product');
    const id = product.dataset.id;

    if (!cart[id]) {
      cart[id] = 1;
    } else {
      cart[id]++;
    }

    updateCartCount();
    saveCart();
    renderCart();
  });
});

function updateCartCount() {
  let total = 0;
  for (let id in cart) {
    total += cart[id];
  }
  cartCountElement.textContent = total;
}

baskIcon.addEventListener('click', () => {
  renderCart();
  cartModal.classList.add('open');
});

closeBtn.addEventListener('click', () => {
  cartModal.classList.remove('open');
});

function renderCart() {
  cartItemsCont.innerHTML = '';
  let total = 0;

  for (let id in cart) {
    const productElem = document.querySelector(`.product[data-id="${id}"]`);
    const title = productElem.querySelector('.prod-title').textContent;
    const priceText = productElem.querySelector('.prod-price').textContent;
    const price = parseInt(priceText);

    total += cart[id] * price;

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cart-item');

    itemDiv.innerHTML = `
      <span>${title} — ${price} ₽</span>
      <div class="cart-controls">
        <button class="decrease">-</button>
        <span>${cart[id]}</span>
        <button class="increase">+</button>
        <button class="remove">x</button>
      </div>
    `;

    itemDiv.querySelector('.increase').addEventListener('click', () => {
      cart[id]++;
      updateCartCount();
      saveCart();
      renderCart();
    });

    itemDiv.querySelector('.decrease').addEventListener('click', () => {
      cart[id]--;
      if (cart[id] <= 0) {
        delete cart[id];
      }
      updateCartCount();
      saveCart();
      renderCart();
    });

    itemDiv.querySelector('.remove').addEventListener('click', () => {
      delete cart[id];
      updateCartCount();
      saveCart();
      renderCart();
    });

    cartItemsCont.appendChild(itemDiv);
  }

  cartTotalElement.textContent = total + ' ₽';

  if (Object.keys(cart).length === 0) {
    cartItemsCont.innerHTML = '<p>Корзина пуста</p>';
  }
}

checkoutBtn.addEventListener('click', () => {
  cartModal.classList.remove('open');
  orderModal.classList.add('open');
});

closeOrderBtn.addEventListener('click', () => {
  orderModal.classList.remove('open');
});

orderForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (Object.keys(cart).length === 0) {
    emptyMsg.style.display = 'block';
    setTimeout(() => {
      emptyMsg.style.display = 'none';
    }, 2000);
    return;
  }

  cart = {};
  updateCartCount();
  saveCart();
  renderCart();

  orderModal.classList.remove('open');
  orderForm.reset();

  msg.style.display = 'block';
  setTimeout(() => {
    msg.style.display = 'none';
  }, 2000);
});

loadCart();
renderCart();
