const drinks = [
  { id: 1, name: "Pepsi", brand: "Pepsi", price: 40, caffeine: "Yes", dietary: "Contains Sugar",
    image: "https://as1.ftcdn.net/jpg/02/88/22/60/1000_F_288226078_DPT0wLkxHtZFcF8bbQCirRpR96wlWxka.jpg"
  },
  { id: 2, name: "Mirinda", brand: "Mirinda", price: 35, caffeine: "No", dietary: "Contains Sugar",
    image: "https://as2.ftcdn.net/jpg/05/05/79/99/1000_F_505799961_IfByycPLuAWGIT1DNoK4jC0BnKyPu0Fx.jpg"
  },
  { id: 3, name: "7UP", brand: "7UP", price: 35, caffeine: "No", dietary: "Contains Sugar",
    image: "https://as2.ftcdn.net/jpg/04/37/90/27/1000_F_437902741_aK3VggBNvwwpu0U4O5HPJsOp9mBxeD74.jpg"
  },
  { id: 4, name: "Mountain Dew", brand: "Mountain Dew", price: 45, caffeine: "Yes", dietary: "Contains Sugar",
    image: "https://as2.ftcdn.net/jpg/15/73/68/81/1000_F_1573688136_90JfgVZ7B0db94mYPUVmf3LhdwJCn6za.jpg"
  },
  { id: 5, name: "Slice", brand: "Slice", price: 50, caffeine: "No", dietary: "Contains Sugar",
    image: "https://i.pinimg.com/originals/bf/de/da/bfdeda138026a563a12a40bd3922dfc5.jpg"
  }
];

localStorage.setItem('allDrinks', JSON.stringify(drinks));

const grid = document.getElementById('grid');
const search = document.getElementById('search');
const filterBrand = document.getElementById('filterBrand');
const filterCaffeine = document.getElementById('filterCaffeine');
const filterDietary = document.getElementById('filterDietary');
const popupContainer = document.getElementById('popupContainer');

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderDrinks(list) {
  grid.innerHTML = '';
  if (list.length === 0) {
    grid.innerHTML = '<p class="col-span-full text-center text-gray-500">No drinks found.</p>';
    return;
  }
  list.forEach(drink => {
    const card = document.createElement('div');
    const isFav = favorites.includes(drink.id);
    card.className = 'border rounded-lg p-4 text-center shadow hover:shadow-lg transition bg-white relative';
    card.innerHTML = `
      <button class="absolute top-2 right-2 favorite-btn text-2xl ${isFav ? 'text-red-500' : 'text-gray-300'}">&#10084;</button>
      <img src="${drink.image}" class="h-32 mx-auto mb-2 object-contain" alt="${drink.name}">
      <h2 class="font-bold">${drink.name}</h2>
      <p class="text-gray-500">${drink.brand}</p>
      <p class="text-green-600 font-bold mb-2">₹${drink.price}</p>
      <button class="add-cart bg-blue-600 text-white px-4 py-2 rounded mt-2">Add to Cart</button>
    `;
    card.querySelector('.favorite-btn').addEventListener('click', () => toggleFavorite(drink.id));
    card.querySelector('.add-cart').addEventListener('click', () => addToCart(drink.id));
    grid.appendChild(card);
  });
}

function filterDrinks() {
  const query = search.value.toLowerCase();
  const brand = filterBrand.value;
  const caffeine = filterCaffeine.value;
  const dietary = filterDietary.value;
  const filtered = drinks.filter(d =>
    d.name.toLowerCase().includes(query) &&
    (brand === '' || d.brand === brand) &&
    (caffeine === '' || d.caffeine === caffeine) &&
    (dietary === '' || d.dietary === dietary)
  );
  renderDrinks(filtered);
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
    showPopup('💔 Removed from Favorites', 'bg-gray-700'); // Broken heart emoji
  } else {
    favorites.push(id);
    showPopup('❤️ Added to Favorites', 'bg-red-500'); // Red heart emoji
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderDrinks(drinks);
}



function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  showPopup('✅ Added to Cart', 'bg-green-500');
}

function showPopup(message, color) {
  const popup = document.createElement('div');
  popup.className = `text-white ${color} px-4 py-2 rounded shadow mb-2 animate-bounce`;
  popup.textContent = message;
  popupContainer.appendChild(popup);
  setTimeout(() => popup.remove(), 2000);
}

search.addEventListener('input', filterDrinks);
filterBrand.addEventListener('change', filterDrinks);
filterCaffeine.addEventListener('change', filterDrinks);
filterDietary.addEventListener('change', filterDrinks);

renderDrinks(drinks);
