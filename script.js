/* ======================================================
   @author: Gaby Suriel
   @course: CS120
   @assignment: Wordle
   @file: script.js

   @description:
   Game controlling JavaScript logic for the CODENAME WORDLE game.
====================================================== */

$(document).ready(function () {

/* =================== Class: ArmyWordle =================== */
/* Controls the main part of the game in terms of the winning
word (secret code), number of attempts left and commander updates
in relation to attempts left. This is my way of including the class
requiremnt for the assignment. */

class ArmyWordle {

  constructor(answer) {
    this.answer = answer;
    this.attemptNumber = 0;
    this.maxAttempts = 6;
  }

  nextAttempt() {
    this.attemptNumber++;
  }

  missionStatus() {
    let remaining = this.maxAttempts - this.attemptNumber;

    if (remaining > 3) return "SYSTEM STABLE";
    if (remaining > 1) return "SIGNAL DESTABILIZING";
    return "FINAL ATTEMPT!";
  }

}

/* =================== Agent Login =================== */
/* Prompts the user for name so commander dialogue can be personalized saying AGENT (their name) for example. */

let agentName = prompt("ENTER AGENT NAME");
if (agentName === null || agentName.trim() === "") {
  agentName = "Agent";
}

/* =================== Game Variables =================== */
/* Will store main game variables such as the word list, winning word, game status etc. */

let words = [];
let answer = "";
let mission;
let gameOver = false;

/* =================== Load Word List =================== */
/* Gets the word list from JSON file. Tried to make the words simple or military-esque. */

$.getJSON("words.json", function (data) {

  words = data.words;
  startGame();

});

/* =================== Start Mission =================== */
/* Initializes new game and makes fields empty. Preps board. Commander starts calm. */

function startGame() {

  answer = words[Math.floor(Math.random() * words.length)];

  console.log("Answer:", answer);

  mission = new ArmyWordle(answer);

  gameOver = false;

  $("#board").empty();
  $("#letters").empty();
  $("#message").text("");
  $("#restart").hide();

  /* Added lore in to fit theme, make dramatic. */
  $("#operator-face").attr("src", "agent-calm.png");
  $("#operator-message").text(
    "Agent " + agentName +
    ", we intercepted fragmented data from the enemy. If this code is cracked, our units move first."
  );

  buildBoard();
  buildLetters();
  updateAlertBar();

}

/* =================== Build Game Grid =================== */
/* Builds the wordle board. */

function buildBoard() {

  for (let i = 0; i < mission.maxAttempts * 5; i++) {

    $("#board").append("<div class='tile'></div>");

  }

}

/* =================== Used Letter Board =================== */
/* Area and mechanics to show the player what letters have already been played thus far
like traditional wordle does.  */

function buildLetters() {

  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < alphabet.length; i++) {

    $("#letters").append(
      "<div class='letter'>" + alphabet[i] + "</div>"
    );

  }

}

/* =================== Submit Attempt =================== */
/* handles player's input/answer, makes sure its a good length, if too short let user know it has to be 5 letters.
 Also after the player has guessed, clears the word away.*/

$("#submit").click(function () {

  if (gameOver) return;

  let guess = $("#guess").val().toUpperCase();

  if (guess.length !== 5) {

    $("#message").text("THE WORD HAS TO BE 5 LETTERS AGENT!");
    return;

  }

  checkGuess(guess);

  $("#guess").val("");

});

/* =================== Evaluate Attempt =================== */

function checkGuess(guess) {

  /* Determine the right position. mission.attemptNumber represents which row the game is currently on. Rows have
  five letter tiles. Multiply that by five and it will correlate to the correct location for the first tile of the row
  that the game should be in. Since tiles are 0 indexed, guess 1 starts at index 5 (the 6th tile),
  guess 2 at index 10, etc. */

  let start = mission.attemptNumber * 5;

  /* Takes the player's guess and splits into seperate letters. Each letter has to be assessed to see if it is in right
  location, wrong location but in word, etc. so it has to go deeper than just checking the whole word. Then will see where
  the next letter should be placed.*/

  guess.split("").forEach((letter, i) => {

    let tile = $(".tile").eq(start + i);

    /* Places the letter from the players guessed word */
    tile.text(letter);

    /* Show that the tile is correct if the letter is in the answer and in the right spot/location. */
    if (letter === answer[i]) {

      tile.addClass("correct");
      updateUsedLetter(letter, "correct");

    }

    /* Show that the specific letter is in the correct word, but not in the right spot like traditional wordle. */
    else if (answer.includes(letter)) {

      tile.addClass("present");
      updateUsedLetter(letter, "present");

    }
    else {

      /* Show the tile being wrong/absent if the specific letter is not in the winning/correct word at any place. */
      tile.addClass("absent");
      updateUsedLetter(letter, "absent");

    }

  });

  mission.nextAttempt();

  updateAlertBar();
  updateCommander();

  if (guess === answer) {

    $("#message").text("MISSION COMPLETE");

    $("#operator-message").text(
      "Access confirmed. Tuftastic work, " + agentName + "."
    );

    gameOver = true;
    $("#restart").show();

  }
  else if (mission.attemptNumber === mission.maxAttempts) {

    $("#message").text("MISSION FAILED");

    $("#operator-message").text(
      "Lockout confirmed. The enemy has advanced into our territory., " + agentName + "."
    );

    gameOver = true;
    $("#restart").show();

  }

}

/* =================== Update Letter Board =================== */
/* Updates the what letters are used or not. */

function updateUsedLetter(letter, status) {

  $("#letters .letter").each(function () {

    if ($(this).text() === letter) {

      if ($(this).hasClass("correct")) return;

      if ($(this).hasClass("present") && status === "absent") return;

      $(this).removeClass("correct present absent");

      $(this).addClass(status);

    }

  });

}

/* =================== Commander Feedback =================== */
/* Updates the commander portrait/dialogue depending on how many attempts are left. */

function updateCommander() {

  let remaining = mission.maxAttempts - mission.attemptNumber;

  if (remaining > 3) {

    $("#operator-face").attr("src", "agent-calm.png");

    $("#operator-message").text(
      "System stable. Keep narrowing it down, " + agentName + "."
    );

  }
  else if (remaining > 1) {

    $("#operator-face").attr("src", "agent-warning.png");

    $("#operator-message").text(
      "Signals are destabilizing. Focus your search."
    );

  }
  else {

    $("#operator-face").attr("src", "agent-critical.png");

    $("#operator-message").text(
      "This is it, " + agentName + ". One chance before lockout."
    );

  }

}

/* =================== Alert Status Bar =================== */
/* Displays remaining attempts. Can turn red or yellow when low on attempts. Adds DRAMA and STRESS! */

function updateAlertBar() {

  let remaining = mission.maxAttempts - mission.attemptNumber;

  let percent = (remaining / mission.maxAttempts) * 100;

  $("#alert-bar").css("width", percent + "%");

  if (percent <= 40) $("#alert-bar").css("background", "#ffb703");

  if (percent <= 20) $("#alert-bar").css("background", "#ff4d4d");

}

/* =================== Restart Mission =================== */
/* Restart the game to original/starting state. Get a different word from the list to play with. */

$("#restart").click(function () {

  startGame();

});

});