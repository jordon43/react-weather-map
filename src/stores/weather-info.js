import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

class WeatherInfo {
  URL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=59.937500&lon=30.308611&exclude=current,hourly,minutely,alerts&units=metric&appid=7f781f45f57e85638b10d8fd7484c230";

  listWeatherData = null;

  constructor() {
    makeAutoObservable(this);
  }

  convertData = (res) => {
    const weather = [];
    res.data.daily.forEach((day, index) => {
      const dateNow = new Date();
      const date = new Date(day.dt * 1000);
      weather.push({
        date:
          date.getDate().toString() +
          " " +
          date.toLocaleString("ru", { month: "long" }),
        day:
          date.getDay() === dateNow.getDay()
            ? "Сегодня"
            : date.getDay() === dateNow.getDay() + 1
              ? "Завтра"
              : date.toLocaleDateString("ru", {
                  weekday: "long",
                }),
        temperature_day: day.temp.day,
        temperature_night: day.temp.day,
        weather: day.weather[0].main,
      });
    });
    return weather;
  };

  getWeatherData = async () => {
    axios
      .get(this.URL)
      .then((response) => {
        runInAction(() => {
          this.listWeatherData = this.convertData(response);
        });
      })
      .catch((err) => {
        console.log("Ошибка", err);
      });
  };
}

export default new WeatherInfo();
