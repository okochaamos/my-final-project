document.getElementById('planButton').addEventListener('click', planTrip);

document.getElementById('cityInput').addEventListener('input', (e) => {
  const query = e.target.value;
  if (query.length >= 3) fetchCitySuggestions(query);
});

window.addEventListener('DOMContentLoaded', () => {
  const savedCity = localStorage.getItem('lastCity');
  if (savedCity) {
    document.getElementById('cityInput').value = savedCity;
  }
});

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

async function fetchCitySuggestions(query) {
  const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '2d64dfe853mshb0d15a71dde163cp1b0f4fjsnba01c1ae0bc8',
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const suggestions = document.getElementById("citySuggestions");
    suggestions.innerHTML = "";
    data.data.forEach(city => {
      const option = document.createElement("option");
      option.value = `${city.city}, ${city.countryCode}`;
      suggestions.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
  }
}

async function getAmadeusToken() {
  const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "ZYmBIBuFjs9kG4EssXhC0JozTOUwXF4v",
      client_secret: "0dzknXiNDBsww4tR"
    })
  });
  if (!response.ok) {
    console.error("Failed to get Amadeus token");
    return null;
  }
  const data = await response.json();
  return data.access_token;
}

async function planTrip() {
  const city = document.getElementById('cityInput').value;
  if (!city) {
    alert("Please enter a city.");
    return;
  }

  localStorage.setItem('lastCity', city);

  const token = await getAmadeusToken();
  if (token) {
    const origin = "LOS";  
    const destination = "ABV"; 
    const departureDate = "2025-07-01";

    await searchFlights(token, origin, destination, departureDate);
    await searchHotels(token, destination);
  }
}

async function searchFlights(token, origin, destination, departureDate) {
  const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=1`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  const flightContainer = document.getElementById("flightResults");
  flightContainer.innerHTML = "";

  if (data.data && data.data.length > 0) {
    data.data.forEach(offer => {
      const price = offer.price.total;
      const from = offer.itineraries[0].segments[0].departure.iataCode;
      const to = offer.itineraries[0].segments.slice(-1)[0].arrival.iataCode;

      const div = document.createElement("div");
      div.className = "result-card";
      div.innerHTML = `<strong>${from} ➡️ ${to}</strong><br/>Price: $${price}`;
      flightContainer.appendChild(div);
    });
  } else {
    flightContainer.innerHTML = "<p>No flight offers found.</p>";
  }

  showTab('flights');
}

async function searchHotels(token, cityCode) {
  const url = `https://test.api.amadeus.com/v2/shopping/hotel-offers?cityCode=${cityCode}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  const hotelContainer = document.getElementById("hotelResults");
  hotelContainer.innerHTML = "";

  if (data.data && data.data.length > 0) {
    data.data.forEach(offer => {
      const name = offer.hotel.name;
      const price = offer.offers[0].price.total;

      const div = document.createElement("div");
      div.className = "result-card";
      div.innerHTML = `<strong>${name}</strong><br/>Price per stay: $${price}`;
      hotelContainer.appendChild(div);
    });
  } else {
    hotelContainer.innerHTML = "<p>No hotel offers found.</p>";
  }

  showTab('hotels');
}

document.getElementById('travelForm').addEventListener('submit', function(event) {
      event.preventDefault();
      alert('Thank you for your booking, ' + document.getElementById('fullName').value + '!');
      
  });

  document.getElementById('travelForm').addEventListener('submit', function(event) {
      event.preventDefault();

      const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        destination: document.getElementById('destination').value,
        departureDate: document.getElementById('departureDate').value,
        returnDate: document.getElementById('returnDate').value,
        numTravelers: document.getElementById('numTravelers').value,
        notes: document.getElementById('notes').value
      };

      localStorage.setItem('lastBooking', JSON.stringify(formData));

 
      document.getElementById('confirmation').textContent = `Thank you ${formData.fullName}, your booking for ${formData.destination} has been saved!`;

      document.getElementById('travelForm').reset();

     
    });

    window.addEventListener('DOMContentLoaded', () => {
      const saved = localStorage.getItem('lastBooking');
      if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('fullName').value = data.fullName || "";
        document.getElementById('email').value = data.email || "";
        document.getElementById('destination').value = data.destination || "";
        document.getElementById('departureDate').value = data.departureDate || "";
        document.getElementById('returnDate').value = data.returnDate || "";
        document.getElementById('numTravelers').value = data.numTravelers || "";
        document.getElementById('notes').value = data.notes || "";
      }
    });
  

