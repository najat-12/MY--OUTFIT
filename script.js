
let wardrobe = JSON.parse(localStorage.getItem("wardrobe")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let generations = JSON.parse(localStorage.getItem("generations")) || {
    date: new Date().toDateString(),
    count: 0
};

function saveData() {
    localStorage.setItem("wardrobe", JSON.stringify(wardrobe));
    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("generations", JSON.stringify(generations));
}

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });

    document.getElementById(pageId).classList.remove("hidden");
}

function addClothing() {
    const name = document.getElementById("clothingName").value.trim();
    const category = document.getElementById("clothingCategory").value;
    const photoInput = document.getElementById("clothingPhoto");

    if (!name) {
        alert("Please enter a clothing name.");
        return;
    }

    const file = photoInput.files[0];

    function finishAdding(photo) {
        wardrobe.push({
            id: Date.now(),
            name: name,
            category: category,
            photo: photo
        });

        saveData();
        displayWardrobe();

        document.getElementById("clothingName").value = "";
        photoInput.value = "";
    }

    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            finishAdding(event.target.result);
        };

        reader.readAsDataURL(file);
    } else {
        finishAdding("");
    }
}

function displayWardrobe() {
    const container = document.getElementById("wardrobeItems");

    container.innerHTML = "";

    if (wardrobe.length === 0) {
        container.innerHTML = "<p>Your wardrobe is empty.</p>";
        return;
    }

    wardrobe.forEach(item => {
        const card = document.createElement("div");
        card.className = "clothing-card";

        const image = item.photo
            ? `<img src="${item.photo}" alt="">`
            : "";

        card.innerHTML = `
            ${image}
            <h3>${escapeHTML(item.name)}</h3>
            <p>${escapeHTML(item.category)}</p>
            <button onclick="removeClothing(${item.id})">Delete</button>
        `;

        container.appendChild(card);
    });
}

function removeClothing(id) {
    wardrobe = wardrobe.filter(item => item.id !== id);
    saveData();
    displayWardrobe();
}

function generateOutfit() {
    const today = new Date().toDateString();

    if (generations.date !== today) {
        generations = { date: today, count: 0 };
    }

    if (generations.count >= 7) {
        alert("You have used your 7 free generations today.");
        return;
    }

    if (wardrobe.length === 0) {
        alert("Please add clothes to your wardrobe first.");
        return;
    }

    generations.count++;
    saveData();

    const tops = wardrobe.filter(item => item.category === "Tops");
    const bottoms = wardrobe.filter(item => item.category === "Bottoms");
    const dresses = wardrobe.filter(item => item.category === "Dresses & Jumpsuits");
    const shoes = wardrobe.filter(item => item.category === "Shoes");
    const accessories = wardrobe.filter(item => item.category === "Accessories");

    let outfit = [];

    if (dresses.length > 0) {
        outfit.push(randomItem(dresses));
    } else {
        if (tops.length > 0) outfit.push(randomItem(tops));
        if (bottoms.length > 0) outfit.push(randomItem(bottoms));
    }

    if (shoes.length > 0) outfit.push(randomItem(shoes));
    if (accessories.length > 0) outfit.push(randomItem(accessories));

    const result = document.getElementById("outfitResult");

    result.innerHTML = "<h3>Your outfit suggestion</h3>";

    outfit.forEach(item => {
        result.innerHTML += `
            <div class="clothing-card">
                ${item.photo ? `<img src="${item.photo}" alt="">` : ""}
                <h3>${escapeHTML(item.name)}</h3>
                <p>${escapeHTML(item.category)}</p>
            </div>
        `;
    });

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save Outfit";

    saveButton.onclick = function() {
        favorites.push({
            id: Date.now(),
            items: outfit
        });

        saveData();
        displayFavorites();
        alert("Outfit saved to favorites!");
    };

    result.appendChild(saveButton);
}

function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function displayFavorites() {
    const container = document.getElementById("favoriteItems");

    container.innerHTML = "";

    if (favorites.length === 0) {
        container.innerHTML = "<p>No favorite outfits yet.</p>";
        return;
    }

    favorites.forEach(outfit => {
        const card = document.createElement("div");
        card.className = "clothing-card";

        card.innerHTML = "<h3>Saved Outfit</h3>";

        outfit.items.forEach(item => {
            card.innerHTML += `<p>${escapeHTML(item.name)}</p>`;
        });

        container.appendChild(card);
    });
}

function sendMessage() {
    const input = document.getElementById("chatInput");
    const messages = document.getElementById("chatMessages");

    const message = input.value.trim();

    if (!message) return;

    const userMessage = document.createElement("p");
    userMessage.textContent = "You: " + message;
    messages.appendChild(userMessage);

    const answer = document.createElement("p");
    answer.textContent =
        "AI Stylist: Tell me your occasion and preferred style. I can help you plan a look! This is a demo response; live AI connection is not configured yet.";

    messages.appendChild(answer);

    input.value = "";
}

document.getElementById("tryOnPhoto").addEventListener("change", function(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        document.getElementById("tryOnPreview").innerHTML =
            `<img src="${e.target.result}" alt="Photo preview">`;
    };

    reader.readAsDataURL(file);
});

function saveProfile() {
    const profile = {
        name: document.getElementById("userName").value,
        gender: document.getElementById("gender").value,
        birthDate: document.getElementById("birthDate").value,
        language: document.getElementById("userLanguage").value
    };

    localStorage.setItem("userProfile", JSON.stringify(profile));

    alert("Profile saved successfully!");
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

displayWardrobe();
displayFavorites();
