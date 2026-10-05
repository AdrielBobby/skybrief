const form = document.getElementById("search-form");
const input = document.getElementById("city-input");
const statusEl = document.getElementById("status");
const card = document.getElementById("weather");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = input.value.trim();
  statusEl.textContent = "Loading...";
  card.classList.add("hidden");

  try {
    // Step 1: city name -> latitude/longitude
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    const geo = await geoRes.json();
    if (!geo.results) throw new Error("City not found");
    const { latitude, longitude, name, country } = geo.results[0];

    // Step 2: coordinates -> current weather
    const wRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
    );
    if (!wRes.ok) throw new Error("Weather request failed");
    const w = (await wRes.json()).current;

    // textContent (not innerHTML) = XSS-safe
    document.getElementById("city-name").textContent = `${name}, ${country}`;
    document.getElementById("temp").textContent = `Temperature: ${w.temperature_2m} °C`;
    document.getElementById("wind").textContent = `Wind: ${w.wind_speed_10m} km/h`;
    document.getElementById("humidity").textContent = `Humidity: ${w.relative_humidity_2m} %`;

    statusEl.textContent = "";
    card.classList.remove("hidden");
  } catch (err) {
    statusEl.textContent = "Error: " + err.message;
  }
});