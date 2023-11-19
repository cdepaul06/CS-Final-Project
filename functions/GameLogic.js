//#region Card Generation

const colors = ["red", "yellow", "green", "blue"];
const values = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "Skip",
  "Reverse",
  "+2",
];
const specialValues = ["Wild", "Wild Draw Four"]; // These don't have a color

// This function can be used to create a single card or even a full deck of cards if we pass an array of numbers
const generateNumCards = (cardColor, cardNumber, isHuman = true) => {
  const parentElement = isHuman
    ? document.getElementById("human-player-cards")
    : document.getElementById("opponent-cards");

  // Create card structure
  const cardElement = document.createElement("div");
  cardElement.classList.add("uno-card", cardColor);

  const topLeft = document.createElement("div");
  topLeft.classList.add("top-left");
  topLeft.innerText = cardNumber;

  const circle = document.createElement("div");
  circle.classList.add("circle");

  const number = document.createElement("div");
  number.classList.add("number");
  number.innerText = cardNumber;

  const bottomRight = document.createElement("div");
  bottomRight.classList.add("bottom-right");
  bottomRight.innerText = cardNumber;

  // Append all parts to the card
  cardElement.appendChild(topLeft);
  cardElement.appendChild(circle);
  cardElement.appendChild(number);
  cardElement.appendChild(bottomRight);

  // Append the card to the parent element
  parentElement.appendChild(cardElement);
};

const generateSpecialCard = (cardColor, cardNumber, isHuman = true) => {
  const parentElement = isHuman
    ? document.getElementById("human-player-cards")
    : document.getElementById("opponent-cards");

  // Create card structure
  const cardElement = document.createElement("div");
  cardElement.classList.add("uno-card", cardColor);

  const topLeft = document.createElement("div");
  topLeft.classList.add("top-left");
  topLeft.innerText = cardNumber;

  const circle = document.createElement("div");
  circle.classList.add("circle");

  const number = document.createElement("div");
  number.classList.add("number");
  number.innerText = cardNumber;

  const bottomRight = document.createElement("div");
  bottomRight.classList.add("bottom-right");
  bottomRight.innerText = cardNumber;

  // Append all parts to the card
  cardElement.appendChild(topLeft);
  cardElement.appendChild(circle);
  cardElement.appendChild(number);
  cardElement.appendChild(bottomRight);

  // Append the card to the parent element
  parentElement.appendChild(cardElement);
};

const getRandomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

const dealCards = (numPlayers, cardsPerPlayer) => {
  for (let i = 0; i < numPlayers; i++) {
    const isHuman = i === 0; // Assuming the first player is human

    for (let j = 0; j < cardsPerPlayer; j++) {
      const isSpecial = Math.random() < 0.2; // Assuming 20% chance for a special card

      if (isSpecial) {
        // For special cards (Wild and Wild Draw Four)
        const cardValue = getRandomElement(specialValues);
        generateSpecialCard("black", cardValue, isHuman);
      } else {
        // For regular cards
        const cardColor = getRandomElement(colors);
        const cardValue = getRandomElement(values);
        generateNumCards(cardColor, cardValue, isHuman);
      }

      // If it's not a human player, you might want to hide the card's face
      // This logic will depend on how you've structured your card generation functions
      // and how you're handling the display of cards for computer players.
    }
  }
};

//#endregion

//#region Modal Logic
// When the page loads, show the modal
window.onload = function () {
  var modal = document.getElementById("opponentSelectDialog");
  modal.style.display = "block";

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };
};
//#endregion

//#region Game Logic
// Function to start the game with the selected number of opponents and player name
const startGame = () => {
  var playerName = document.getElementById("playerName").value.trim();
  var opponentCount = document.getElementById("opponentCount").value;

  if (!playerName) {
    alert("Please enter your name.");
    return;
  }

  // Set the player's name in the playerNameDisplay div
  var playerNameDisplay = document.getElementById("playerNameDisplay");
  playerNameDisplay.innerHTML = "&nbsp;Player: " + playerName;
  playerNameDisplay.style.display = "block"; // Make the container visible

  console.log(
    "Player Name: " +
      playerName +
      ", Starting game with " +
      opponentCount +
      " opponents"
  );
  // Additional game initialization logic

  // Dealing cards
  const totalPlayers = parseInt(opponentCount, 10) + 1; // +1 for the human player
  dealCards(totalPlayers, 7);

  // Close the modal after selection
  document.getElementById("opponentSelectDialog").style.display = "none";
};
//#endregion
