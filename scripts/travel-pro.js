function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

document.getElementById('cityInput').addEventListener('input', (e) => {
  const query = e.target.value;
  if (query.length >= 3) fetchCitySuggestions(query);
});

async function planTrip() {
  const city = document.getElementById('cityInput').value;
  if (city) {
    alert('Planning trip to ' + city);
    
    const token = await getAmadeusToken();
    if (token) {
      const origin = "LOS";  
      const destination = "ABV"; 
      const departureDate = "2025-07-01";  
      
      await searchFlights(token, origin, destination, departureDate);
      await searchHotels(token, destination);
    }
  }
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
    console.error(error);
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

async function searchFlights(token, origin, destination, departureDate) {
  const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=1`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await response.json();
  console.log("Flights: ", data);
  alert(`Found ${data.data ? data.data.length : 0} flight offers!`);
}

async function searchHotels(token, cityCode) {
  const url = `https://test.api.amadeus.com/v2/shopping/hotel-offers?cityCode=${cityCode}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await response.json();
  console.log("Hotels: ", data);
  alert(`Found ${data.data ? data.data.length : 0} hotel offers!`);
}
