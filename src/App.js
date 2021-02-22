import React, {useState} from 'react';

const weatherApi = {
  key : "8eadc328b47149521321cf2bb779cf36",
  base : "https://api.openweathermap.org/data/2.5/"
}

const timeApi = {
  key : "YNV6KRHE7W2R",
  base : "http://api.timezonedb.com/v2.1/"
}

let lat = "";
let lon = "";
let format = '';
let tBack = ''

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [time, setTime] = useState({});

  const search = evt => {
    if(evt.key === "Enter") {
      fetch(`${weatherApi.base}weather?q=${query}&units=metrics&APPID=${weatherApi.key}`)
      .then(res => res.json())
      .then(result => {
        getTime(result);
        setWeather(result);
        setQuery('');
        // console.log(result);
      });
    }
  }

  function getTime(d) {
    lat = d.coord.lat;
    lon = d.coord.lon;

    fetch(`${timeApi.base}get-time-zone?key=${timeApi.key}&format=json&by=position&lat=${d.coord.lat}&lng=${d.coord.lon}`)
    .then(res => res.json())
    .then(data => {
      putTime(data);
      setTime(data);
      setQuery('');
      console.log(data);
    })
  }

  function putTime(t){
    format = t.formatted;
    format = format.split(" ");
    tBack = format[1].split(":");
    // console.log(tBack);
  }

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${month} ${date} ${year}`
  }

  function appSelect(season){
    if(season == 'Clear' || season == 'Snow')
    {
      if((weather.main.temp-273.15) < 17)
      {
        if(tBack[0]>6 && tBack[0]<19)
        {
          return 'app coldDay';
        }
        else
        {
          return 'app coldNight';
        }
      }
      else
      {
        if(tBack[0]>6 && tBack[0]<19)
        {
          return 'app sunny';
        }
        else
        {
          return 'app night';
        }
      }
    }
    else if (season == "Rain") {
      if(tBack[0]>6 && tBack[0]<19)
      {
        return 'app rainyDay';
      }
      else
      {
        return 'app rainyNight';
      }
    }
    else if (season == 'Clouds') {
      if(tBack[0]>6 && tBack[0]<19)
      {
        return 'app cloudDay';
      }
      else
      {
        return 'app cloudNight';
      }
    }
  }

  return (
    <div className={(typeof weather.main != "undefined") ? appSelect(weather.weather[0].main) : 'app'}>
      <main>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Enter City/Country Name..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {(typeof weather.main != "undefined") ? (
        <div>
          <div className="location-box">
            <div className="location">{weather.name}, {time.countryName}</div>
            <div className="date">{dateBuilder(new Date())}</div>
          </div>
          <div className="weather-box">
            <div className="temp">{Math.round(weather.main.temp-273.15)}°c</div>
            <div className="weather">{weather.weather[0].main}</div>
          </div>
          <div className="time-box">
            <div className="time">{format[1]}</div>
            <div className="zone">{time.zoneName}</div>
          </div>
        </div>
      ) : ('')}
      </main>
    </div>
  );
}

export default App;
