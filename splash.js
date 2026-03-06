$(document).ready(function () {

  /* ---------- Nasa APOD API for Background ---------- */
  /* Uses NASA's Astronomy picture API and uses it for the background
  image for the splash page. */

  $.getJSON(
    "https://api.nasa.gov/planetary/apod?api_key=uFIbIp8X4VYxpeqfFrrvbtmjG0VYr3Cp5hKJ7rzY",
    function (data) {
      if (data.media_type === "image") {
        $("#bg").css(
          "background-image",
          "url(" + data.url + ")"
        );
      }
    }
  );

  /* ---------- OpenWeatherMap One API for Weather ---------- */
    /* Uses API to show the weather (temp and condition) on the splash screen for Boston.
    Used my own API key. Formatted the output to be in all caps to match terminal theme (toUpperCase). */

  $.getJSON(
    "https://api.openweathermap.org/data/2.5/weather?q=Boston&units=imperial&appid=313f97515ca835fe46570972483e9ac7",
    function (data) {
      $("#wx-temp").text(Math.round(data.main.temp) + "°F");
      $("#wx-cond").text(data.weather[0].description.toUpperCase());
    }
  );

  /* ---------- Typing Effect Text ---------- */
  /* Words I want to have typed on the terminal. Shows user they are needed to decrypt (solve wordle) and adds to lore. */

  let lines = [
    "DECRYPTION NEEDED",
    "SOURCE NOT KNOWN",
    "SIGNAL ENCRYPTED"
  ];

  let lineIndex = 0;
  let charIndex = 0;

  /* To make the illusion of typed text, timed to reveal a character of the specific string at a time.
  Once at end, will reset and go on to the next line of text. Will loop between the different lines. */

  setInterval(function () {
    $("#typed-text").text(lines[lineIndex].substring(0, charIndex));
    charIndex++;

    if (charIndex > lines[lineIndex].length) {
      charIndex = 0;
      lineIndex = (lineIndex + 1) % lines.length;
    }
  }, 120);

  /* ---------- CTA ---------- */
  /* When user clicks the CTA, the splash screen will fade out. Nice little touch to improve the ui from just blinking
  to next screen. Points to the index.html which is where my wordle game page is. Learned concept via
  W3's Fading lesson page: https://www.w3schools.com/jquery/jquery_fade.asp   */

  $("#intercept-btn").click(function () {
    $("#splash").fadeOut(800, function () {
      window.location.href = "index.html";
    });
  });

});