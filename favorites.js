const favGrid = document.getElementById('favGrid');
const popupContainer = document.getElementById('popupContainer');

let allDrinks = JSON.parse(localStorage.getItem('allDrinks')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function renderFavorites() {
  favGrid.innerHTML = '';
  if (favorites.length === 0) {
    favGrid.innerHTML = '<p class="col-span-full text-center text-gray-500">No favorites added.</p>';
    return;
  }
  favorites.forEach(id => {
    const drink = allDrinks.find(d => d.id === id);
    if (drink) {
      const card = document.createElement('div');
      card.className = 'border rounded-lg p-4 text-center shadow bg-white';
      card.innerHTML = `
        <img src="${drink.image}" class="h-32 mx-auto mb-2 object-contain" alt="${drink.name}">
        <h2 class="font-bold">${drink.name}</h2>
        <p class="text-gray-500">${drink.brand}</p>
        <p class="text-green-600 font-bold mb-2">₹${drink.price}</p>
        <button class="remove-fav bg-red-500 text-white px-4 py-2 rounded">Remove</button>
      `;
      card.querySelector('.remove-fav').addEventListener('click', () => removeFavorite(id));
      favGrid.appendChild(card);
    }
  });
}

function removeFavorite(id) {
  favorites = favorites.filter(f => f !== id);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
  showPopup('💔 Removed from Favorites', 'bg-gray-700');
}

function showPopup(message, color) {
  const popup = document.createElement('div');
  popup.className = `text-white ${color} px-4 py-2 rounded shadow mb-2 animate-bounce`;
  popup.textContent = message;
  popupContainer.appendChild(popup);
  setTimeout(() => popup.remove(), 2000);
}

renderFavorites();
