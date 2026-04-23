const mockCarData = [
    { id: 101, model: "Luxury Sedan", year: "2023", price: "$65,000", color: "Black" },
    { id: 102, model: "Sport SUV", year: "2022", price: "$85,000", color: "White" },
    { id: 103, model: "Executive Sedan", year: "2024", price: "$92,000", color: "Silver" },
    { id: 104, model: "Compact SUV", year: "2023", price: "$45,000", color: "Grey" }
];

document.addEventListener("DOMContentLoaded", function()
{
    const searchForm = document.getElementById("searchForm");
    
    searchForm.addEventListener("submit", function(event)
    {
        event.preventDefault();
        executeSearch();
    });

    renderResults(mockCarData);
});

function executeSearch()
{
    const modelQuery = document.getElementById("modelInput").value.trim().toLowerCase();
    const yearQuery = document.getElementById("yearInput").value.trim();

    const filteredCars = mockCarData.filter(function(car)
    {
        const matchesModel = modelQuery === "" || car.model.toLowerCase().includes(modelQuery);
        const matchesYear = yearQuery === "" || car.year === yearQuery;
        
        return matchesModel && matchesYear;
    });

    renderResults(filteredCars);
}

function renderResults(cars)
{
    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = "";

    if (cars.length === 0)
    {
        resultsContainer.innerHTML = "<p>No vehicles match your search criteria.</p>";
        return;
    }

    cars.forEach(function(car)
    {
        const card = document.createElement("div");
        card.className = "car-card";
        card.onclick = function()
        {
            window.location.href = "car-detail.html?id=" + car.id;
        };

        const imageContainer = document.createElement("div");
        imageContainer.className = "car-image-container";

        const infoContainer = document.createElement("div");
        infoContainer.className = "car-info";

        const title = document.createElement("h3");
        title.textContent = car.model;

        const details = document.createElement("div");
        details.className = "car-details";
        details.textContent = car.year + " | " + car.color;

        const price = document.createElement("div");
        price.className = "car-price";
        price.textContent = car.price;

        infoContainer.appendChild(title);
        infoContainer.appendChild(details);
        infoContainer.appendChild(price);

        card.appendChild(imageContainer);
        card.appendChild(infoContainer);

        resultsContainer.appendChild(card);
    });
}