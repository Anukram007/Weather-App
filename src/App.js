import React from "react";
import Lottie from "react-lottie";
import Header from "./Components/Header";
import ComingWeatherForecast from "./Components/ComingWeatherForecast";
import { setWeatherAnimation, openWeatherKey, weatherUrl } from './Utils/index';
import "./Styles/main.css";
// import axios from "axios";

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

  componentDidMount = async () => {
    this.getWeather();
    //To check the API data for Test Case
    // console.log(await axios.get("https://api.openweathermap.org/data/2.5/weather?&q=Kolkata&APPID=faa3b9d358ff0e05601c8ec6ea446ef5&units=metric").then(results => {
    //   return JSON.stringify(results.data)
    // }));
  };

  getWeather = () => {

    // OpenWeather Info
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
          weatherAnimation: setWeatherAnimation(this.state.weatherType)
        })
      });
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
