document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("searchForm");
    const searchBtn = document.getElementById("searchBtn");
    const carItems = document.querySelectorAll(".car-item");
    const resultsCount = document.getElementById("resultsCount");
    const emptyState = document.getElementById("emptyState");
    const nameInput = document.getElementById("nameInput");
    const brandSelect = document.getElementById("brandSelect");
    const priceSelect = document.getElementById("priceSelect");
    const fuelSelect = document.getElementById("fuelSelect");

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
