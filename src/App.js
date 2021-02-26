import React, {useState} from 'react';

const api = {
  key : "2dd3a21c523243a8b9082823212302",
  base : "https://api.weatherapi.com/v1/current.json"
}

let format = '';
let tBack = '';

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});

  const search = evt => {
    if(evt.key === "Enter") {
      fetch(`${api.base}?key=${api.key}&q=${query}`)
      .then(res => res.json())
      .then(result => {
        getTime(result);
        setWeather(result);
        setQuery('');
        // console.log(result);
      });
    }
  }

  function getTime(t){
    format = t.location.localtime;
    console.log('Format : ',format);
    format = format.split(" ");
    tBack = format[1].split(":");
    console.log(tBack);
  }

  const dateBuilder = () => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let dt = format[0].split("-");
    
    let date = dt[2];
    let month = months[dt[1]-1];
    let year = dt[0];
   
    return `${month} ${date}, ${year}`
  }

  function appSelect(season){
    if(season == 'Clear' || season == 'Snow')
    {
      if((weather.current.temp_c) < 17)
      {
        if(weather.current.is_day == 1)
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
    else{
      return 'app';
    }
  }

  return (
    <div className={(typeof weather.current != "undefined") ? appSelect(weather.current.condition.text) : 'app'}>
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
        {(typeof weather.current != "undefined") ? (
        <div>
          <div className="location-box">
            <div className="location">{weather.location.name}, {weather.location.region}, {weather.location.country}</div>
            <div className="date">{dateBuilder()}</div>
          </div>
          <div className="weather-box">
            <div className="temp">{weather.current.temp_c}°c</div>
            <div className="weather">{weather.current.condition.text}</div>
          </div>
          <div className="time-box">
            <div className="time">{format[1]}</div>
            <div className="zone">{weather.location.tz_id}</div>
          </div>
        </div>
      ) : ('')}
      </main>
      <footer className="backLink">
      Powered by <a href="https://www.weatherapi.com/" title="Free Weather API">WeatherAPI.com</a>
      </footer>
    </div>
  );
}

export default App;
