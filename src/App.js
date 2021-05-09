import React, { useState, useEffect } from 'react';

const api = {
  key: "a9346aa8cbb9cd7d78d1329ca69bdbcd",
  // key: "893db15bcf0f784c57bfae474a7ba1e1",
  base: "https://api.openweathermap.org/data/2.5/"
}


function App() {

  useEffect(() => {

    const successfulLookup = position => {
      const { latitude, longitude } = position.coords;
      fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=f090ea5238b8437fbc5ed6d9b0f9e261`)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          const query = result.results[0].components.city;
          // weatherOnLoad(query);
          weatherOnLoad(query);
        })
    };

    const weatherOnLoad = query => {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
          console.log(result);
        });
    };

    // successfulLookup();

    if (window.navigator.geolocation) {
      // Geolocation available
      window.navigator.geolocation
       .getCurrentPosition(successfulLookup, console.log);
    }
  }, []);


  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});

  const search = evt => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
          console.log(result);
        });
    }
  }

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }


  return (
    <div className={(typeof weather.main != "undefined") ? ((weather.main.temp > 16) ? 'app warm' : 'app') : 'app'}>
      <main>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {(typeof weather.main != "undefined") ? (
        <div>
          <div className="location-box">
            <div className="location">{weather.name}, {weather.sys.country}</div>
            <div className="date">{dateBuilder(new Date())}</div>
          </div>
          <div className="weather-box">
            <div className="temp">
              {Math.round(weather.main.temp)}°c
            </div>
            <div className="weather">{weather.weather[0].main}</div>
          </div>
        </div>
        ) : ('')}
      </main>
    </div>

  );
}

export default App;
