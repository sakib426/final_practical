const API_URL =
    "https://www.themealdb.com/api/json/v1/1/search.php?s=";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const mealContainer = document.getElementById("mealContainer");
const loading = document.getElementById("loading");
const message = document.getElementById("message");
const showAllContainer = document.getElementById("showAllContainer");
const showAllBtn = document.getElementById("showAllBtn");

let allMeals = [];
let showingAll = false;


async function searchMeals(mealName) {

    if (mealName === "") {
        message.textContent = "Please enter a meal name.";
        message.classList.remove("hidden");
        return;
    }

    mealContainer.innerHTML = "";
    message.classList.add("hidden");
    showAllContainer.classList.add("hidden");

    loading.classList.remove("hidden");

    try {

        const response = await fetch(
            API_URL + encodeURIComponent(mealName)
        );

        const data = await response.json();

        loading.classList.add("hidden");

        if (!data.meals) {

            message.textContent =
                "No meals found. Please try another meal.";

            message.classList.remove("hidden");

            return;
        }

        allMeals = data.meals;

        showingAll = false;

        displayMeals(allMeals.slice(0, 5));

        if (allMeals.length > 5) {
            showAllContainer.classList.remove("hidden");
        }

    } catch (error) {

        loading.classList.add("hidden");

        message.textContent =
            "Something went wrong. Please try again.";

        message.classList.remove("hidden");

        console.error(error);
    }
}


function displayMeals(meals) {

    mealContainer.innerHTML = "";

    meals.forEach(meal => {

        const card = document.createElement("div");

        card.className = "meal-card";

        card.innerHTML = `
            <div class="meal-image">

                <img
                    src="${meal.strMealThumb}"
                    alt="${meal.strMeal}"
                >

                <div class="meal-id">
                    ID: ${meal.idMeal}
                </div>

            </div>

            <div class="meal-content">

                <div class="meal-category">
                    ${meal.strCategory || "MEAL"}
                </div>

                <h3 class="meal-title">
                    ${meal.strMeal}
                </h3>

                <p class="meal-name">
                    Cuisine: ${meal.strArea || "Unknown"}
                </p>

                <p class="instructions">
                    ${meal.strInstructions
                        ? meal.strInstructions.substring(0, 150) + "..."
                        : "No instructions available."}
                </p>

                <button
                    class="instruction-btn"
                    onclick="showMealDetails('${meal.idMeal}')"
                >
                    👨‍🍳 VIEW FULL RECIPE
                </button>

            </div>
        `;

        mealContainer.appendChild(card);
    });
}


searchBtn.addEventListener("click", function () {

    const mealName = searchInput.value.trim();

    searchMeals(mealName);
});


searchInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        const mealName = searchInput.value.trim();

        searchMeals(mealName);
    }
});


showAllBtn.addEventListener("click", function () {

    if (showingAll === false) {

        displayMeals(allMeals);

        showAllBtn.textContent = "SHOW LESS";

        showingAll = true;

    } else {

        displayMeals(allMeals.slice(0, 5));

        showAllBtn.textContent = "SHOW ALL MEALS";

        showingAll = false;
    }
});


async function showMealDetails(id) {

    try {

        const response = await fetch(
            "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
        );

        const data = await response.json();

        const meal = data.meals[0];

        document.getElementById("modalImage").src =
            meal.strMealThumb;

        document.getElementById("modalTitle").textContent =
            meal.strMeal;

        document.getElementById("modalInstructions").textContent =
            meal.strInstructions;

        document.getElementById("modalInfo").innerHTML = `
            <span>ID: ${meal.idMeal}</span>
            <span>Category: ${meal.strCategory}</span>
            <span>Area: ${meal.strArea}</span>
        `;

        document
            .getElementById("mealModal")
            .classList
            .remove("hidden");

    } catch (error) {

        console.error(error);
    }
}


document
    .getElementById("closeModal")
    .addEventListener("click", function () {

        document
            .getElementById("mealModal")
            .classList
            .add("hidden");
    });


document
    .getElementById("mealModal")
    .addEventListener("click", function (event) {

        if (event.target === this) {

            this.classList.add("hidden");
        }
    });