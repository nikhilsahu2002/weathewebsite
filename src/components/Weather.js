import React, { useEffect, useState } from "react";
import "./weather.css";
import searchIcon from "../Assets/search.png";
import weatherIcon from "../Assets/cloud.png";
import Humidity from "../Assets/humidity.png";
import Wind from "../Assets/wind.png";

export default function Weather() {
  const REACT_APP_API_URL = "https://api.openweathermap.org/data/2.5";
  const REACT_APP_API_KEY = "406e0e52ba8c2b16d6a309e498fa2381";

  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const position = await getCurrentPosition();
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);

        const weather = await fetchWeatherData(lat, lon);

        setWeatherData(weather);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [lat, lon]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      },
      (error) => {
        console.error("Error getting location: ", error);
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };
  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `${REACT_APP_API_URL}/weather/?lat=${latitude}&lon=${longitude}&units=metric&APPID=${REACT_APP_API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Weather data request failed");
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching weather data: ", error);
      throw error;
    }
  };

  const search = async () => {
    const element = document.querySelector(".cityInput");
    if (!element) return;

    const cityName = element.value;
    if (!cityName) return;

    try {
      const response = await fetch(
        `${REACT_APP_API_URL}/weather?q=${cityName}&units=metric&APPID=${REACT_APP_API_KEY}`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }
      const result = await response.json();
      setWeatherData(result);
    } catch (error) {
      console.error("Error fetching weather data for city: ", error);
      // Handle the error (e.g., display a message to the user)
    }
  };

  return (
    <div className="container1">
      <div className="top-bar">
        <input type="text" className="cityInput" placeholder="Search city" />
        <div className="search-icon" onClick={search}>
          <img src={searchIcon} alt="Search" />
        </div>
      </div>
      <div className="weather_icon">
        <img src={weatherIcon} alt="Weather" />
      </div>
      <div className="weather-temp">
        {weatherData ? `${Math.round(weatherData.main.temp)}°C` : "Loading..."}
      </div>
      <div className="weather-location">
        {weatherData ? weatherData.name : "Location"}
      </div>
      <div className="data-container">
        <div className="element">
          <img src={Humidity} alt="Humidity" className="icon" />
          <div className="data">
            {weatherData ? (
              <div className="humidity-percentage">
                {weatherData.main.humidity}%
              </div>
            ) : (
              <div className="humidity-percentage">Loading...</div>
            )}
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={Wind} alt="Wind" className="icon" />
          <div className="data">
            {weatherData ? (
              <div className="humidity-percentage">
                {weatherData.wind.speed} KM
              </div>
            ) : (
              <div className="humidity-percentage">Loading...</div>
            )}
            <div className="text">Wind</div>
          </div>
        </div>
      </div>
    </div>
  );
}
