// Global variables
const propertiesPerPage = 8;
let currentPage = 1;
let properties = [];

// Send mail function
function sendMail() { 
       const email = document.getElementById('email').value.trim();
        const message= document.getElementById('message').value.trim();

        const parms = {
            email : email,
            message: message,
        }

    if(!email || !message){
        alert('Fields must not be empty')
    } else {
        emailjs.send('service_gwd1jcf','template_et5l90l', parms).then(alert('Email sent successfully!!'))
    }
  
}

// Fetch properties and initialize
const fetchProperties = async () => {
    try {
        const response = await fetch("properties.json");
        const data = await response.json();
        properties = data.properties;
        updateDisplay(); // Display with pagination
        generateFilterButtons(properties); // Generate filters
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
            <button>Schedule A Visit</button>
        `;
        propertyContainer.appendChild(propertyCard);
    });
}

// Pagination controls
function updatePagination() {
    const totalPages = Math.ceil(properties.length / propertiesPerPage);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.classList.add('prev-button')
        prevButton.innerText = "Previous";
        prevButton.addEventListener("click", () => {
            currentPage--;
            updateDisplay();
        });
        pagination.appendChild(prevButton);
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.classList.add('page-button')
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
        nextButton.classList.add('nxtpage-button')
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
    properties = properties.filter((property) => property.location === location);
    currentPage = 1; // Reset to the first page
    updateDisplay();
};

// Search functionality
const searchProperties = (query) => {
    const searchedProperties = properties.filter((property) => 
        property.name.toLowerCase().includes(query.toLowerCase()) ||
        property.location.toLowerCase().includes(query.toLowerCase())
    );
    displayProperties(searchedProperties);
};

document.getElementById('searchInput').addEventListener('input', (event) => {
    searchProperties(event.target.value);
});

// Initialize data and event listeners
window.onload = fetchProperties;