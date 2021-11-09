import React from "react";
import Lottie from "react-lottie";
import Header from "./Components/Header";
import ComingWeatherForecast from "./Components/ComingWeatherForecast";

import "./Styles/main.css";
var animationPaths = require("./Components/Lotties/animationPaths");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "Kolkata",
      locationDate: new Date().toDateString(),
      currentAPI: {},
      weatherType: "",
      weatherAnimation: "",
      realTemp: "N/A",
      maxTemp: "N/A",
      minTemp: "N/A",
      humidity: "N/A",
      wind: "N/A",
      unit: "metric"
    };
  }

  updateLocationClick = async newLocation => {
    if (newLocation !== "") {
      await this.setState({
        location: newLocation
      });
      this.getWeather();
    }
  };

  setUnit = unit => {
    this.setState({
      unit: unit
    });
    this.getWeather();
  };

  componentDidMount = () => {
    this.getWeather();
  };

  getWeather = () => {

    // OpenWeather Info
    const openWeatherKey = "faa3b9d358ff0e05601c8ec6ea446ef5";
    const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
    const urlToFetch = `${weatherUrl}?&q=${this.state.location
      }&APPID=${openWeatherKey}&units=${this.state.unit}`;

    fetch(urlToFetch)
      .then(results => {
        return results.json();
      })
      .then(data => {
        this.setState({
          weatherType: data.weather[0].description,
          realTemp: data.main.temp,
          maxTemp: data.main.temp_max,
          minTemp: data.main.temp_min,
          humidity: data.main.humidity,
          wind: data.wind.speed
        });
        this.setState({
          weatherAnimation: this.setWeatherAnimation(this.state.weatherType)
        })
      });
  };

  setWeatherAnimation = weatherType => {
    let animationType = this.getWeatherAnimation(weatherType);
    let animationPath = animationPaths.animationPaths[animationType];
    let defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationPath,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };
    return defaultOptions;
  };

  getWeatherAnimation = weatherType => {
    switch (weatherType) {
      case "clear sky":
        return "sunny";

      case "scattered clouds":
      case "few clouds":
      case "broken clouds":
      case "overcast clouds":
        return "windy";

      case "shower rain":
      case "light intensity drizzle":
      case "drizzle":
      case "heavy intensity drizzle":
      case "light intensity drizzle rain":
      case "drizzle rain":
      case "heavy intensity drizzle rain":
      case "shower rain and drizzle":
      case "heavy shower rain and drizzle":
      case "shower drizzle":
      case "heavy intensity shower rain":
      case "ragged shower rain":
      case "light rain":
      case "rain":
      case "moderate rain":
      case "heavy intensity rain":
      case "very heavy rain":
      case "extreme rain":
        return "partlyShower";

      case "thunderstorm":
      case "thunderstorm with light rain":
      case "thunderstorm with rain":
      case "thunderstorm with heavy rain":
      case "light thunderstorm":
      case "heavy thunderstorm":
      case "ragged thunderstorm":
      case "thunderstorm with light drizzle":
      case "thunderstorm with drizzle":
      case "thunderstorm with heavy drizzle":
        return "thunder";

      case "snow":
      case "freezing rain":
      case "light snow":
      case "Heavy snow":
      case "Sleet":
      case "Light shower sleet":
      case "Shower sleet":
      case "Light rain and snow":
      case "Rain and snow":
      case "Light shower snow":
      case "Shower snow":
      case "Heavy shower snow":
        return "snow";

      case "mist":
      case "smoke":
      case "haze":
      case "sand/ dust whirls":
      case "fog":
      case "sand":
      case "dust":
      case "volcanic ash":
      case "squalls":
      case "tornado":
        return "mist";

      default:
        return "N/A";
    }
  };

  render() {
    return (
      <div className="App">
        <Header updateLocationClick={this.updateLocationClick} setUnit={this.setUnit} />
        <div className="weather-widget">
          <div className="widget-header">
            <div>
              <h1 className="main-location">{this.state.location}</h1>
              <p className="main-info">
                {this.state.locationDate}
              </p>
              <p className="main-info">
                {this.state.weatherType}
              </p>
              <p className="main-tempIcon">
                <Lottie
                  options={this.state.weatherAnimation}
                  height={50}
                  width={65}
                  style={{ margin: 0 }}
                />
                <b className="real-temp">{Math.round(this.state.realTemp)}{this.state.unit === "metric" ? "°C" : "°F"}</b>
              </p>
              <div className="temps">
                <p className="high-temp">
                  High: {Math.floor(this.state.maxTemp)}°
                </p>
                <p className="low-temp">
                  Low: {Math.floor(this.state.minTemp)}°
                </p>
              </div>
            </div>
          </div>
          <div className="current-weather">
            <div className="todays-forecast">
              <p style={{ margin: 0 }}>Humidity: <b>{this.state.humidity}%</b></p>
              <span>Wind: <b>{this.state.wind} kph</b></span>
            </div>
          </div>
          <div className="upcoming-weather-cards">
            <ComingWeatherForecast
              location={this.state.location}
              unit={this.state.unit}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;