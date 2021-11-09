var animationPaths = require("../Components/Lotties/animationPaths");
export const openWeatherKey = "faa3b9d358ff0e05601c8ec6ea446ef5";
export const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
export const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

export function getDays(data) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(data);
};

export function commonString(strings) {
  return strings
    .sort(
      (a, b) =>
        strings.filter(v => v === a).length -
        strings.filter(v => v === b).length
    )
    .pop();
};

export function setWeatherAnimation(weatherType) {
  let animationType = getWeatherAnimation(weatherType);
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

function getWeatherAnimation(weatherType) {
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