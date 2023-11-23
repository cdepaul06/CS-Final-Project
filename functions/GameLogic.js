//#region Global Variables
var players = []; // Array to hold each player's hand
var deck = []; // Array to hold the deck of cards
const shuffleDealButton = document.getElementById("shuffle-deal");
const cardWidth = 73;
const cardHeight = 110;

//#endregion

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

// Load the image
const cardImage = new Image();
cardImage.src = "./assets/deck.svg";

// Create the deck (this is a simplified version)
cardImage.onload = () => {
  let num = 0;
  for (let y = 0; y < 8 * cardHeight; y += cardHeight) {
    for (let x = 0, count = 0; count < 14; x += cardWidth, count++) {
      // Skip the first card in rows 5-8
      if (y >= 4 * cardHeight && count === 0) {
        num++;
        continue;
      }
      const cardEl = createCardElement(cardImage, x + 1, y - 1);
      cardEl.dataset.color = cardColor(num);
      cardEl.dataset.type = cardType(num);
      deck.push(cardEl);
      // Do not append to cardDeckEl here
      num++;
    }
  }
  // Optionally, show the number of cards in the deck
  console.log("Deck initialized with " + deck.length + " cards.");
};

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
const cardPile = document.getElementById("card-pile");
const cardDeckEl = document.getElementById("card-deck");

// Shuffle the deck
const shuffleDeck = () => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  // Do not append cards to the DOM here
  console.log("Deck shuffled.");
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
  initializePlayers(opponentCount, playerName);
  shuffleDeck();
  dealCards();
};

// Function to initialize players
const initializePlayers = (opponentCount, playerName) => {
  for (let i = 0; i <= opponentCount; i++) {
    players.push({ name: i === 0 ? playerName : `Opponent ${i}`, hand: [] });
  }
};

// Function to deal cards
const dealCards = () => {
  const playerCardsContainer = document.getElementById("player-cards");

  for (let cardCount = 0; cardCount < 7; cardCount++) {
    for (let player of players) {
      if (deck.length > 0) {
        const card = deck.shift();

        if (
          player.name === document.getElementById("playerName").value.trim()
        ) {
          player.hand.push(card);
          playerCardsContainer.appendChild(card); // Add the card to the player's cards container
        } else {
          const backCardEl = createBackCardElement();
          player.hand.push(backCardEl);
          // Handling for opponent's cards...
        }
      }
    }
  }

  const cardsContainer = document.getElementById("cards-container");
  cardsContainer.appendChild(playerCardsContainer); // Append to the specific game area
};

// Function to create an element for the back of a card
const createBackCardElement = () => {
  const img = document.createElement("img");
  img.src = "./assets/uno.svg"; // Path to the back of the card image
  img.alt = "Card Back";
  // Set any additional attributes, styles, or classes as needed
  return img;
};

//#endregion
