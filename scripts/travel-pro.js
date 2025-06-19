
    function showTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
    }

    function planTrip() {
      const city = document.getElementById('cityInput').value;
      if (city) {
        alert('Planning trip to ' + city);
        
      }
    }
  