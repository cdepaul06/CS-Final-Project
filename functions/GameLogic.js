//#region Card Generation

const cardColor = (num) => {
  let color;
  if (num % 14 === 13) {
    return "black";
  }
  switch (Math.floor(num / 14)) {
    case 0:
    case 4:
      color = "red";
      break;
    case 1:
    case 5:
      color = "yellow";
      break;
    case 2:
    case 6:
      color = "green";
      break;
    case 3:
    case 7:
      color = "blue";
      break;
  }
  return color;
};

const cardType = (num) => {
  switch (num % 14) {
    case 10: //Skip
      return "Skip";
    case 11: //Reverse
      return "Reverse";
    case 12: //Draw 2
      return "Draw2";
    case 13: //Wild or Wild Draw 4
      if (Math.floor(num / 14) >= 4) {
        return "Draw4";
      } else {
        return "Wild";
      }
    default:
      return "Number " + (num % 14);
  }
};

const cardDeckEl = document.getElementById("card-deck");
const shuffleDealButton = document.getElementById("shuffle-deal");

const cardWidth = 73;
const cardHeight = 110;

// Function to create a canvas with a specific card drawn on it
const createCardElement = (cardImage, x, y) => {
  const canvas = document.createElement("canvas");
  canvas.width = cardWidth;
  canvas.height = cardHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    cardImage,
    x,
    y,
    cardWidth,
    cardHeight,
    0,
    0,
    cardWidth,
    cardHeight
  );
  return canvas;
};

// Load the image
const cardImage = new Image();
cardImage.src = "./assets/deck.svg";

// Create the deck (this is a simplified version)
const deck = [];
cardImage.onload = () => {
  let num = 0; // Start with card number 0
  for (let y = 0; y < cardImage.height; y += cardHeight) {
    for (let x = 0; x < cardImage.width; x += cardWidth) {
      const cardEl = createCardElement(cardImage, x + 1, y - 1); // Adjust for SVG padding, this ensures cards are spaced correctly
      cardEl.dataset.color = cardColor(num);
      cardEl.dataset.type = cardType(num);
      deck.push(cardEl);
      cardDeckEl.appendChild(cardEl);
      num++; // Increment card number for next card
    }
  }
};

// Shuffle the deck
const shuffleDeck = () => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  // Update the DOM
  cardDeckEl.innerHTML = "";
  deck.forEach((cardEl) => {
    cardDeckEl.appendChild(cardEl);
    console.log(
      `Card Color: ${cardEl.dataset.color}, Card Type: ${cardEl.dataset.type}`
    );
  });
};

shuffleDealButton.addEventListener("click", shuffleDeck);
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

  // Close the modal after selection
  document.getElementById("opponentSelectDialog").style.display = "none";
};
//#endregion
