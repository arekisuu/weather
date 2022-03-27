// Require relevant NPM modules
require("dotenv").config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

// Set up the above modules
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

// Handle 'get' requests on / route by sending the HTML (structure) file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Handle 'post' requests on / route
app.post("/", function(req, res) {
  // Set the inserted city name as a constant using body-parser
  const query = req.body.cityName;
  // Set relevant API data as constants
  const apiKey = process.env.API_KEY;
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
  https.get(url, function(response) {
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const desc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write("<p>The weather is currently " + desc + "</p>");
      res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celsius.</h1>");
      res.write("<img src=" + imgURL + ">");
      res.send();
    });
  });
});

// Listen on specified port and logs on success
app.listen(process.env.PORT || 3000, () => {console.log("Server running on port 3000.")});
