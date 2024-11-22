// Global variables
const propertiesPerPage = 8;
let currentPage = 1;
let allProperties = []; // Store all properties for filtering/searching
let properties = []; // This will be used for pagination

// Send mail function
function sendMail() { 
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const parms = {
        email: email,
        message: message,
    };

    if (!email || !message) {
        alert('Fields must not be empty');
    } else {
        emailjs.send('service_gwd1jcf', 'template_et5l90l', parms)
            .then(() => alert('Email sent successfully!!'))
            .catch((error) => alert('Error sending email: ' + error));
    }
}

// Get bookmarked properties from localStorage
const getBookmarkedItems = () => {
    const bookmarks = localStorage.getItem('bookmarkedItems');
    return bookmarks ? JSON.parse(bookmarks) : [];
};

// Save bookmarked properties to localStorage
const saveBookmarkedItems = (bookmarkedItems) => {
    localStorage.setItem('bookmarkedItems', JSON.stringify(bookmarkedItems));
};

// Bookmark an item
const bookmarkItem = (propertyId) => {
    const bookmarkedItems = getBookmarkedItems();
    if (!bookmarkedItems.includes(propertyId)) {
        bookmarkedItems.push(propertyId);
        saveBookmarkedItems(bookmarkedItems);
        alert("Item bookmarked!");
    } else {
        alert("Item is already bookmarked!");
    }
};

// Remove a bookmarked item
const removeBookmark = (propertyId) => {
    const bookmarkedItems = getBookmarkedItems();
    const updatedBookmarks = bookmarkedItems.filter((id) => id !== propertyId);
    saveBookmarkedItems(updatedBookmarks);
    alert("Item removed from bookmarks.");
    displayBookmarks(); // Update the display in bookmark.html
};

// Fetch properties and initialize
const fetchProperties = async () => {
    try {
        const response = await fetch("properties.json");
        const data = await response.json();
        allProperties = data.properties;
        properties = [...allProperties]; // Initialize properties with all data
        updateDisplay(); // Display with pagination
        generateFilterButtons(allProperties); // Generate filters
    } catch (error) {
        console.error('Error fetching property data', error);
    }
};

// Display items for the current page
function displayItems() {
    const start = (currentPage - 1) * propertiesPerPage;
    const end = start + propertiesPerPage;
    const itemsToShow = properties.slice(start, end);

    const propertyContainer = document.getElementById('propertyContainer');
    propertyContainer.innerHTML = '';

    if (itemsToShow.length === 0) {
        propertyContainer.innerHTML = "<p>No data found</p>";
        return;
    }

    itemsToShow.forEach((property) => {
        const propertyCard = document.createElement('div');
        propertyCard.classList.add('c-property');
        propertyCard.innerHTML = `
            <img src="${property.image}" alt="${property.name} ${property.location}" width="300">
            <h2>${property.name}</h2>
            <p>Price: ${property.price}</p>
            <p>Address: ${property.address}</p>
            <p>Location: ${property.location}</p>
            <p>Area: ${property.area}</p>
            <p>Parking Spot: ${property.parking_spot}</p>
            <button class="btn bookmark-btn" data-id="${property.id}">Bookmark item</button>
        `;
        // propertyCard.addEventListener("click", (e) => {
        //     const saveBtn = e.target.closest(".btn");
        //     saveBtn.style.color = "";    
        // });
        propertyContainer.appendChild(propertyCard);
    });

        // Add event listeners for bookmark buttons
        const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
        bookmarkButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const propertyId = parseInt(event.target.getAttribute('data-id'));
                bookmarkItem(propertyId);
            });
        });
}

// Display bookmarks on bookmark.html
const displayBookmarks = () => {
    const bookmarkedItems = getBookmarkedItems();
    const propertyContainer = document.getElementById('bookmarkContainer');
    propertyContainer.innerHTML = '';

    if (bookmarkedItems.length === 0) {
        propertyContainer.innerHTML = "<p>No bookmarked items found</p>";
        return;
    }

    bookmarkedItems.forEach((id) => {
        const property = allProperties.find((item) => item.id === id);
        if (property) {
            const propertyCard = document.createElement('div');
            propertyCard.classList.add('c-property');
            propertyCard.innerHTML = `
                <img src="${property.image}" alt="${property.name} ${property.location}" width="300">
                <h2>${property.name}</h2>
                <p>Price: ${property.price}</p>
                <p>Address: ${property.address}</p>
                <p>Location: ${property.location}</p>
                <p>Area: ${property.area}</p>
                <p>Parking Spot: ${property.parking_spot}</p>
                <button class="btn remove-btn" data-id="${property.id}">Remove Bookmark</button>
            `;
            propertyContainer.appendChild(propertyCard);
        }
    });

    // Add event listeners for remove buttons
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const propertyId = parseInt(event.target.getAttribute('data-id'));
            removeBookmark(propertyId);
        });
    });
};

// Initialize data and event listeners
window.onload = () => {
    const isBookmarkPage = document.body.id === "bookmarkPage";

    fetchProperties().then(() => {
        if (isBookmarkPage) {
            displayBookmarks(); // Display bookmarks only on bookmark.html
        } else {
            updateDisplay(); // Normal property display on index.html
        }
    });
}

// Pagination controls
function updatePagination() {
    const totalPages = Math.ceil(properties.length / propertiesPerPage);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.classList.add('prev-button');
        prevButton.innerText = "Previous";
        prevButton.addEventListener("click", () => {
            currentPage--;
            updateDisplay();
        });
        pagination.appendChild(prevButton);
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.classList.add('page-button');
        pageButton.innerText = i;
        pageButton.className = i === currentPage ? "active" : "";
        pageButton.addEventListener("click", () => {
            currentPage = i;
            updateDisplay();
        });
        pagination.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.classList.add('nxtpage-button');
        nextButton.innerText = "Next";
        nextButton.addEventListener("click", () => {
            currentPage++;
            updateDisplay();
        });
        pagination.appendChild(nextButton);
    }
}

// Update display with pagination
function updateDisplay() {
    displayItems();
    updatePagination();
}

// Dynamically create filter buttons
const generateFilterButtons = (properties) => {
    const filterButtonsContainer = document.getElementById('filterButtons');
    const uniqueNames = [...new Set(properties.map((property) => property.location))];

    uniqueNames.forEach((location) => {
        const button = document.createElement('button');
        button.textContent = location;
        button.addEventListener('click', () => filterPropertiesByLocation(location));
        filterButtonsContainer.appendChild(button);
    });
};

// Filter properties by location
const filterPropertiesByLocation = (location) => {
    properties = allProperties.filter((property) => property.location === location);
    currentPage = 1; // Reset to the first page
    updateDisplay();
};

// Search functionality
const searchProperties = (query) => {
    if (query === "") {
        properties = [...allProperties]; // Reset to original data if no search query
    } else {
        properties = allProperties.filter((property) => 
            property.name.toLowerCase().includes(query.toLowerCase()) ||
            property.location.toLowerCase().includes(query.toLowerCase())
        );
    }
    currentPage = 1; // Reset to the first page
    updateDisplay();
};

// Initialize data and event listeners
window.onload = () => {
    fetchProperties();

    // Initialize search input listener
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener("input", (event) => {
        searchProperties(event.target.value);
    });
};

