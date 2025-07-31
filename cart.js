const cartGrid = document.getElementById('cartGrid');
const subtotalEl = document.getElementById('subtotal');
const discountEl = document.getElementById('discount');
const totalEl = document.getElementById('total');
const couponInput = document.getElementById('couponInput');
const applyCoupon = document.getElementById('applyCoupon');
const popupContainer = document.getElementById('popupContainer');
const modal = document.getElementById('emailModal');
const emailInput = document.getElementById('emailInput');
const confirmBuy = document.getElementById('confirmBuy');
const closeModal = document.getElementById('closeModal');

let allDrinks = JSON.parse(localStorage.getItem('allDrinks')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let selectedDrink = null;
let discount = 0;

// Each drink price (you can adjust)
const drinkPrices = {
  Pepsi: 40,
  Mirinda: 35,
  "7UP": 35,
  "Mountain Dew": 45,
  Slice: 50
};

function renderCart() {
  cartGrid.innerHTML = '';
  if (cart.length === 0) {
    cartGrid.innerHTML = '<p class="col-span-full text-center text-gray-500">Your cart is empty.</p>';
    updateTotals();
    return;
  }
  cart.forEach(item => {
    const drink = allDrinks.find(d => d.id === item.id);
    if (drink) {
      const card = document.createElement('div');
      card.className = 'border rounded-lg p-4 text-center bg-white shadow';
      card.innerHTML = `
        <img src="${drink.image}" class="h-32 mx-auto mb-2 object-contain" alt="${drink.name}">
        <h2 class="font-bold">${drink.name}</h2>
        <p class="text-gray-500">Price: ₹${drinkPrices[drink.name]}</p>
        <div class="flex justify-center items-center gap-2 mt-2">
          <button class="decrease px-3 py-1 bg-gray-300 rounded">-</button>
          <span class="quantity text-lg font-bold">${item.quantity}</span>
          <button class="increase px-3 py-1 bg-gray-300 rounded">+</button>
        </div>
        <div class="flex justify-center gap-2 mt-2">
          <button class="buy-btn bg-blue-500 text-white px-3 py-1 rounded">Buy</button>
          <button class="remove-cart bg-red-500 text-white px-3 py-1 rounded">Remove</button>
        </div>
      `;
      card.querySelector('.increase').addEventListener('click', () => changeQuantity(drink.id, 1));
      card.querySelector('.decrease').addEventListener('click', () => changeQuantity(drink.id, -1));
      card.querySelector('.buy-btn').addEventListener('click', () => openModal(drink));
      card.querySelector('.remove-cart').addEventListener('click', () => removeFromCart(drink.id));
      cartGrid.appendChild(card);
    }
  });
  updateTotals();
}

function changeQuantity(id, delta) {
  cart = cart.map(item => {
    if (item.id === id) {
      return { ...item, quantity: Math.max(1, item.quantity + delta) };
    }
    return item;
  });
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  showPopup('✅ Removed from Cart', 'bg-gray-700');
}

function updateTotals() {
  let subtotal = 0;
  cart.forEach(item => {
    const drink = allDrinks.find(d => d.id === item.id);
    if (drink) {
      subtotal += drinkPrices[drink.name] * item.quantity;
    }
  });
  subtotalEl.textContent = `₹${subtotal}`;
  discountEl.textContent = `₹${discount}`;
  totalEl.textContent = `₹${subtotal - discount}`;
}

applyCoupon.addEventListener('click', () => {
  const code = couponInput.value.trim();
  if (code === 'PEPSI10') {
    discount = 10; // flat ₹10 discount
    showPopup('✅ Coupon Applied! ₹10 Off', 'bg-green-500');
  } else {
    discount = 0;
    showPopup('❌ Invalid Coupon', 'bg-red-500');
  }
  updateTotals();
});

function openModal(drink) {
  selectedDrink = drink;
  modal.classList.remove('hidden');
}

confirmBuy.addEventListener('click', () => {
  if (emailInput.value) {
    showPopup(`✅ Order for ${selectedDrink.name} placed!`, 'bg-green-500');
    modal.classList.add('hidden');
    emailInput.value = '';
    setTimeout(() => {
      showPopup('🎉 Thanks for shopping! Continue exploring.', 'bg-blue-600');
    }, 1500);
  } else {
    showPopup('❌ Please enter a valid email.', 'bg-red-500');
  }
});

closeModal.addEventListener('click', () => modal.classList.add('hidden'));

function showPopup(message, color) {
  const popup = document.createElement('div');
  popup.className = `text-white ${color} px-4 py-2 rounded shadow mb-2 animate-bounce`;
  popup.textContent = message;
  popupContainer.appendChild(popup);
  setTimeout(() => popup.remove(), 2000);
}

renderCart();
