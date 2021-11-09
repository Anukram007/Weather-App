import React from "react";
import Lottie from "react-lottie";
import "../../Styles/main.css";
var animationPaths = require("../Lotties/animationPaths");

class UpcomingWeatherCardContainer extends React.Component {
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

  componentDidMount = () => {
    this.getWeather();
  };

  getWeather = () => {
    // OpenWeather Info

    const openWeatherKey = "faa3b9d358ff0e05601c8ec6ea446ef5";
    const weatherUrl = "https://api.openweathermap.org/data/2.5/forecast";
    const urlToFetch = `${weatherUrl}?&q=${this.state.location
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
        fiveDayForecast[currentDayIndex].dayOfWeek = this.getDays(
          fiveDayAPIDataList[i].dt * 1000
        );
        fiveDayForecast[
          currentDayIndex
        ].weatherType = this.findMostCommonString(
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

  getDays = data => {
    return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(data);
  };

  findMostCommonString = strings => {
    return strings
      .sort(
        (a, b) =>
          strings.filter(v => v === a).length -
          strings.filter(v => v === b).length
      )
      .pop();
  };

  render() {
    return (
      this.state.fiveDayForecastState.map((forecast, i) => {
        return (
          <div className="upcoming-weather-card" key={i}>
            <p className="day-of-week">{forecast.dayOfWeek}</p>
            <div className="weather-icon">
              <Lottie
                options={this.setWeatherAnimation(forecast.weatherType)}
                height={60}
                width={65}
                style={{ margin: 0 }}
              />
            </div>
            <div className="temps">
              <p className="high-temp">{Math.round(forecast.maxTemp)}°</p>
              <p className="low-temp">{Math.round(forecast.minTemp)}°</p>
            </div>
          </div>
        );
      })
    );
  };
}

export default UpcomingWeatherCardContainer;
