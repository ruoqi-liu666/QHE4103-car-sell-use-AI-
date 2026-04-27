// Sample car data for demonstration
const sampleCars = [
  {
    id: 1,
    model: "BMW 3 Series",
    year: 2020,
    color: "Black",
    price: 285000,
    location: "Beijing",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",
    description: "Well-maintained BMW 3 Series with low mileage. Features leather seats, sunroof, and advanced safety systems."
  },
  {
    id: 2,
    model: "Audi A4",
    year: 2021,
    color: "White",
    price: 320000,
    location: "Shanghai",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&h=400&fit=crop",
    description: "Premium Audi A4 in excellent condition. Includes Quattro all-wheel drive and virtual cockpit."
  },
  {
    id: 3,
    model: "Mercedes C-Class",
    year: 2019,
    color: "Silver",
    price: 265000,
    location: "Guangzhou",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop",
    description: "Elegant Mercedes C-Class with luxurious interior and smooth performance."
  },
  {
    id: 4,
    model: "Tesla Model 3",
    year: 2022,
    color: "Red",
    price: 235000,
    location: "Shenzhen",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop",
    description: "Electric Tesla Model 3 with autopilot capability and minimal maintenance needs."
  },
  {
    id: 5,
    model: "BMW 5 Series",
    year: 2021,
    color: "Blue",
    price: 420000,
    location: "Beijing",
    image: "https://images.unsplash.com/photo-1556189250-72ba95452da9?w=600&h=400&fit=crop",
    description: "Executive BMW 5 Series with premium features and spacious interior."
  },
  {
    id: 6,
    model: "Audi A6",
    year: 2020,
    color: "Black",
    price: 380000,
    location: "Shanghai",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop",
    description: "Sophisticated Audi A6 with advanced technology package and comfort features."
  },
  {
    id: 7,
    model: "Honda Accord",
    year: 2019,
    color: "White",
    price: 158000,
    location: "Chengdu",
    image: "https://images.unsplash.com/photo-1605816988065-b41a8f6d6e79?w=600&h=400&fit=crop",
    description: "Reliable Honda Accord with great fuel efficiency and comfortable ride."
  },
  {
    id: 8,
    model: "Toyota Camry",
    year: 2021,
    color: "Silver",
    price: 175000,
    location: "Hangzhou",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=600&h=400&fit=crop",
    description: "Popular Toyota Camry known for reliability and resale value."
  }
];

// Store cars in localStorage for persistence across pages
if (!localStorage.getItem('carListings')) {
  localStorage.setItem('carListings', JSON.stringify(sampleCars));
}

function getCarListings() {
  return JSON.parse(localStorage.getItem('carListings')) || sampleCars;
}

function saveCarListings(cars) {
  localStorage.setItem('carListings', JSON.stringify(cars));
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.getElementById('searchForm');
  const resultsContainer = document.getElementById('resultsContainer');
  const resultsCount = document.getElementById('resultsCount');

  if (searchForm) {
    // Check if there's a search query in URL
    const urlParams = new URLSearchParams(window.location.search);
    const modelQuery = urlParams.get('model');
    const yearQuery = urlParams.get('year');

    if (modelQuery || yearQuery) {
      document.getElementById('modelInput').value = modelQuery || '';
      document.getElementById('yearInput').value = yearQuery || '';
      performSearch(modelQuery, yearQuery);
    }

    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const model = document.getElementById('modelInput').value.trim();
      const year = document.getElementById('yearInput').value.trim();
      performSearch(model, year);

      // Update URL without reloading
      const params = new URLSearchParams();
      if (model) params.set('model', model);
      if (year) params.set('year', year);
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
    });
  }

  function performSearch(model, year) {
    const cars = getCarListings();
    let filtered = cars;

    if (model) {
      const modelLower = model.toLowerCase();
      filtered = filtered.filter(car => car.model.toLowerCase().includes(modelLower));
    }

    if (year) {
      filtered = filtered.filter(car => car.year.toString() === year);
    }

    renderResults(filtered);
  }

  function renderResults(cars) {
    if (!resultsContainer) return;

    if (cars.length === 0) {
      resultsContainer.innerHTML = `
        <div class="no-results">
          <h3>No vehicles found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      `;
      if (resultsCount) resultsCount.textContent = '0 results';
      return;
    }

    if (resultsCount) {
      resultsCount.textContent = `${cars.length} result${cars.length > 1 ? 's' : ''} found`;
    }

    const grid = document.createElement('div');
    grid.className = 'results-grid';

    cars.forEach(car => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${car.image}" alt="${car.model}" class="card-image" onerror="this.src='https://via.placeholder.com/600x400?text=${encodeURIComponent(car.model)}'">
        <div class="card-content">
          <h4 class="card-title">${car.model}</h4>
          <div class="card-meta">
            <span>${car.year}</span>
            <span>${car.color}</span>
            <span>${car.location}</span>
          </div>
          <div class="card-price">¥${car.price.toLocaleString()}</div>
        </div>
      `;
      card.addEventListener('click', () => {
        window.location.href = `car-detail.html?id=${car.id}`;
      });
      grid.appendChild(card);
    });

    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(grid);
  }
});
