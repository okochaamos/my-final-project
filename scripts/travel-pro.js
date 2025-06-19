
   function showTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
    }

    async function planTrip() {
      const city = document.getElementById('cityInput').value;
      if (city) {
        alert('Planning trip to ' + city);
        // TODO: Trigger Amadeus API requests for flights/hotels/attractions
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

    document.getElementById('cityInput').addEventListener('input', (e) => {
      const query = e.target.value;
      if (query.length >= 3) fetchCitySuggestions(query);
    });