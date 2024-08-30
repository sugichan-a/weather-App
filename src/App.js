import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [weather, setWeather] = useState(null);
  const [background, setBackground] = useState('');
  const [city, setCity] = useState('Tokyo'); // デフォルトの都市
  const [loading, setLoading] = useState(true);

  const cities = ['Tokyo', 'New York', 'London', 'Paris', 'Sydney']; // 選択できる都市のリスト

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_API_KEY; // 環境変数からAPIキーを取得
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    setLoading(true); // ローディング状態を設定

    axios.get(URL)
      .then(response => {
        setWeather(response.data);
        const weatherDescription = response.data.weather[0].description;

        if (weatherDescription.includes('clear')) {
          setBackground('/images/clear-sky.jpg');
        } else if (weatherDescription.includes('clouds')) {
          setBackground('/images/cloudy.jpg');
        } else if (weatherDescription.includes('rain')) {
          setBackground('/images/rainy.jpg');
        } else if (weatherDescription.includes('snow')) {
          setBackground('/images/snowy.jpg');
        } else {
          setBackground('/images/default.jpg');
        }
        setLoading(false); // データ取得後にローディング状態を解除
      })
      .catch(error => {
        console.error("Error fetching weather data: ", error);
        setLoading(false); // エラー発生時もローディング状態を解除
      });
  }, [city]); // `city`が変更されるたびに再取得

  const handleCityChange = (event) => {
    setCity(event.target.value); // 選択された都市を設定
  };

  return (
    <div className="App" style={{ backgroundImage: `url(${background})` }}>
      <header className="App-header">
        <div className="text-with-background-container">
          <h1 className="text-with-background">Weather App</h1>
        </div>
        <div>
          <label htmlFor="city-select">Choose a city:</label>
          <select id="city-select" value={city} onChange={handleCityChange}>
            {cities.map((cityName) => (
              <option key={cityName} value={cityName}>{cityName}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : weather ? (
          <div>
            <h2>{weather.name}</h2>
            <p>{weather.weather[0].description}</p>
            <p>{weather.main.temp}°C</p>
          </div>
        ) : (
          <p>Error fetching weather data.</p>
        )}
      </header>
    </div>
  );
}

export default App;
