document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("searchForm");
    const searchBtn = document.getElementById("searchBtn");
    const carList = document.getElementById("carList");
    let carItems = document.querySelectorAll(".car-item");
    const resultsCount = document.getElementById("resultsCount");
    const emptyState = document.getElementById("emptyState");
    const nameInput = document.getElementById("nameInput");
    const brandSelect = document.getElementById("brandSelect");
    const priceSelect = document.getElementById("priceSelect");
    const fuelSelect = document.getElementById("fuelSelect");
    const detailPagePath = "../Chen Hongjian/car-detail.html";
    const sellerCarsKey = "veluxe-cars";

    function parsePrice(priceText) {
        return Number(priceText.replace(/[^\d]/g, "")) || 0;
    }

    function getPriceTier(price) {
        if (price < 100000) return "low";
        if (price <= 300000) return "mid";
        return "high";
    }

    function readSellerCars() {
        try {
            return JSON.parse(localStorage.getItem(sellerCarsKey)) || [];
        } catch (error) {
            return [];
        }
    }

    function renderSellerCars() {
        const sellerCars = readSellerCars();
        if (!carList || sellerCars.length === 0) return;

        sellerCars.forEach(function (car, index) {
            const item = document.createElement("article");
            item.className = "car-item";
            item.dataset.brand = "seller";
            item.dataset.price = getPriceTier(Number(car.price) || 0);
            item.dataset.fuel = "gasoline";
            item.dataset.source = "seller";
            item.dataset.sellerId = car.id;

            item.innerHTML = `
                <div class="car-image-container">
                    <img src="${car.image}" alt="${car.model}">
                </div>
                <div class="car-info">
                    <div class="car-topline">
                        <span class="car-badge">Seller Listing</span>
                        <span class="car-code">SL-${String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <h3>${car.model}</h3>
                    <p class="car-details">${car.colour || "Premium"} | Seller</p>
                    <p class="car-description">Published by ${car.seller || "a verified seller"} in ${car.location || "Online showroom"}.</p>
                    <p class="car-price">RMB ${Number(car.price || 0).toLocaleString()}</p>
                    <button class="btn-secondary">View Details</button>
                </div>
            `;

            carList.prepend(item);
        });

        carItems = document.querySelectorAll(".car-item");
    }

    function buildCarListings() {
        return Array.from(carItems).map(function (item, index) {
            const image = item.querySelector("img");
            const model = item.querySelector("h3").textContent.trim();
            const details = item.querySelector(".car-details").textContent.split("|").map(function (part) {
                return part.trim();
            });
            const code = item.querySelector(".car-code").textContent.trim();

            const sellerCar = readSellerCars().find(function (car) {
                return item.dataset.sellerId && car.id === item.dataset.sellerId;
            });

            return {
                id: item.dataset.sellerId || String(index + 1),
                model: model,
                year: sellerCar ? sellerCar.year : 2024,
                color: details[0] || "Premium",
                price: parsePrice(item.querySelector(".car-price").textContent),
                location: sellerCar ? sellerCar.location : "Online showroom",
                image: item.dataset.source === "seller" ? image.getAttribute("src") : "../Bi Qinzhi/" + image.getAttribute("src"),
                description: sellerCar
                    ? `Seller listing from ${sellerCar.seller || "verified seller"}. ${sellerCar.model} is available in ${sellerCar.location}.`
                    : item.querySelector(".car-description").textContent.trim(),
                bodyType: details[0] || "",
                fuel: details[1] || item.getAttribute("data-fuel"),
                stockCode: item.dataset.source === "seller" ? code : code,
                seller: sellerCar ? sellerCar.seller : ""
            };
        });
    }

    function syncCarsForDetailPage() {
        localStorage.setItem("carListings", JSON.stringify(buildCarListings()));
    }

    function bindDetailButtons() {
        carItems.forEach(function (item, index) {
            const detailButton = item.querySelector(".btn-secondary");
            detailButton.addEventListener("click", function () {
                syncCarsForDetailPage();
                window.location.href = detailPagePath + "?id=" + encodeURIComponent(item.dataset.sellerId || String(index + 1));
            });
        });
    }

    function updateSearchResults() {
        const searchKeyword = nameInput.value.trim().toLowerCase();
        const selectedBrand = brandSelect.value;
        const selectedPrice = priceSelect.value;
        const selectedFuel = fuelSelect.value;
        let visibleCount = 0;

        carItems.forEach(function (item) {
            const carName = item.querySelector("h3").textContent.toLowerCase();
            const carBrand = item.getAttribute("data-brand");
            const carPrice = item.getAttribute("data-price");
            const carFuel = item.getAttribute("data-fuel");

            const nameMatch = searchKeyword === "" || carName.includes(searchKeyword);
            const brandMatch = selectedBrand === "all" || selectedBrand === carBrand;
            const priceMatch = selectedPrice === "all" || selectedPrice === carPrice;
            const fuelMatch = selectedFuel === "all" || selectedFuel === carFuel;

            if (nameMatch && brandMatch && priceMatch && fuelMatch) {
                item.style.display = "flex";
                visibleCount += 1;
            } else {
                item.style.display = "none";
            }
        });

        resultsCount.textContent = visibleCount === 1
            ? "1 vehicle available"
            : visibleCount + " vehicles available";

        emptyState.hidden = visibleCount !== 0;
    }

    renderSellerCars();
    syncCarsForDetailPage();
    bindDetailButtons();

    const initialQuery = new URLSearchParams(window.location.search).get("q");
    if (initialQuery) nameInput.value = initialQuery;

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        updateSearchResults();
    });

    searchBtn.addEventListener("click", updateSearchResults);

    [brandSelect, priceSelect, fuelSelect].forEach(function (select) {
        select.addEventListener("change", updateSearchResults);
    });

    nameInput.addEventListener("input", updateSearchResults);

    updateSearchResults();
});
