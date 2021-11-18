import React from "react";
import Lottie from "react-lottie";
import "../../Styles/main.css";
import { getDays, commonString, setWeatherAnimation, openWeatherKey, forecastUrl } from '../../Utils/index';
// import axios from "axios";

class ComingWeatherForecast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fiveDayAPI: {},
      fiveDayForecastState: [],
      location: this.props.location,
      unit: this.props.unit
    };
  }

  componentDidUpdate = prevProps => {
    if (prevProps.location !== this.props.location || prevProps.unit !== this.props.unit) {
      this.setState(
        {
          location: this.props.location,
          unit: this.props.unit
        },
        this.getWeather
      );
    }
  };

  componentDidMount = async () => {
    this.getWeather();
    //To check the API data for Test Case
    // console.log(await axios.get("https://api.openweathermap.org/data/2.5/forecast?&q=Kolkata&APPID=faa3b9d358ff0e05601c8ec6ea446ef5&units=metric").then(results => {
    //   return JSON.stringify(results.data);
    // }));
  };

  getWeather = () => {

    // OpenWeather Info
    const urlToFetch = `${forecastUrl}?&q=${this.state.location
      }&APPID=${openWeatherKey}&units=${this.state.unit}`;

    fetch(urlToFetch)
      .then(results => {
        return results.json();
      })
      .then(data => {
        this.setState({
          fiveDayAPI: data
        });
        this.createFiveDayForecast();
      });
  };

  createFiveDayForecast = () => {
    let currentDate = new Date().setHours(23, 59, 59, 0) / 1000;
    let currentDayIndex = 0;
    let fiveDayForecast = [];
    let fiveDayAPIDataList = this.state.fiveDayAPI.list;
    let weatherTypes = [[], [], [], [], []];
    let upcomingTemps = [];

    // create forecast obbject & upcoming tempratures object

    for (let i = 0; i < 5; i++) {
      fiveDayForecast.push({
        dayOfWeek: "",
        weatherType: "",
        minTemp: "N/A",
        maxTemp: "N/A"
      });
    }

    // loops through everyday from the data
    for (let i = 0; i < fiveDayAPIDataList.length; i++) {
      if (fiveDayAPIDataList[i].dt > currentDate + 93600 * currentDayIndex) {
        // adding data into fiveDayForecast object
        fiveDayForecast[currentDayIndex].dayOfWeek = getDays(
          fiveDayAPIDataList[i].dt * 1000
        );
        fiveDayForecast[
          currentDayIndex
        ].weatherType = commonString(
          weatherTypes[currentDayIndex]
        );

        currentDayIndex++;
        if (currentDayIndex > 4) break;
      }

      // set max temprature
      if (
        fiveDayAPIDataList[i].main.temp_max >
        fiveDayForecast[currentDayIndex].maxTemp ||
        fiveDayForecast[currentDayIndex].maxTemp === "N/A"
      ) {
        fiveDayForecast[currentDayIndex].maxTemp =
          fiveDayAPIDataList[i].main.temp_max;
      }

      // set min temprature
      if (
        fiveDayAPIDataList[i].main.temp_min <
        fiveDayForecast[currentDayIndex].minTemp ||
        fiveDayForecast[currentDayIndex].minTemp === "N/A"
      ) {
        fiveDayForecast[currentDayIndex].minTemp =
          fiveDayAPIDataList[i].main.temp_min;
      }

      // grab all weather types and push into seperate arrays for different days
      weatherTypes[currentDayIndex].push(
        fiveDayAPIDataList[i].weather[0].description
      );

      // create array of upcoming temps for the graph
      if (currentDayIndex > 2) {
        upcomingTemps.push({
          temp: fiveDayAPIDataList[i].main.temp,
          time: fiveDayAPIDataList[i].dt
        });
      }
    }

    //set the state with the 5 day forecast
    this.setState({
      fiveDayForecastState: fiveDayForecast
    });
  };

  render() {
    return (
      this.state.fiveDayForecastState.map((value, i) => {
        return (
          <div className="upcoming-weather-card" key={i}>
            <p className="day-of-week">{value.dayOfWeek}</p>
            <div className="weather-icon">
              <Lottie
                options={setWeatherAnimation(value.weatherType)}
                height={60}
                width={65}
                style={{ margin: 0 }}
              />
            </div>
            <div className="temps">
              <p className="high-temp">{Math.round(value.maxTemp)}°</p>
              <p className="low-temp">{Math.round(value.minTemp)}°</p>
            </div>
          </div>
        );
      })
    );
  };
}
export default ComingWeatherForecast;
