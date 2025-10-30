// src/utils/weatherApi.js
export const getWeather = async (location, date = "today") => {
  const apiKey = "8623a741c35ab9e72089f6214e948cd4"; // 🔑 OpenWeather API key
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
    location
  )}&units=metric&lang=vi&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Lỗi khi lấy dữ liệu thời tiết (${response.status})`);

    const data = await response.json();

    if (!data.list || !data.city) {
      throw new Error("Dữ liệu thời tiết không hợp lệ");
    }

    let forecast;
    if (date === "today" || date === "Không xác định") {
      forecast = data.list[0]; // ✅ lấy dự báo gần nhất
    } else {
      forecast = data.list.find((item) =>
        item.dt_txt.startsWith(date) // format "YYYY-MM-DD"
      );
    }

    if (!forecast) {
      throw new Error("Không tìm thấy dự báo cho ngày được yêu cầu");
    }

    const weather = {
      location: data.city.name,
      temp: forecast.main.temp,
      description: forecast.weather[0].description,
      humidity: forecast.main.humidity,
      wind: forecast.wind.speed,
      date: forecast.dt_txt,
    };

    return weather;
  } catch (error) {
    console.error("❌ Weather API error:", error);
    throw error;
  }
};
